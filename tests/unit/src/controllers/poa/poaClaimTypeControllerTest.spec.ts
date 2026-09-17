import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import {
  poaClaimTypePage,
  submitPoaClaimType,
} from "#src/controllers/poa/poaClaimTypeController.js";
import { V7Generator } from "uuidv7";
import { Claim, CostType } from "#src/types/Claim.js";
import { draftService } from "#src/services/draftService.js";
import config from "#config.js";
import { PoaNavigator } from "#src/navigation/poaNavigator.js";

describe("poaClaimTypeController", () => {
  let req: Partial<Request>;
  let res: Response;
  let next: NextFunction;
  let redirectStub: sinon.SinonStub;
  let setCostTypeStub: sinon.SinonStub;
  let redirectFromCostTypeStub: sinon.SinonStub;

  const claimId = new V7Generator().generate();

  beforeEach(() => {
    redirectStub = sinon.stub();

    res = {
      render: sinon.stub(),
      redirect: redirectStub,
      status: sinon.stub().returnsThis(),
      locals: {
        csrfToken: "test-csrf-token",
      },
    } as unknown as Response;

    next = sinon.stub() as unknown as NextFunction;

    setCostTypeStub = sinon.stub(draftService, "setCostType");

    redirectFromCostTypeStub = sinon.stub(
      PoaNavigator.prototype,
      "redirectFromCostType",
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  it("renders the POA claim type choices when profit cost is enabled", () => {
    sinon.stub(config.featureFlags, "poaProfitCostEnabled").value(true);

    req = {
      claim: new Claim({
        id: claimId.toString(),
      }),
    };

    poaClaimTypePage(req as Request, res, next);

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");
    expect(renderArgs.vm.title.key).to.equal("pages.poaClaimType.title");
    expect(renderArgs.vm.radios.name).to.equal("poaClaimType");
    expect(renderArgs.vm.radios.items).to.deep.include.members([
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

  it("does not render the profit cost choice when profit cost is disabled", () => {
    sinon.stub(config.featureFlags, "poaProfitCostEnabled").value(false);

    req = {
      claim: new Claim({
        id: claimId.toString(),
      }),
    };

    poaClaimTypePage(req as Request, res, next);

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.vm.radios.items).to.not.deep.include({
      value: "PROFIT_COST",
      text: {
        key: "pages.poaClaimType.profitCost.text",
      },
      checked: false,
    });

    expect(renderArgs.vm.radios.items).to.deep.include.members([
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

  it("redirects when valid submission", async () => {
    const redirect = "/next-page";
    sinon.stub(config.featureFlags, "poaProfitCostEnabled").value(true);

    req = {
      claim: new Claim({
        id: claimId.toString(),
      }),
      body: {
        poaClaimType: "PROFIT_COST",
      },
      query: {},
    };

    setCostTypeStub.resolves({
      status: "success",
      body: null,
    });

    redirectFromCostTypeStub.returns(redirect);

    await submitPoaClaimType(req as Request, res, next);

    expect(redirectFromCostTypeStub.calledOnceWith(CostType.PROFIT_COST)).to.be.true;
    expect(redirectStub.calledWith(redirect)).to.be.true;
  });

  it("rerenders the radio question page with an error when no option is selected", async () => {
    req = {
      body: {},
    };

    await submitPoaClaimType(req as Request, res, next);

    expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/radioQuestionPage.njk",
    );
  });

  it("rerenders with selected invalid string preserved when invalid option is submitted", async () => {
    req = {
      body: {
        poaClaimType: "something-invalid",
      },
    };

    await submitPoaClaimType(req as Request, res, next);

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(
      renderArgs.vm.radios.items.every(
        (choice: { checked: boolean }) => !choice.checked,
      ),
    ).to.equal(true);
  });
});