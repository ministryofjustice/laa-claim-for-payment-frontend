import {
  Claim,
  ClaimDto,
  ClientPartyStatus,
  CostType,
  Count,
  CourtType,
} from "#src/types/Claim.js";
import { V7Generator } from "uuidv7";
import { toClaimRequestBody } from "#src/mappers/claimMapper.js";
import { expect } from "chai";

describe("ClaimMapper", () => {

  const claimId = new V7Generator().generate();

  it("when values are defined", () => {
    const claimDto: ClaimDto = {
      id: claimId.toString(),
      costType: CostType.PROFIT_COST,
      courtType: CourtType.COUNTY_COURT,
      clientPartyStatus: ClientPartyStatus.CHILD,
      firstActingSolicitorFlag: true,
      transferOfSolicitorFlag: false,
      clientsRetainedCount: Count.ZERO,
      clientsStartCount: Count.ONE,
    };

    const claim = new Claim(claimDto);

    const result = toClaimRequestBody(claim);

    expect(result.costType).to.equal("PROFIT_COST");
    expect(result.courtType).to.equal("COUNTY_COURT");
    expect(result.clientPartyStatus).to.equal("CHILD");
    expect(result.firstActingSolicitorFlag).to.equal(true);
    expect(result.transferOfSolicitorFlag).to.equal(false);
    expect(result.clientsRetainedCount).to.equal("ZERO");
    expect(result.clientsStartCount).to.equal("ONE");
  });

  it("when values are undefined", () => {
    const claimDto: ClaimDto = {
      id: claimId.toString(),
    };

    const claim = new Claim(claimDto);

    const result = toClaimRequestBody(claim);

    expect(result.costType).to.be.undefined;
    expect(result.courtType).to.be.undefined;
    expect(result.clientPartyStatus).to.be.undefined;
    expect(result.firstActingSolicitorFlag).to.be.undefined;
    expect(result.transferOfSolicitorFlag).to.be.undefined;
    expect(result.clientsRetainedCount).to.be.undefined;
    expect(result.clientsStartCount).to.be.undefined;
  });
});