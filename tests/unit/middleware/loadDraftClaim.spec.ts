import type { NextFunction, Request, Response } from "express";
import { afterEach, beforeEach } from "mocha";
import sinon from "sinon";
import {
  loadDraftClaim,
  requireDisbursementCostType,
} from "#middleware/loadDraftClaim.js";
import { Claim, CostType } from "#src/types/Claim.js";
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

describe("requireDisbursementCostType", () => {
  let res: Response;
  let next: NextFunction;

  const claimId = new V7Generator().generate();

  beforeEach(() => {
    res = {
      redirect: sinon.stub(),
    } as unknown as Response;
    next = sinon.stub() as unknown as NextFunction;
  });

  afterEach(() => {
    sinon.restore();
  });

  it("loads expert disbursement onto request and calls next", () => {
    const req = {
      claim: new Claim({
        id: claimId.toString(),
        costType: CostType.EXPERT_COST,
      }),
    } as unknown as Request;

    requireDisbursementCostType(req, res, next);

    expect((next as sinon.SinonStub).calledOnce).to.be.true;
  });

  it("loads non-expert disbursement onto request and calls next", () => {
    const req = {
      claim: new Claim({
        id: claimId.toString(),
        costType: CostType.NON_EXPERT_DISBURSEMENT,
      }),
    } as unknown as Request;

    requireDisbursementCostType(req, res, next);

    expect((next as sinon.SinonStub).calledOnce).to.be.true;
  });

  it("redirects when profit cost type", () => {
    const req = {
      claim: new Claim({
        id: claimId.toString(),
        costType: CostType.PROFIT_COST,
      }),
    } as unknown as Request;

    requireDisbursementCostType(req, res, next);

    expect(
      (res.redirect as sinon.SinonStub).calledWith(
        `/claims/${claimId.toString()}/poa/claim-type`,
      ),
    ).to.be.true;
  });

  it("fails when no claim in request", () => {
    const req = {} as unknown as Request;

    requireDisbursementCostType(req, res, next);

    const error = (next as sinon.SinonStub).firstCall.args[0];

    expect(error).to.exist;
  });
});
