import { expect } from "chai";
import {
  Claim,
  ClaimResponseSchema,
  ClientPartyStatus,
  CostType,
  Count,
  CourtType,
  EvidenceItemSchema,
} from "#src/types/Claim.js";
import { UUID, V7Generator } from "uuidv7";
import { ZodError } from "zod";

describe("ClaimResponseSchema", () => {
  const id = new V7Generator().generate();

  describe("id", () => {
    it("parses a valid uuid7", () => {
      const result = ClaimResponseSchema.parse({
        id: id.toString(),
        escaped: true,
      });

      expect(result.id).to.deep.equal(id.toString());
    });

    it("fails to parse a uuid4 ", () => {
      const uuid4 = UUID.parse("a8daf4c7-776a-41a4-9247-b6f3d2a13daf");
      const result = () =>
        ClaimResponseSchema.parse({
          id: uuid4.toString(),
          escaped: true,
        });

      expect(result).to.throw(ZodError);
    });
  });

  describe("costType", () => {
    it("parses a valid value", () => {
      const result = ClaimResponseSchema.parse({
        id: id.toString(),
        costType: "PROFIT_COST",
      });

      expect(result.costType).to.equal(CostType.PROFIT_COST);
    });
  });

  describe("profit cost details", () => {
    it("sets", () => {
      const claim = new Claim({
        id: id.toString(),
      });

      claim.setProfitCostDetails({
        courtType: CourtType.COUNTY_COURT,
        clientStatus: ClientPartyStatus.CHILD,
        firstSolicitor: true,
        transferOfSolicitor: false,
      });

      expect(claim.value.courtType).to.equal(CourtType.COUNTY_COURT);
      expect(claim.value.clientPartyStatus).to.equal(ClientPartyStatus.CHILD);
      expect(claim.value.firstActingSolicitorFlag).to.equal(true);
      expect(claim.value.transferOfSolicitorFlag).to.equal(false);
    });
  });

  describe("courtType", () => {
    it("parses a valid value", () => {
      const result = ClaimResponseSchema.parse({
        id: id.toString(),
        courtType: "COUNTY_COURT",
      });

      expect(result.courtType).to.equal(CourtType.COUNTY_COURT);
    });

    it("gets", () => {
      const claim = new Claim({
        id: id.toString(),
        courtType: CourtType.COUNTY_COURT,
      });

      expect(claim.courtType).to.equal(CourtType.COUNTY_COURT);
    });

    it("sets", () => {
      const claim = new Claim({
        id: id.toString(),
      });

      claim.setCourtType(CourtType.COUNTY_COURT);

      expect(claim.value.courtType).to.equal(CourtType.COUNTY_COURT);
    });
  });

  describe("clientPartyStatus", () => {
    it("parses a valid value", () => {
      const result = ClaimResponseSchema.parse({
        id: id.toString(),
        clientPartyStatus: "CHILD",
      });

      expect(result.clientPartyStatus).to.equal(ClientPartyStatus.CHILD);
    });

    it("gets", () => {
      const claim = new Claim({
        id: id.toString(),
        clientPartyStatus: ClientPartyStatus.CHILD,
      });

      expect(claim.clientPartyStatus).to.equal(ClientPartyStatus.CHILD);
    });

    it("sets", () => {
      const claim = new Claim({
        id: id.toString(),
      });

      claim.setClientPartyStatus(ClientPartyStatus.CHILD);

      expect(claim.value.clientPartyStatus).to.equal(ClientPartyStatus.CHILD);
    });
  });

  describe("firstActingSolicitorFlag", () => {
    it("parses a valid value", () => {
      const result = ClaimResponseSchema.parse({
        id: id.toString(),
        firstActingSolicitorFlag: true,
      });

      expect(result.firstActingSolicitorFlag).to.equal(true);
    });

    it("gets", () => {
      const claim = new Claim({
        id: id.toString(),
        firstActingSolicitorFlag: true,
      });

      expect(claim.firstActingSolicitorFlag).to.equal(true);
    });

    it("sets", () => {
      const claim = new Claim({
        id: id.toString(),
      });

      claim.setFirstActingSolicitorFlag(true);

      expect(claim.value.firstActingSolicitorFlag).to.equal(true);
    });
  });

  describe("transferOfSolicitorFlag", () => {
    it("parses a valid value", () => {
      const result = ClaimResponseSchema.parse({
        id: id.toString(),
        transferOfSolicitorFlag: false,
      });

      expect(result.transferOfSolicitorFlag).to.equal(false);
    });

    it("gets", () => {
      const claim = new Claim({
        id: id.toString(),
        transferOfSolicitorFlag: true,
      });

      expect(claim.transferOfSolicitorFlag).to.equal(true);
    });

    it("sets", () => {
      const claim = new Claim({
        id: id.toString(),
      });

      claim.setTransferOfSolicitorFlag(true);

      expect(claim.value.transferOfSolicitorFlag).to.equal(true);
    });

    it("cleans up 'How many clients are retained?' when answer is no", () => {
      const claim = new Claim({
        id: id.toString(),
        clientsRetainedCount: Count.ZERO,
      });

      claim.setTransferOfSolicitorFlag(false);

      expect(claim.value.clientsRetainedCount).to.be.undefined;
    });

    it("doesn't clean up 'How many clients are retained?' when answer is yes", () => {
      const claim = new Claim({
        id: id.toString(),
        clientsRetainedCount: Count.ZERO,
      });

      claim.setTransferOfSolicitorFlag(true);

      expect(claim.value.clientsRetainedCount).to.not.be.undefined;
    });
  });

  describe("clientsRetainedCount", () => {
    it("parses a valid value", () => {
      const result = ClaimResponseSchema.parse({
        id: id.toString(),
        clientsRetainedCount: "ZERO",
      });

      expect(result.clientsRetainedCount).to.equal(Count.ZERO);
    });

    it("gets", () => {
      const claim = new Claim({
        id: id.toString(),
        clientsRetainedCount: Count.ZERO,
      });

      expect(claim.clientsRetainedCount).to.equal(Count.ZERO);
    });

    it("sets", () => {
      const claim = new Claim({
        id: id.toString(),
      });

      claim.setClientsRetainedCount(Count.ZERO);

      expect(claim.value.clientsRetainedCount).to.equal(Count.ZERO);
    });

    it("cleans up 'How many clients did you have at the start of the case?' when answer is not ZERO", () => {
      const inputs = [Count.ONE, Count.TWO_OR_MORE];

      inputs.forEach((input) => {
        const claim = new Claim({
          id: id.toString(),
          clientsStartCount: Count.ZERO,
        });

        claim.setClientsRetainedCount(input);

        expect(claim.value.clientsStartCount).to.be.undefined;
      });
    });

    it("doesn't clean up 'How many clients did you have at the start of the case?' when answer is ZERO", () => {
      const claim = new Claim({
        id: id.toString(),
        clientsStartCount: Count.ZERO,
      });

      claim.setClientsRetainedCount(Count.ZERO);

      expect(claim.value.clientsStartCount).to.not.be.undefined;
    });
  });

  describe("clientsStartCount", () => {
    it("parses a valid value", () => {
      const result = ClaimResponseSchema.parse({
        id: id.toString(),
        clientsStartCount: "ONE",
      });

      expect(result.clientsStartCount).to.equal(Count.ONE);
    });
  });

  describe("multiClientHearingFlag", () => {
    it("parses a valid value", () => {
      const result = ClaimResponseSchema.parse({
        id: id.toString(),
        multiClientHearingFlag: true,
      });

      expect(result.multiClientHearingFlag).to.equal(true);
    });
  });

  describe("ufn", () => {
    it("parses a valid string", () => {
      const result = ClaimResponseSchema.parse({
        id: id.toString(),
        ufn: "UFN_123",
      });

      expect(result.ufn).to.equal("UFN_123");
    });
  });

  describe("concluded", () => {
    it("parses a valid date string", () => {
      const result = ClaimResponseSchema.parse({
        id: id.toString(),
        concluded: "2026-05-07T10:00:00.000Z",
      });

      expect(result.concluded).to.be.instanceof(Date);
      expect(result.concluded?.toISOString()).to.equal(
        "2026-05-07T10:00:00.000Z",
      );
    });
  });

  it("parses undefined fields as undefined", () => {
    const result = ClaimResponseSchema.parse({
      id: id.toString(),
      costType: undefined,
      courtType: undefined,
      clientPartyStatus: undefined,
      firstActingSolicitorFlag: undefined,
      transferOfSolicitorFlag: undefined,
      clientsRetainedCount: undefined,
      clientsStartCount: undefined,
      multiClientHearingFlag: undefined,
      ufn: undefined,
      providerUserId: undefined,
      client: undefined,
      category: undefined,
      concluded: undefined,
      feeType: undefined,
      claimed: undefined,
    });

    expect(result.costType).to.be.undefined;
    expect(result.courtType).to.be.undefined;
    expect(result.clientPartyStatus).to.be.undefined;
    expect(result.firstActingSolicitorFlag).to.be.undefined;
    expect(result.transferOfSolicitorFlag).to.be.undefined;
    expect(result.clientsRetainedCount).to.be.undefined;
    expect(result.clientsStartCount).to.be.undefined;
    expect(result.multiClientHearingFlag).to.be.undefined;
    expect(result.ufn).to.be.undefined;
    expect(result.providerUserId).to.be.undefined;
    expect(result.client).to.be.undefined;
    expect(result.category).to.be.undefined;
    expect(result.concluded).to.be.undefined;
    expect(result.feeType).to.be.undefined;
    expect(result.claimed).to.be.undefined;
  });

  it("parses null fields as null", () => {
    const result = ClaimResponseSchema.parse({
      id: id.toString(),
      costType: null,
      courtType: null,
      clientPartyStatus: null,
      firstActingSolicitorFlag: null,
      transferOfSolicitorFlag: null,
      clientsRetainedCount: null,
      clientsStartCount: null,
      multiClientHearingFlag: null,
      ufn: null,
      providerUserId: null,
      client: null,
      category: null,
      concluded: null,
      feeType: null,
      claimed: null,
    });

    expect(result.costType).to.be.null;
    expect(result.courtType).to.be.null;
    expect(result.clientPartyStatus).to.be.null;
    expect(result.firstActingSolicitorFlag).to.be.null;
    expect(result.transferOfSolicitorFlag).to.be.null;
    expect(result.clientsRetainedCount).to.be.null;
    expect(result.clientsStartCount).to.be.null;
    expect(result.multiClientHearingFlag).to.be.null;
    expect(result.ufn).to.be.null;
    expect(result.providerUserId).to.be.null;
    expect(result.client).to.be.null;
    expect(result.category).to.be.null;
    expect(result.concluded).to.be.null;
    expect(result.feeType).to.be.null;
    expect(result.claimed).to.be.null;
  });

  it("parses missing fields as undefined", () => {
    const result = ClaimResponseSchema.parse({
      id: id.toString(),
    });

    expect(result.costType).to.be.undefined;
    expect(result.courtType).to.be.undefined;
    expect(result.clientPartyStatus).to.be.undefined;
    expect(result.firstActingSolicitorFlag).to.be.undefined;
    expect(result.transferOfSolicitorFlag).to.be.undefined;
    expect(result.clientsRetainedCount).to.be.undefined;
    expect(result.clientsStartCount).to.be.undefined;
    expect(result.multiClientHearingFlag).to.be.undefined;
    expect(result.ufn).to.be.undefined;
    expect(result.providerUserId).to.be.undefined;
    expect(result.client).to.be.undefined;
    expect(result.category).to.be.undefined;
    expect(result.concluded).to.be.undefined;
    expect(result.feeType).to.be.undefined;
    expect(result.claimed).to.be.undefined;
  });

  describe("EvidenceItemSchema", () => {
    it("parses a valid evidence item", () => {
      const result = EvidenceItemSchema.parse({
        id: id.toString(),
        fileKey: "test.pdf",
        fileSize: 123456,
        submittedOn: "2026-06-17T14:34:01.226855Z",
      });

      expect(result.submittedOn).to.be.instanceof(Date);
      expect(result.submittedOn?.toISOString()).to.equal(
        "2026-06-17T14:34:01.226Z",
      );
    });

    it("fails to parse when mandatory field is undefined", () => {
      expect(() =>
        EvidenceItemSchema.parse({
          id: id.toString(),
          fileKey: "test.pdf",
          fileSize: 123456,
          submittedOn: undefined,
        }),
      ).to.throw();
    });

    it("fails to parse when mandatory field is null", () => {
      expect(() =>
        EvidenceItemSchema.parse({
          id: id.toString(),
          fileKey: "test.pdf",
          fileSize: 123456,
          submittedOn: null,
        }),
      ).to.throw();
    });

    it("fails to parse when mandatory field is missing", () => {
      expect(() =>
        EvidenceItemSchema.parse({
          id: id.toString(),
          fileKey: "test.pdf",
          fileSize: 123456,
        }),
      ).to.throw();
    });
  });
});