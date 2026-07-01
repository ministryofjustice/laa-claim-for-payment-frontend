import { expect } from "chai";
import { beforeEach, describe, it } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import { buildRoute, ROUTES } from "#routes/helper.js";
import {
  expertCostDetails,
  submitExpertCostDetails,
} from "#src/controllers/poa/expertCostDetailsController.js";
import type { AnswersCache } from "#src/services/answersCache.js";
import { ExpertCostDetailsSchema } from "#src/helpers/expertCostDetailsValidation.js";

describe("expertCostDetailsController", () => {
  let res: Response;
  let next: NextFunction;
  let answersCache: AnswersCache;

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

    answersCache = {
      get: sinon.stub().resolves(null),
      set: sinon.stub().resolves(),
      clear: sinon.stub().resolves(),
    };
  });

  it("renders the page", async () => {
    const req = {
      sessionID: "session-123",
      params: {
        claimId: "1",
        expertCostId: "1",
      },
    } as unknown as Request;

    await expertCostDetails(req, res, next, { answersCache });

    const args = (answersCache.get as sinon.SinonStub).firstCall.args;

    expect(args[0]).to.equal("session-123");
    expect(args[1]).to.equal(1);
    expect(args[2]).to.deep.equal(["poa", "expertCosts", 0]);
    expect(args[3]).to.equal(ExpertCostDetailsSchema);

    expect((res.render as sinon.SinonStub).calledOnce).to.be.true;
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/poa/expertCostDetailsView.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");
  });

  it("redirects to POA evidence upload when form is valid", async () => {
    const req = {
      sessionID: "session-123",
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

    await submitExpertCostDetails(req, res, next, { answersCache });

    expect((answersCache.set as sinon.SinonStub).calledOnce).to.equal(true);
    expect((answersCache.set as sinon.SinonStub).firstCall.args).to.deep.equal([
      "session-123",
      1,
      ["poa", "expertCosts", 0],
      {
        activityDate: new Date(2007, 2, 27),
        actualNetValue: 123.45,
        vatApplies: true,
        feeEarnerName: "John Smith",
        description: "Lorem ipsum",
      },
    ]);

    expect(
      (res.redirect as sinon.SinonStub).calledWith(
        buildRoute(ROUTES.POA_EVIDENCE_UPLOAD, {
          claimId: 1,
        }),
      ),
    ).to.be.true;
  });

  it("rerenders with 400 when form is invalid", async () => {
    const req = {
      sessionID: "session-123",
      params: {
        claimId: "1",
      },
      body: {},
    } as unknown as Request;

    await submitExpertCostDetails(req, res, next, { answersCache });

    expect((answersCache.set as sinon.SinonStub).called).to.equal(false);

    expect((res.status as sinon.SinonStub).calledWith(400)).to.be.true;
    expect((res.render as sinon.SinonStub).calledOnce).to.be.true;
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/poa/expertCostDetailsView.njk",
    );
  });
});