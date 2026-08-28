import { Claim, CostType } from "#src/types/Claim.js";
import { V7Generator } from "uuidv7";
import {
  requireClaim,
  requireDisbursementCostType,
} from "#src/helpers/claimGuards.js";
import type { Request } from "express";
import { expect } from "chai";

describe("claimGuards", () => {
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

  describe("requireDisbursementCostType", () => {
    const claimId = new V7Generator().generate();

    it("returns cost type when claim has expert cost type", () => {
      const claim = new Claim({
        id: claimId.toString(),
        costType: CostType.EXPERT_COST,
      });

      const result = requireDisbursementCostType(claim);

      expect(result).to.equal(CostType.EXPERT_COST);
    });

    it("returns cost type when claim has non-expert disbursement type", () => {
      const claim = new Claim({
        id: claimId.toString(),
        costType: CostType.NON_EXPERT_DISBURSEMENT,
      });

      const result = requireDisbursementCostType(claim);

      expect(result).to.equal(CostType.NON_EXPERT_DISBURSEMENT);
    });

    it("throws when claim has profit cost type", () => {
      const claim = new Claim({
        id: claimId.toString(),
        costType: CostType.PROFIT_COST,
      });

      const result = () => requireDisbursementCostType(claim);

      expect(result).to.throw(Error);
    });

    it("throws when claim has no cost type", () => {
      const claim = new Claim({
        id: claimId.toString(),
      });

      const result = () => requireDisbursementCostType(claim);

      expect(result).to.throw(Error);
    });
  });
});
