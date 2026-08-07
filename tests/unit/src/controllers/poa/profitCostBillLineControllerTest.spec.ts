import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import {
  profitCostBillLine,
  submitProfitCostBillLine,
} from "#src/controllers/poa/profitCostBillLineController.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { V7Generator } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import { Category, Claim, CostType } from "#src/types/Claim.js";
import { LocalDate } from "#src/types/date.js";

describe("profitCostBillLineController", () => {
  let res: Response;
  let next: NextFunction;
  let getClaimStub: sinon.SinonStub;
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

    getClaimStub = sinon.stub(claimService, "getDraftClaim");
    createLineItemStub = sinon.stub(claimService, "addLineItemToClaim");
    updateLineItemStub = sinon.stub(claimService, "updateLineItem");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("renders the profit cost bill line page", async () => {
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

    await profitCostBillLine(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/poa/profitCostBillLineView.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");
    expect(renderArgs.vm.title).to.equal("pages.profitCostBillLine.title");
  });

  it("renders the profit cost bill line page when line item exists", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
    } as unknown as Request;

    getClaimStub.resolves({
      status: "success",
      body: new Claim({
        id: claimId.toString(),
        lineItems: [
          {
            id: lineItemId.toString(),
            title: "Some line item",
            category: Category.DISBURSEMENT,
            date: new LocalDate(4, 1, 2024),
            evidenceItems: [],
            netProfitCostAmount: 123,
            netAdvocacyCostAmount: 456,
            vatApplicable: false,
            feeEarnerName: "Joe Bloggs",
          },
        ],
      }),
    });

    await profitCostBillLine(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/poa/profitCostBillLineView.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");
    expect(renderArgs.vm.title).to.equal("pages.profitCostBillLine.title");
    expect(renderArgs.lineItemId).to.equal(lineItemId.toString());

    expect(renderArgs.vm.form.activityDate.value.day).to.equal("4");
    expect(renderArgs.vm.form.activityDate.value.month).to.equal("1");
    expect(renderArgs.vm.form.activityDate.value.year).to.equal("2024");
    expect(
      renderArgs.vm.form.actualNetProfitCostExcludingAdvocacy.value,
    ).to.equal("123");
    expect(renderArgs.vm.form.actualNetAdvocacyCosts.value).to.equal("456");
    expect(renderArgs.vm.form.vatApplies.choices[0].value).to.equal("yes");
    expect(renderArgs.vm.form.vatApplies.choices[0].checked).to.equal(false);
    expect(renderArgs.vm.form.vatApplies.choices[1].value).to.equal("no");
    expect(renderArgs.vm.form.vatApplies.choices[1].checked).to.equal(true);
    expect(renderArgs.vm.form.feeEarnerName.value).to.equal("Joe Bloggs");
  });

  it("creates line item when it doesn't already exist", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
      body: {
        activityDateDay: "27",
        activityDateMonth: "3",
        activityDateYear: "2007",
        actualNetProfitCostExcludingAdvocacy: "123.45",
        actualNetAdvocacyCosts: "156.00",
        vatApplies: "yes",
        feeEarnerName: "John Smith",
      },
    } as unknown as Request;

    createLineItemStub.resolves({
      status: "success",
      body: null,
    });

    await submitProfitCostBillLine(req, res, next);

    expect(createLineItemStub.firstCall.args[2]).to.deep.equal({
      type: CostType.PROFIT_COST,
      value: {
        activityDate: new LocalDate(27, 3, 2007),
        actualNetProfitCostExcludingAdvocacy: 123.45,
        actualNetAdvocacyCosts: 156,
        vatApplies: true,
        feeEarnerName: "John Smith",
      },
    });
  });

  it("updates line item when it does already exist", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
      body: {
        activityDateDay: "27",
        activityDateMonth: "3",
        activityDateYear: "2007",
        actualNetProfitCostExcludingAdvocacy: "123.45",
        actualNetAdvocacyCosts: "156.00",
        vatApplies: "yes",
        feeEarnerName: "John Smith",
        lineItemId: lineItemId.toString(),
      },
    } as unknown as Request;

    updateLineItemStub.resolves({
      status: "success",
      body: null,
    });

    await submitProfitCostBillLine(req, res, next);

    expect(updateLineItemStub.firstCall.args[3]).to.deep.equal({
      type: CostType.PROFIT_COST,
      value: {
        activityDate: new LocalDate(27, 3, 2007),
        actualNetProfitCostExcludingAdvocacy: 123.45,
        actualNetAdvocacyCosts: 156,
        vatApplies: true,
        feeEarnerName: "John Smith",
      },
    });
  });

  it("redirects to POA evidence upload when escaping standard fixed fee", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
      body: {
        activityDateDay: "27",
        activityDateMonth: "3",
        activityDateYear: "2007",
        actualNetProfitCostExcludingAdvocacy: "123.45",
        actualNetAdvocacyCosts: "156.00",
        vatApplies: "yes",
        feeEarnerName: "John Smith",
      },
    } as unknown as Request;

    createLineItemStub.resolves({
      status: "success",
      body: null,
    });

    getClaimStub.resolves({
      status: "success",
      body: new Claim({
        id: claimId.toString(),
        escaped: true,
      }),
    });

    await submitProfitCostBillLine(req, res, next);

    expect(
      (res.redirect as sinon.SinonStub).calledWith(
        buildRoute(ROUTES.POA_EVIDENCE_UPLOAD, {
          claimId: claimId,
        }),
      ),
    ).to.equal(true);
  });

  it("redirects to CYA when not escaping standard fixed fee", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
      body: {
        activityDateDay: "27",
        activityDateMonth: "3",
        activityDateYear: "2007",
        actualNetProfitCostExcludingAdvocacy: "123.45",
        actualNetAdvocacyCosts: "156.00",
        vatApplies: "yes",
        feeEarnerName: "John Smith",
      },
    } as unknown as Request;

    createLineItemStub.resolves({
      status: "success",
      body: null,
    });

    getClaimStub.resolves({
      status: "success",
      body: new Claim({
        id: claimId.toString(),
        escaped: false,
      }),
    });

    await submitProfitCostBillLine(req, res, next);

    expect(
      (res.redirect as sinon.SinonStub).calledWith(
        buildRoute(ROUTES.POA_CHECK_YOUR_DETAILS, {
          claimId: claimId,
        }),
      ),
    ).to.equal(true);
  });

  it("redirects to escape yes/no when that question is unanswered", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
      body: {
        activityDateDay: "27",
        activityDateMonth: "3",
        activityDateYear: "2007",
        actualNetProfitCostExcludingAdvocacy: "123.45",
        actualNetAdvocacyCosts: "156.00",
        vatApplies: "yes",
        feeEarnerName: "John Smith",
      },
    } as unknown as Request;

    createLineItemStub.resolves({
      status: "success",
      body: null,
    });

    getClaimStub.resolves({
      status: "success",
      body: new Claim({
        id: claimId.toString(),
      }),
    });

    await submitProfitCostBillLine(req, res, next);

    expect(
      (res.redirect as sinon.SinonStub).calledWith(
        buildRoute(ROUTES.ESCAPING_FIXED_FEE, {
          claimId: claimId,
        }),
      ),
    ).to.equal(true);
  });

  it("rerenders with 400 when form is invalid", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
      body: {},
    } as unknown as Request;

    await submitProfitCostBillLine(req, res, next);

    expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/poa/profitCostBillLineView.njk",
    );
  });
});