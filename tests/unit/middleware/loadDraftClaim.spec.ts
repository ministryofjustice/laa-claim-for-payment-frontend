import type { NextFunction, Request, Response } from "express";
import { afterEach, beforeEach } from "mocha";
import sinon from "sinon";
import { loadDraftClaim } from "#middleware/loadDraftClaim.js";
import { Claim } from "#src/types/Claim.js";
import { V7Generator } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import { expect } from "chai";

describe("loadDraftClaim", () => {
  let res: Response;
  let next: NextFunction;

  let getClaimStub: sinon.SinonStub;

  const claimId = new V7Generator().generate();

  beforeEach(() => {
    res = {} as unknown as Response;
    next = sinon.stub() as unknown as NextFunction;

    getClaimStub = sinon.stub(claimService, "getDraftClaim");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("loads claim onto request and calls next", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
    } as unknown as Request;

    const claim = new Claim({
      id: claimId.toString(),
    });

    getClaimStub.resolves({
      status: "success",
      body: claim,
    });

    await loadDraftClaim(req, res, next);

    expect(req.claim).to.deep.equal(claim);
    expect((next as sinon.SinonStub).calledOnce).to.be.true;
  });

  it("fails when claim ID request param missing", async () => {
    const req = {
      params: {},
    } as unknown as Request;

    await loadDraftClaim(req, res, next);

    const error = (next as sinon.SinonStub).firstCall.args[0];

    expect(error).to.exist;
  });

  it("fails when claim ID request param is not a UUID", async () => {
    const req = {
      params: {
        claimId: "foo",
      },
    } as unknown as Request;

    await loadDraftClaim(req, res, next);

    const error = (next as sinon.SinonStub).firstCall.args[0];

    expect(error).to.exist;
  });

  it("passes claim retrieval error to next", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
    } as unknown as Request;

    getClaimStub.resolves({
      status: "error",
      statusCode: 404,
      message: "Claim not found",
    });

    await loadDraftClaim(req, res, next);

    const error = (next as sinon.SinonStub).firstCall.args[0];

    expect(error).to.exist;
    expect(error.statusCode).to.equal(404);
    expect(error.message).to.equal("Claim not found");
  });

  it("passes unexpected error to next", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
    } as unknown as Request;

    getClaimStub.rejects(new Error("API error"));

    await loadDraftClaim(req, res, next);

    const error = (next as sinon.SinonStub).firstCall.args[0];

    expect(error).to.exist;
    expect(error.message).to.equal("API error");
  });
});
