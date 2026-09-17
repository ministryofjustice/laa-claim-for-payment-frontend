import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "mocha";
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
import {
  confirmRemoveExpertLineItem,
  submitRemoveExpertLineItem,
} from "#src/controllers/poa/removeDisbursementController.js";
import { LocalDate } from "#src/types/date.js";
import { PoaNavigator } from "#src/navigation/poaNavigator.js";

describe("removeDisbursementController", () => {
  let res: Response;
  let next: NextFunction;
  let redirectStub: sinon.SinonStub;
  let deleteLineItemStub: sinon.SinonStub;
  let redirectFromRemoveDisbursementStub: sinon.SinonStub;

  const claimId = new V7Generator().generate();
  const lineItemId = new V7Generator().generate();

  const lineItem: DisbursementLineItem = {
    id: lineItemId.toString(),
    title: "",
    category: Category.BILL_NARRATIVE,
    date: LocalDate.of(1, 1, 2026),
    evidenceItems: [],
    feeEarnerName: "",
    vatApplicable: false,
    actualNetValue: 0,
    netProfitCostAmount: undefined,
    netAdvocacyCostAmount: undefined,
  };

  let axiosMiddleware: any;

  beforeEach(() => {
    axiosMiddleware = {};

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

    deleteLineItemStub = sinon.stub(claimService, "deleteLineItem");

    redirectFromRemoveDisbursementStub = sinon.stub(
      PoaNavigator.prototype,
      "redirectFromRemoveDisbursement",
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  it("renders the confirm remove expert cost line item radio question page", () => {
    const req = {
      claim: new Claim({
        id: claimId.toString(),
        costType: CostType.EXPERT_COST,
        lineItems: [lineItem],
      }),
      params: {
        lineItemId: lineItemId.toString(),
      },
    } as unknown as Request;

    confirmRemoveExpertLineItem(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/radioQuestionPage.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");
    expect(renderArgs.vm.title.key).to.equal(
      "pages.poa.expertCostDetails.remove.title",
    );
    expect(renderArgs.vm.radios.name).to.equal("confirmRemoveExpertLineItem");
  });

  it("renders the confirm remove non-expert disbursement line item radio question page", () => {
    const req = {
      claim: new Claim({
        id: claimId.toString(),
        costType: CostType.NON_EXPERT_DISBURSEMENT,
        lineItems: [lineItem],
      }),
      params: {
        lineItemId: lineItemId.toString(),
      },
    } as unknown as Request;

    confirmRemoveExpertLineItem(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/radioQuestionPage.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");
    expect(renderArgs.vm.title.key).to.equal(
      "pages.poa.nonExpertDisbursementDetails.remove.title",
    );
    expect(renderArgs.vm.radios.name).to.equal("confirmRemoveExpertLineItem");
  });

  it("errors when cost type is profit cost", () => {
    const req = {
      claim: new Claim({
        id: claimId.toString(),
        costType: CostType.PROFIT_COST,
        lineItems: [lineItem],
      }),
      params: {
        lineItemId: lineItemId.toString(),
      },
    } as unknown as Request;

    confirmRemoveExpertLineItem(req, res, next);

    expect((next as sinon.SinonStub).calledOnce).to.be.true;
    expect((next as sinon.SinonStub).firstCall.args[0]).to.be.instanceOf(Error);
  });

  it("errors when no cost type", () => {
    const req = {
      claim: new Claim({
        id: claimId.toString(),
        lineItems: [lineItem],
      }),
      params: {
        lineItemId: lineItemId.toString(),
      },
    } as unknown as Request;

    confirmRemoveExpertLineItem(req, res, next);

    expect((next as sinon.SinonStub).calledOnce).to.be.true;
    expect((next as sinon.SinonStub).firstCall.args[0]).to.be.instanceOf(Error);
  });

  it("redirects when deleting", async () => {
    const redirect = "/next-page";
    const req = {
      axiosMiddleware,
      claim: new Claim({
        id: claimId.toString(),
        costType: CostType.EXPERT_COST,
        lineItems: [lineItem],
      }),
      params: {
        lineItemId: lineItemId.toString(),
      },
      body: {
        confirmRemoveExpertLineItem: "yes",
      },
    } as unknown as Request;

    deleteLineItemStub.resolves({
      status: "success",
    });

    redirectFromRemoveDisbursementStub.returns(redirect);

    await submitRemoveExpertLineItem(req, res, next);

    expect(
      deleteLineItemStub.calledWith(
        axiosMiddleware,
        claimId.toString(),
        lineItemId.toString(),
      ),
    ).to.equal(true);

    expect(redirectFromRemoveDisbursementStub.calledOnce).to.be.true;
    expect(redirectStub.calledWith(redirect)).to.be.true;
  });

  it("redirects when NOT deleting", async () => {
    const redirect = "/next-page";
    const req = {
      claim: new Claim({
        id: claimId.toString(),
        costType: CostType.EXPERT_COST,
        lineItems: [lineItem],
      }),
      params: {
        lineItemId: lineItemId.toString(),
      },
      body: {
        confirmRemoveExpertLineItem: "no",
      },
    } as unknown as Request;

    redirectFromRemoveDisbursementStub.returns(redirect);

    await submitRemoveExpertLineItem(req, res, next);

    expect(deleteLineItemStub.called).to.be.false;

    expect(redirectFromRemoveDisbursementStub.calledOnce).to.be.true;
    expect(redirectStub.calledWith(redirect)).to.be.true;
  });

  it("rerenders the radio question page with an error when no option is selected", async () => {
    const req = {
      claim: new Claim({
        id: claimId.toString(),
        costType: CostType.EXPERT_COST,
        lineItems: [lineItem],
      }),
      params: {
        lineItemId: lineItemId.toString(),
      },
      body: {},
    } as unknown as Request;

    await submitRemoveExpertLineItem(req, res, next);

    expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/radioQuestionPage.njk",
    );
  });
});