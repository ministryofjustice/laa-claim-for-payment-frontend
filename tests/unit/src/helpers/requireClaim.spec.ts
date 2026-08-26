import { Claim } from "#src/types/Claim.js";
import { V7Generator } from "uuidv7";
import { requireClaim } from "#src/helpers/requireClaim.js";
import type { Request } from "express";
import { expect } from "chai";

describe("requireClaim", () => {
  const claimId = new V7Generator().generate();

  it("returns claim when it exists", () => {
    const claim = new Claim({
      id: claimId.toString(),
    });

    const req = {
      claim,
    } as unknown as Request;

    const result = requireClaim(req);

    expect(result).to.equal(claim);
  });

  it("throws when claim does not exist", () => {
    const req = {} as unknown as Request;

    const result = () => requireClaim(req);

    expect(result).to.throw(Error);
  });
});
