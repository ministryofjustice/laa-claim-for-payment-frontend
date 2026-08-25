import { expect } from "chai";
import { describe, it, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import { V7Generator } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import {
  Category,
  Claim,
  CostType,
  DisbursementLineItem,
} from "#src/types/Claim.js";
import { confirmRemoveExpertLineItem, submitRemoveExpertLineItem } from "#src/controllers/poa/removeDisbursementController.js";
import { LocalDate } from "#src/types/date.js";
import { buildRoute, ROUTES } from "#routes/helper.js";

describe("removeDisbursementController", () => {
  let res: Response;
  let next: NextFunction;
  let getClaimStub: sinon.SinonStub;
  let deleteLineItemStub: sinon.SinonStub;

  const claimId = new V7Generator().generate();
  const lineItemId = new V7Generator().generate();

  const lineItem: DisbursementLineItem =  {
    id: lineItemId.toString(),
    title: "",
    category: Category.BILL_NARRATIVE,
    date: LocalDate.of(1, 1, 2026),
    evidenceItems: [],
    feeEarnerName: "",
    vatApplicable: false,
    actualNetValue: 0,
    netProfitCostAmount: undefined,
    netAdvocacyCostAmount: undefined
  }

  let axiosMiddleware: any;

  beforeEach(() => {
    axiosMiddleware = {};

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
    deleteLineItemStub = sinon.stub(claimService, "deleteLineItem");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("renders the confirm remove expert cost line item radio question page", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
        lineItemId: lineItemId.toString()
      },
    } as unknown as Request;

    getClaimStub.resolves({
      status: "success",
      body: new Claim({
        id: claimId.toString(),
        costType: CostType.EXPERT_COST,
        lineItems: [
          lineItem,
        ]
      }),
    });

    await confirmRemoveExpertLineItem(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/radioQuestionPage.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");
    expect(renderArgs.vm.title.key).to.equal("pages.poa.expertCostDetails.remove.title");
    expect(renderArgs.vm.radios.name).to.equal("confirmRemoveExpertLineItem");
  });

  it("renders the confirm remove non-expert disbursement line item radio question page", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
        lineItemId: lineItemId.toString()
      },
    } as unknown as Request;

    getClaimStub.resolves({
      status: "success",
      body: new Claim({
        id: claimId.toString(),
        costType: CostType.NON_EXPERT_DISBURSEMENT,
        lineItems: [
          lineItem,
        ]
      }),
    });

    await confirmRemoveExpertLineItem(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/radioQuestionPage.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");
    expect(renderArgs.vm.title.key).to.equal("pages.poa.nonExpertDisbursementDetails.remove.title");
    expect(renderArgs.vm.radios.name).to.equal("confirmRemoveExpertLineItem");
  });

  it("redirects when cost type is profit cost", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
        lineItemId: lineItemId.toString()
      },
    } as unknown as Request;

    getClaimStub.resolves({
      status: "success",
      body: new Claim({
        id: claimId.toString(),
        costType: CostType.PROFIT_COST,
        lineItems: [
          lineItem,
        ]
      }),
    });

    await confirmRemoveExpertLineItem(req, res, next);

    expect(
      (res.redirect as sinon.SinonStub).calledWith(
        buildRoute(ROUTES.POA.CLAIM_TYPE, {
          claimId: claimId,
        }),
      ),
    ).to.be.true;
  });

  it("redirects when no cost type", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
        lineItemId: lineItemId.toString()
      },
    } as unknown as Request;

    getClaimStub.resolves({
      status: "success",
      body: new Claim({
        id: claimId.toString(),
        lineItems: [
          lineItem,
        ]
      }),
    });

    await confirmRemoveExpertLineItem(req, res, next);

    expect(
      (res.redirect as sinon.SinonStub).calledWith(
        buildRoute(ROUTES.POA.CLAIM_TYPE, {
          claimId: claimId,
        }),
      ),
    ).to.be.true;
  });

  it("redirects back to add a line when deleting", async () => {
    const req = {
      axiosMiddleware,
      params: {
        claimId: claimId.toString(),
        lineItemId: lineItemId.toString(),
      },
      body: {
        confirmRemoveExpertLineItem: "yes",
      },
    } as unknown as Request;

    getClaimStub.resolves({
      status: "success",
      body: new Claim({
        id: claimId.toString(),
        costType: CostType.EXPERT_COST,
        lineItems: [
          lineItem,
        ]
      }),
    });

    deleteLineItemStub.resolves({
      status: "success",
    });

    await submitRemoveExpertLineItem(req, res, next);

    expect(
      deleteLineItemStub.calledWith(
        axiosMiddleware,
        claimId,
        lineItemId,
      ),
    ).to.equal(true);

    expect((res.redirect as sinon.SinonStub).calledWith(
      `/claims/${claimId.toString()}/poa/disbursement-details/add`,
    )).to.equal(true);
  });

  it("redirects back to add a line when NOT deleting", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
        lineItemId: lineItemId.toString(),
      },
      body: {
        confirmRemoveExpertLineItem: "no",
      },
    } as unknown as Request;

    getClaimStub.resolves({
      status: "success",
      body: new Claim({
        id: claimId.toString(),
        costType: CostType.EXPERT_COST,
        lineItems: [
          lineItem,
        ]
      }),
    });

    await submitRemoveExpertLineItem(req, res, next);

    expect(
      deleteLineItemStub.called,
    ).to.be.false;

    expect((res.redirect as sinon.SinonStub).calledWith(
      `/claims/${claimId.toString()}/poa/disbursement-details/add`,
    )).to.equal(true);
  });

  it("rerenders the radio question page with an error when no option is selected", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
        lineItemId: lineItemId.toString(),
      },
      body: {},
    } as unknown as Request;

    getClaimStub.resolves({
      status: "success",
      body: new Claim({
        id: claimId.toString(),
        costType: CostType.EXPERT_COST,
        lineItems: [
          lineItem,
        ]
      }),
    });

    await submitRemoveExpertLineItem(req, res, next);

    expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/radioQuestionPage.njk",
    );
  });

});