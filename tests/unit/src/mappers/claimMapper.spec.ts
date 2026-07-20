import { Claim } from "#src/types/Claim.js";
import { V7Generator } from "uuidv7";
import { toClaimRequestBody } from "#src/mappers/claimMapper.js";
import { expect } from "chai";

describe("ClaimMapper", () => {

  const claimId = new V7Generator().generate();

  it("when values are defined", () => {
    const claim: Claim = {
      id: claimId.toString(),
      ufn: "ufn",
      client: "client",
    };

    const result = toClaimRequestBody(claim);

    expect(result.ufn).to.equal("ufn");
    expect(result.client).to.equal("client");
  });

  it("when values are undefined", () => {
    const claim: Claim = {
      id: claimId.toString(),
    };

    const result = toClaimRequestBody(claim);

    expect(result.ufn).to.equal("");
    expect(result.client).to.equal("");
  });
});