import { expect } from "chai";
import { describe, it, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import { V7Generator } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import { Category } from "#src/types/Claim.js";
import { confirmRemoveExpertLineItem, submitRemoveExpertLineItem } from "#src/controllers/poa/removeExpertLineItemController.js";

describe("removeExpertLineItemController", () => {
  let res: Response;
  let next: NextFunction;
  let getLineItemStub: sinon.SinonStub;
  let deleteLineItemStub: sinon.SinonStub;

  const claimId = new V7Generator().generate();
  const lineItemId = new V7Generator().generate();

  const lineItem =  {
    id: lineItemId,
    title: "",
    category: Category.BILL_NARRATIVE,
    date: new Date(),
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

    getLineItemStub = sinon.stub(claimService, "getLineItem");
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

    getLineItemStub.resolves({
      status: "success",
      body: lineItem,
    });

    await confirmRemoveExpertLineItem(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/radioQuestionPage.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");
    expect(renderArgs.vm.title.key).to.equal("pages.poa.removeExpertLineItem.question");
    expect(renderArgs.vm.form.fieldName).to.equal("confirmRemoveExpertLineItem");
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
      `/claims/${claimId.toString()}/poa/expert-cost-details/add`,
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


    await submitRemoveExpertLineItem(req, res, next);

    expect(
      deleteLineItemStub.called,
    ).to.be.false;

    expect((res.redirect as sinon.SinonStub).calledWith(
      `/claims/${claimId.toString()}/poa/expert-cost-details/add`,
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

    await submitRemoveExpertLineItem(req, res, next);

    expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/radioQuestionPage.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.vm.form.error).to.deep.equal({
      fieldName: "confirmRemoveExpertLineItem",
      href: "#confirmRemoveExpertLineItem",
      text: {
        key: "pages.poa.removeExpertLineItem.errors.empty"
      },
    });
  });

});