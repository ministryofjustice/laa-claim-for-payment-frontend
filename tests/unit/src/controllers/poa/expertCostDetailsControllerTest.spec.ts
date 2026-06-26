import { expect } from "chai";
import { beforeEach, describe, it } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import { buildRoute, ROUTES } from "#routes/helper.js";
import {
  expertCostDetails,
  submitExpertCostDetails,
} from "#src/controllers/poa/expertCostDetailsController.js";

describe("expertCostDetailsController", () => {
  let res: Response;
  let next: NextFunction;

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

  it("renders the page", () => {
    const req = {
      params: {
        claimId: "1",
        expertCostId: "1",
      },
    } as unknown as Request;

    expertCostDetails(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.be.true;
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/poa/expertCostDetailsView.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");
  });

  it("redirects to POA evidence upload when form is valid", () => {
    const req = {
      params: {
        claimId: "1",
        expertCostId: "1",
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

    submitExpertCostDetails(req, res, next);

    expect(
      (res.redirect as sinon.SinonStub).calledWith(
        buildRoute(ROUTES.POA_EVIDENCE_UPLOAD, {
          claimId: 1,
        }),
      ),
    ).to.be.true;
  });

  it("rerenders with 400 when form is invalid", () => {
    const req = {
      params: {
        claimId: "1",
      },
      body: {},
    } as unknown as Request;

    submitExpertCostDetails(req, res, next);

    expect((res.status as sinon.SinonStub).calledWith(400)).to.be.true;
    expect((res.render as sinon.SinonStub).calledOnce).to.be.true;
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/poa/expertCostDetailsView.njk",
    );
  });
});