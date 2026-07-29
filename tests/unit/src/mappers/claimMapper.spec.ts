import {
  Claim,
  ClaimDto,
  ClientPartyStatus,
  CostType,
  Count,
  CourtType,
} from "#src/types/Claim.js";
import { V7Generator } from "uuidv7";
import { toClaimRequestBody, toLineItemRequestBody } from "#src/mappers/claimMapper.js";
import { expect } from "chai";
import { describe } from "mocha";
import { ExpertCostDetails, ProfitCostBillLine } from "#src/types/poa.js";

describe("ClaimMapper", () => {
  const claimId = new V7Generator().generate();

  describe("toClaimRequestBody", () => {
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
        multiClientHearingFlag: true,
        escaped: false,
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
      expect(result.multiClientHearingFlag).to.equal(true);
      expect(result.escaped).to.equal(false);
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
      expect(result.multiClientHearingFlag).to.be.undefined;
      expect(result.escaped).to.be.undefined;
    });
  });

  describe("toLineItemRequestBody", () => {
    it("when expert cost details", () => {
      const lineItem: ExpertCostDetails = {
        activityDate: new Date("2026-03-12"),
        actualNetValue: 123,
        vatApplies: true,
        feeEarnerName: "Joe Bloggs",
        description: "Lorem ipsum",
      };

      const result = toLineItemRequestBody(lineItem);

      expect(result.date).to.equal("2026-03-12T00:00:00.000Z");
      expect(result.actualNetValue).to.equal(123);
      expect(result.vatApplicable).to.equal(true);
      expect(result.feeEarnerName).to.equal("Joe Bloggs");
      expect(result.title).to.equal("Lorem ipsum");
    });

    it("when profit cost bill line", () => {
      const lineItem: ProfitCostBillLine = {
        activityDate: new Date("2026-03-12"),
        actualNetProfitCostExcludingAdvocacy: 123,
        actualNetAdvocacyCosts: 456,
        vatApplies: true,
        feeEarnerName: "Joe Bloggs",
      };

      const result = toLineItemRequestBody(lineItem);

      expect(result.date).to.equal("2026-03-12T00:00:00.000Z");
      expect(result.netProfitCostAmount).to.equal(123);
      expect(result.netAdvocacyCostAmount).to.equal(456);
      expect(result.vatApplicable).to.equal(true);
      expect(result.feeEarnerName).to.equal("Joe Bloggs");
      expect(result.title).to.equal("TODO");
    });
  });
});
