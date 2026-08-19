import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import { buildRoute, ROUTES } from "#routes/helper.js";
import {
  expertCostDetails,
  submitExpertCostDetails,
} from "#src/controllers/poa/expertCostDetailsController.js";
import { V7Generator } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import { Category, CostType } from "#src/types/Claim.js";
import { LocalDate } from "#src/types/date.js";

describe("expertCostDetailsController", () => {
  let res: Response;
  let next: NextFunction;
  let getLineItemStub: sinon.SinonStub;
  let createLineItemStub: sinon.SinonStub;
  let updateLineItemStub: sinon.SinonStub;

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

    getLineItemStub = sinon.stub(claimService, "getLineItem");
    createLineItemStub = sinon.stub(claimService, "addLineItemToClaim");
    updateLineItemStub = sinon.stub(claimService, "updateLineItem");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("renders the page when there isn't a line item ID", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
      query: {},
    } as unknown as Request;

    await expertCostDetails(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.be.true;
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/poa/expertCostDetailsView.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");

    expect(renderArgs.vm.activityDateInput.items[0].value).to.be.undefined;
    expect(renderArgs.vm.activityDateInput.items[1].value).to.be.undefined;
    expect(renderArgs.vm.activityDateInput.items[2].value).to.be.undefined;
    expect(renderArgs.vm.actualNetValueInput.value).to.be.undefined;
    expect(renderArgs.vm.vatApplicableRadios.items[0].checked).to.equal(false);
    expect(renderArgs.vm.vatApplicableRadios.items[1].checked).to.equal(false);
    expect(renderArgs.vm.feeEarnerNameInput.value).to.be.undefined;
    expect(renderArgs.vm.descriptionInput.value).to.be.undefined;
  });

  it("renders the page when there is a line item ID", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
      query: {
        lineItemId: lineItemId.toString(),
      },
    } as unknown as Request;

    getLineItemStub.resolves({
      status: "success",
      body: {
        id: lineItemId.toString(),
        title: "Interim hearing on 20 December 2023",
        category: Category.DISBURSEMENT,
        date: new LocalDate(4, 1, 2024),
        evidenceItems: [],
        actualNetValue: 123,
        vatApplicable: false,
        feeEarnerName: "Joe Bloggs",
      },
    });

    await expertCostDetails(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.be.true;
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/poa/expertCostDetailsView.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");

    expect(renderArgs.vm.activityDateInput.items[0].value).to.equal(4);
    expect(renderArgs.vm.activityDateInput.items[1].value).to.equal(1);
    expect(renderArgs.vm.activityDateInput.items[2].value).to.equal(2024);
    expect(renderArgs.vm.actualNetValueInput.value).to.equal(123);
    expect(renderArgs.vm.vatApplicableRadios.items[0].checked).to.equal(false);
    expect(renderArgs.vm.vatApplicableRadios.items[1].checked).to.equal(true);
    expect(renderArgs.vm.feeEarnerNameInput.value).to.equal("Joe Bloggs");
    expect(renderArgs.vm.descriptionInput.value).to.equal(
      "Interim hearing on 20 December 2023",
    );
  });

  it("redirects to POA evidence upload when form is valid when there isn't a line item ID", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
      query: {},
      body: {
        activityDateDay: "27",
        activityDateMonth: "3",
        activityDateYear: "2007",
        actualNetValue: "123.45",
        vatApplies: "yes",
        feeEarnerName: "John Smith",
        description: "Lorem ipsum",
      },
    } as unknown as Request;

    createLineItemStub.resolves({
      status: "success",
      body: null,
    });

    await submitExpertCostDetails(req, res, next);

    expect(createLineItemStub.firstCall.args[1]).to.deep.equal(claimId);

    expect(createLineItemStub.firstCall.args[2]).to.deep.equal({
      type: CostType.EXPERT_COST,
      value: {
        activityDate: new LocalDate(27, 3, 2007),
        actualNetValue: 123.45,
        vatApplies: true,
        feeEarnerName: "John Smith",
        description: "Lorem ipsum",
      },
    });

    expect(
      (res.redirect as sinon.SinonStub).calledWith(
        buildRoute(ROUTES.ADD_ANOTHER_EXPERT_COST_DETAILS, {
          claimId: claimId,
        }),
      ),
    ).to.be.true;
  });

  it("redirects to POA evidence upload when form is valid when there is a line item ID", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
      query: {
        lineItemId: lineItemId.toString(),
      },
      body: {
        activityDateDay: "27",
        activityDateMonth: "3",
        activityDateYear: "2007",
        actualNetValue: "123.45",
        vatApplies: "yes",
        feeEarnerName: "John Smith",
        description: "Lorem ipsum",
      },
    } as unknown as Request;

    updateLineItemStub.resolves({
      status: "success",
      body: null,
    });

    await submitExpertCostDetails(req, res, next);

    expect(updateLineItemStub.firstCall.args[1]).to.deep.equal(claimId);

    expect(updateLineItemStub.firstCall.args[2]).to.deep.equal(lineItemId);

    expect(updateLineItemStub.firstCall.args[3]).to.deep.equal({
      type: CostType.EXPERT_COST,
      value: {
        activityDate: new LocalDate(27, 3, 2007),
        actualNetValue: 123.45,
        vatApplies: true,
        feeEarnerName: "John Smith",
        description: "Lorem ipsum",
      },
    });

    expect(
      (res.redirect as sinon.SinonStub).calledWith(
        buildRoute(ROUTES.ADD_ANOTHER_EXPERT_COST_DETAILS, {
          claimId: claimId,
        }),
      ),
    ).to.be.true;
  });

  it("rerenders with 400 when form is invalid", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
      query: {},
      body: {},
    } as unknown as Request;

    await submitExpertCostDetails(req, res, next);

    expect((res.status as sinon.SinonStub).calledWith(400)).to.be.true;
    expect((res.render as sinon.SinonStub).calledOnce).to.be.true;
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/poa/expertCostDetailsView.njk",
    );
  });
});
