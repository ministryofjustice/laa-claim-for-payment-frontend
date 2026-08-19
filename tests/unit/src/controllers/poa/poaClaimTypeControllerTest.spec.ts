import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import {
  poaClaimTypePage,
  submitPoaClaimType,
} from "#src/controllers/poa/poaClaimTypeController.js";
import { V7Generator } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import { Claim } from "#src/types/Claim.js";
import { draftService } from "#src/services/draftService.js";
import config from "#config.js";

describe("poaClaimTypeController", () => {
  let req: Partial<Request>;
  let res: Response;
  let next: NextFunction;
  let getClaimStub: sinon.SinonStub;
  let setCostTypeStub: sinon.SinonStub;

  const claimId = new V7Generator().generate();

  beforeEach(() => {
    res = {
      render: sinon.stub(),
      redirect: sinon.stub(),
      status: sinon.stub().returnsThis(),
      locals: {
        csrfToken: "test-csrf-token",
      },
    } as unknown as Response;

    next = sinon.stub() as unknown as NextFunction;

    getClaimStub = sinon.stub(claimService, "getDraftClaim");
    setCostTypeStub = sinon.stub(draftService, "setCostType");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("renders the POA claim type choices when profit cost is enabled", async () => {
    sinon.stub(config.featureFlags, "poaProfitCostEnabled").value(true);

    req = {
      params: {
        claimId: claimId.toString(),
      },
    };

    getClaimStub.resolves({
      status: "success",
      body: new Claim({
        id: claimId.toString(),
      }),
    });

    await poaClaimTypePage(req as Request, res, next);

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.vm.form.choices).to.deep.include.members([
      {
        value: "PROFIT_COST",
        text: {
          key: "pages.poaClaimType.profitCost.text",
        },
        checked: false,
      },
      {
        value: "EXPERT_COST",
        text: {
          key: "pages.poaClaimType.expertCost.text",
        },
        checked: false,
      },
      {
        value: "NON_EXPERT_DISBURSEMENT",
        text: {
          key: "pages.poaClaimType.nonExpertDisbursement.text",
        },
        checked: false,
      },
    ]);
  });

  it("does not render the profit cost choice when profit cost is disabled", async () => {
    sinon.stub(config.featureFlags, "poaProfitCostEnabled").value(false);

    req = {
      params: {
        claimId: claimId.toString(),
      },
    };

    getClaimStub.resolves({
      status: "success",
      body: new Claim({
        id: claimId.toString(),
      }),
    });

    await poaClaimTypePage(req as Request, res, next);

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.vm.form.choices).to.not.deep.include({
      value: "PROFIT_COST",
      text: {
        key: "pages.poaClaimType.profitCost.text",
      },
      checked: false,
    });

    expect(renderArgs.vm.form.choices).to.deep.include.members([
      {
        value: "EXPERT_COST",
        text: {
          key: "pages.poaClaimType.expertCost.text",
        },
        checked: false,
      },
      {
        value: "NON_EXPERT_DISBURSEMENT",
        text: {
          key: "pages.poaClaimType.nonExpertDisbursement.text",
        },
        checked: false,
      },
    ]);
  });

  it("redirects to profit cost details when Profit cost is selected", async () => {
    sinon.stub(config.featureFlags, "poaProfitCostEnabled").value(true);

    req = {
      params: {
        claimId: claimId.toString(),
      },
      body: {
        poaClaimType: "PROFIT_COST",
      },
    };

    getClaimStub.resolves({
      status: "success",
      body: new Claim({
        id: claimId.toString(),
      }),
    });

    setCostTypeStub.resolves({
      status: "success",
      body: null,
    });

    await submitPoaClaimType(req as Request, res, next);

    expect((res.redirect as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.redirect as sinon.SinonStub).firstCall.args).to.deep.equal([
      `/claims/${claimId.toString()}/poa/profit-cost-details`,
    ]);
  });

  it("redirects to expert cost details when Expert cost is selected", async () => {
    req = {
      params: {
        claimId: claimId.toString(),
      },
      body: {
        poaClaimType: "EXPERT_COST",
      },
    };

    getClaimStub.resolves({
      status: "success",
      body: new Claim({
        id: claimId.toString(),
      }),
    });

    setCostTypeStub.resolves({
      status: "success",
      body: null,
    });

    await submitPoaClaimType(req as Request, res, next);

    expect((res.redirect as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.redirect as sinon.SinonStub).firstCall.args).to.deep.equal([
      `/claims/${claimId}/poa/expert-cost-details/add`,
    ]);
  });

  it("redirects to non expert disbursement when Non expert disbursement is selected", async () => {
    req = {
      params: {
        claimId: claimId.toString(),
      },
      body: {
        poaClaimType: "NON_EXPERT_DISBURSEMENT",
      },
    };

    getClaimStub.resolves({
      status: "success",
      body: new Claim({
        id: claimId.toString(),
      }),
    });

    setCostTypeStub.resolves({
      status: "success",
      body: null,
    });

    await submitPoaClaimType(req as Request, res, next);

    expect((res.redirect as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.redirect as sinon.SinonStub).firstCall.args).to.deep.equal([
      `/claims/${claimId}/poa/non-expert-disbursement`,
    ]);
  });

  it("rerenders the radio question page with an error when no option is selected", async () => {
    req = {
      params: {
        claimId: claimId.toString(),
      },
      body: {},
    };

    await submitPoaClaimType(req as Request, res, next);

    expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/radioQuestionPage.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.vm.form.error).to.deep.equal({
      fieldName: "poaClaimType",
      href: "#poaClaimType",
      text: {
        key: "pages.poaClaimType.errors.empty",
      },
    });
  });

  it("rerenders with selected invalid string preserved when invalid option is submitted", async () => {
    req = {
      params: {
        claimId: claimId.toString(),
      },
      body: {
        poaClaimType: "something-invalid",
      },
    };

    await submitPoaClaimType(req as Request, res, next);

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.vm.form.error).to.deep.equal({
      fieldName: "poaClaimType",
      href: "#poaClaimType",
      text: {
        key: "pages.poaClaimType.errors.empty",
      },
    });

    expect(
      renderArgs.vm.form.choices.every(
        (choice: { checked: boolean }) => !choice.checked,
      ),
    ).to.equal(true);
  });
});