import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import { V7Generator } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import { Category, Claim, CostType } from "#src/types/Claim.js";
import {
  addAnotherDisbursement,
  submitAddAnotherDisbursement,
} from "#src/controllers/poa/addAnotherDisbursementController.js";
import { LocalDate } from "#src/types/date.js";

describe("addAnotherDisbursementController", () => {
  let res: Response;
  let next: NextFunction;
  let getClaimStub: sinon.SinonStub;

  const claimId = new V7Generator().generate();
  const lineItemId = new V7Generator().generate();

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
  });

  afterEach(() => {
    sinon.restore();
  });

  it("renders the add another expert cost page", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
    } as unknown as Request;

    getClaimStub.resolves({
      status: "success",
      body: new Claim({
        id: claimId.toString(),
        costType: CostType.EXPERT_COST,
        lineItems: [
          {
            id: lineItemId.toString(),
            title: "Line item 1",
            category: Category.DISBURSEMENT,
            date: new LocalDate(18, 3, 2025),
            evidenceItems: [],
          },
        ],
      }),
    });

    await addAnotherDisbursement(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/poa/addAnotherDisbursementView.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");
    expect(renderArgs.vm.title.key).to.equal(
      "pages.poa.expertCostDetails.addAnother.title.singular",
    );
    expect(renderArgs.vm.radioQuestionViewModel.radios.name).to.equal("addAnother");
  });

  it("renders the add another non-expert disbursement page", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
    } as unknown as Request;

    getClaimStub.resolves({
      status: "success",
      body: new Claim({
        id: claimId.toString(),
        costType: CostType.NON_EXPERT_DISBURSEMENT,
        lineItems: [
          {
            id: lineItemId.toString(),
            title: "Line item 1",
            category: Category.DISBURSEMENT,
            date: new LocalDate(18, 3, 2025),
            evidenceItems: [],
          },
        ],
      }),
    });

    await addAnotherDisbursement(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/poa/addAnotherDisbursementView.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");
    expect(renderArgs.vm.title.key).to.equal(
      "pages.poa.nonExpertDisbursementDetails.addAnother.title.singular",
    );
    expect(renderArgs.vm.radioQuestionViewModel.radios.name).to.equal("addAnother");
  });

  it("redirects when profit cost type", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
    } as unknown as Request;

    getClaimStub.resolves({
      status: "success",
      body: new Claim({
        id: claimId.toString(),
        costType: CostType.PROFIT_COST,
      }),
    });

    await addAnotherDisbursement(req, res, next);

    expect(
      (res.redirect as sinon.SinonStub).calledWith(
        `/claims/${claimId.toString()}/poa/claim-type`,
      ),
    ).to.equal(true);
  });

  it("redirects when no cost type", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
    } as unknown as Request;

    getClaimStub.resolves({
      status: "success",
      body: new Claim({
        id: claimId.toString(),
      }),
    });

    await addAnotherDisbursement(req, res, next);

    expect(
      (res.redirect as sinon.SinonStub).calledWith(
        `/claims/${claimId.toString()}/poa/claim-type`,
      ),
    ).to.equal(true);
  });

  it("redirects to expert cost page when no line items", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
    } as unknown as Request;

    getClaimStub.resolves({
      status: "success",
      body: new Claim({
        id: claimId.toString(),
        costType: CostType.EXPERT_COST,
        lineItems: [],
      }),
    });

    await addAnotherDisbursement(req, res, next);

    expect(
      (res.redirect as sinon.SinonStub).calledWith(
        `/claims/${claimId.toString()}/poa/disbursement-details`,
      ),
    ).to.equal(true);
  });

  it("redirects to expert cost details when yes selected", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
      body: {
        addAnother: "yes",
      },
    } as unknown as Request;

    getClaimStub.resolves({
      status: "success",
      body: new Claim({
        id: claimId.toString(),
        costType: CostType.EXPERT_COST,
      }),
    });

    await submitAddAnotherDisbursement(req, res, next);

    expect(
      (res.redirect as sinon.SinonStub).calledWith(
        `/claims/${claimId.toString()}/poa/disbursement-details`,
      ),
    ).to.equal(true);
  });

  it("redirects to evidence upload when no selected", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
      body: {
        addAnother: "no",
      },
    } as unknown as Request;

    getClaimStub.resolves({
      status: "success",
      body: new Claim({
        id: claimId.toString(),
        costType: CostType.EXPERT_COST,
      }),
    });

    await submitAddAnotherDisbursement(req, res, next);

    expect(
      (res.redirect as sinon.SinonStub).calledWith(
        `/claims/${claimId.toString()}/poa/evidence-upload`,
      ),
    ).to.equal(true);
  });

  it("rerenders the radio question page with an error when no option is selected", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
      body: {},
    } as unknown as Request;

    getClaimStub.resolves({
      status: "success",
      body: new Claim({
        id: claimId.toString(),
        costType: CostType.EXPERT_COST,
      }),
    });

    await submitAddAnotherDisbursement(req, res, next);

    expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/poa/addAnotherDisbursementView.njk",
    );
  });

  it("rerenders with selected invalid string preserved when invalid option is submitted", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
      body: {
        addAnother: "invalid",
      },
    } as unknown as Request;

    getClaimStub.resolves({
      status: "success",
      body: new Claim({
        id: claimId.toString(),
        costType: CostType.EXPERT_COST,
      }),
    });

    await submitAddAnotherDisbursement(req, res, next);

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(
      renderArgs.vm.radioQuestionViewModel.radios.items.every(
        (choice: { checked: boolean }) => !choice.checked,
      ),
    ).to.equal(true);
  });
});
