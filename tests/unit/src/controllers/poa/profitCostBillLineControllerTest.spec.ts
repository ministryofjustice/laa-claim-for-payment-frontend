import { expect } from "chai";
import { beforeEach, describe, it } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import {
  profitCostBillLine,
  submitProfitCostBillLine,
} from "#src/controllers/poa/profitCostBillLineController.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { V7Generator } from "uuidv7";

describe("profitCostBillLineController", () => {
  let res: Response;
  let next: NextFunction;

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
  });

  it("renders the profit cost bill line page", () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
    } as unknown as Request;

    profitCostBillLine(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/poa/profitCostBillLineView.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");
    expect(renderArgs.vm.title).to.equal("pages.profitCostBillLine.title");
  });

  it("redirects to POA evidence upload when form is valid", () => {
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

    submitProfitCostBillLine(req, res, next);

    expect(
      (res.redirect as sinon.SinonStub).calledWith(
        buildRoute(ROUTES.POA_EVIDENCE_UPLOAD, {
          claimId: claimId,
        }),
      ),
    ).to.equal(true);
  });

  it("rerenders with 400 when form is invalid", () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
      body: {},
    } as unknown as Request;

    submitProfitCostBillLine(req, res, next);

    expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/poa/profitCostBillLineView.njk",
    );
  });
});