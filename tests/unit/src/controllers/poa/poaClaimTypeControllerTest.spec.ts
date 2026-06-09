import { expect } from "chai";
import { describe, it } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import {
  poaClaimTypePage,
  submitPoaClaimType,
} from "#src/controllers/poa/poaClaimTypeController.js";

describe("poaClaimTypeController", () => {
  const createResponse = (): Response => ({
    render: sinon.stub(),
    redirect: sinon.stub(),
  }) as unknown as Response;

  const next = sinon.stub() as unknown as NextFunction;

  it("renders the POA claim type page", async () => {
    const req = {
      params: {
        claimId: "1",
      },
    } as unknown as Request;

    const res = createResponse();

    await poaClaimTypePage(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/poa/poaClaimTypeView.njk",
    );
    expect((res.render as sinon.SinonStub).firstCall.args[1]).to.have.property("vm");
  });

  it("redirects to profit cost details when Profit cost is selected", async () => {
    const req = {
      params: { claimId: "1" },
      body: { claimType: "profit-cost" },
    } as unknown as Request;

    const res = createResponse();

    await submitPoaClaimType(req, res, next);

    expect((res.redirect as sinon.SinonStub).calledWith(
      "/claims/1/poa/profit-cost-details",
    )).to.equal(true);
  });

  it("redirects to expert cost details when Expert cost is selected", async () => {
    const req = {
      params: { claimId: "1" },
      body: { claimType: "expert-cost" },
    } as unknown as Request;

    const res = createResponse();

    await submitPoaClaimType(req, res, next);

    expect((res.redirect as sinon.SinonStub).calledWith(
      "/claims/1/poa/expert-cost-details",
    )).to.equal(true);
  });

  it("redirects to non expert disbursement when Non expert disbursement is selected", async () => {
    const req = {
      params: { claimId: "1" },
      body: { claimType: "non-expert-disbursement" },
    } as unknown as Request;

    const res = createResponse();

    await submitPoaClaimType(req, res, next);

    expect((res.redirect as sinon.SinonStub).calledWith(
      "/claims/1/poa/non-expert-disbursement",
    )).to.equal(true);
  });

  it("rerenders the page with an error when no option is selected", async () => {
    const req = {
      params: { claimId: "1" },
      body: {},
    } as unknown as Request;

    const res = createResponse();

    await submitPoaClaimType(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/poa/poaClaimTypeView.njk",
    );
    expect((res.render as sinon.SinonStub).firstCall.args[1]).to.have.property(
      "errorSummary",
    );
  });
});