import { Claim, ClaimDto, CostType } from "#src/types/Claim.js";
import { V7Generator } from "uuidv7";
import { toClaimRequestBody } from "#src/mappers/claimMapper.js";
import { expect } from "chai";

describe("ClaimMapper", () => {

  const claimId = new V7Generator().generate();

  it("when values are defined", () => {
    const claimDto: ClaimDto = {
      id: claimId.toString(),
      costType: CostType.PROFIT_COST,
    };

    const claim = new Claim(claimDto);

    const result = toClaimRequestBody(claim);

    expect(result.costType).to.equal("PROFIT_COST");
  });

  it("when values are undefined", () => {
    const claimDto: ClaimDto = {
      id: claimId.toString(),
    };

    const claim = new Claim(claimDto);

    const result = toClaimRequestBody(claim);

    expect(result.ufn).to.be.undefined;
  });
});