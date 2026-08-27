import { expect } from "chai";
import {
  Category,
  Claim,
  ClaimResponseSchema,
  ClientPartyStatus,
  CostType,
  Count,
  CourtType,
  EvidenceItemSchema,
  DisbursementLineItem,
  LineItemSchema,
  ProfitCostBillLineItem,
  StubLineItem,
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

    it("gets", () => {
      const claim = new Claim({
        id: id.toString(),
        costType: CostType.PROFIT_COST,
      });

      expect(claim.costType).to.equal(CostType.PROFIT_COST);
    });

    it("sets", () => {
      const claim = new Claim({
        id: id.toString(),
      });

      claim.setCostType(CostType.PROFIT_COST);

      expect(claim.value.costType).to.equal(CostType.PROFIT_COST);
    });

    it("cleans up profit cost answers when answer is not PROFIT_COST", () => {
      const inputs: CostType[] = [
        CostType.EXPERT_COST,
        CostType.NON_EXPERT_DISBURSEMENT,
      ];
      inputs.forEach((input) => {
        const claim = new Claim({
          id: id.toString(),
          costType: CostType.PROFIT_COST,
          courtType: CourtType.COUNTY_COURT,
          clientPartyStatus: ClientPartyStatus.CHILD,
          firstActingSolicitorFlag: true,
          transferOfSolicitorFlag: true,
          clientsRetainedCount: Count.ZERO,
          clientsStartCount: Count.ZERO,
          multiClientHearingFlag: true,
          escaped: true,
        });

        claim.setCostType(input);

        expect(claim.value.costType).to.equal(input);
        expect(claim.value.courtType).to.be.undefined;
        expect(claim.value.clientPartyStatus).to.be.undefined;
        expect(claim.value.firstActingSolicitorFlag).to.be.undefined;
        expect(claim.value.transferOfSolicitorFlag).to.be.undefined;
        expect(claim.value.clientsRetainedCount).to.be.undefined;
        expect(claim.value.clientsStartCount).to.be.undefined;
        expect(claim.value.multiClientHearingFlag).to.be.undefined;
        expect(claim.value.escaped).to.be.undefined;
      });
    });

    it("doesn't clean up profit cost answers when answer is PROFIT_COST", () => {
      const claim = new Claim({
        id: id.toString(),
        costType: CostType.PROFIT_COST,
        courtType: CourtType.COUNTY_COURT,
        clientPartyStatus: ClientPartyStatus.CHILD,
        firstActingSolicitorFlag: true,
        transferOfSolicitorFlag: true,
        clientsRetainedCount: Count.ZERO,
        clientsStartCount: Count.ZERO,
        multiClientHearingFlag: true,
        escaped: true,
      });

      claim.setCostType(CostType.PROFIT_COST);

      expect(claim.value.costType).to.not.be.undefined;
      expect(claim.value.courtType).to.not.be.undefined;
      expect(claim.value.clientPartyStatus).to.not.be.undefined;
      expect(claim.value.firstActingSolicitorFlag).to.not.be.undefined;
      expect(claim.value.transferOfSolicitorFlag).to.not.be.undefined;
      expect(claim.value.clientsRetainedCount).to.not.be.undefined;
      expect(claim.value.clientsStartCount).to.not.be.undefined;
      expect(claim.value.multiClientHearingFlag).to.not.be.undefined;
      expect(claim.value.escaped).to.not.be.undefined;
    });
  });

  describe("disbursementCostType", () => {

    describe("get", () => {
      it("returns cost when expert cost", () => {
        const claim = new Claim({
          id: id.toString(),
          costType: CostType.EXPERT_COST,
        });

        expect(claim.disbursementCostType).to.equal(CostType.EXPERT_COST);
      });

      it("returns cost when non-expert disbursement", () => {
        const claim = new Claim({
          id: id.toString(),
          costType: CostType.NON_EXPERT_DISBURSEMENT,
        });

        expect(claim.disbursementCostType).to.equal(CostType.NON_EXPERT_DISBURSEMENT);
      });

      it("returns undefined when profit cost", () => {
        const claim = new Claim({
          id: id.toString(),
          costType: CostType.PROFIT_COST,
        });

        expect(claim.disbursementCostType).to.be.undefined;
      });

      it("returns undefined when undefined cost", () => {
        const claim = new Claim({
          id: id.toString(),
          costType: undefined,
        });

        expect(claim.disbursementCostType).to.be.undefined;
      });

      it("returns undefined when null cost", () => {
        const claim = new Claim({
          id: id.toString(),
          costType: null,
        });

        expect(claim.disbursementCostType).to.be.undefined;
      });
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

    it("resets", () => {
      const claim = new Claim({
        id: id.toString(),
      });

      claim.setProfitCostDetails(undefined);

      expect(claim.value.courtType).to.be.undefined;
      expect(claim.value.clientPartyStatus).to.be.undefined;
      expect(claim.value.firstActingSolicitorFlag).to.be.undefined;
      expect(claim.value.transferOfSolicitorFlag).to.be.undefined;
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

    it("gets", () => {
      const claim = new Claim({
        id: id.toString(),
        clientsStartCount: Count.ZERO,
      });

      expect(claim.clientsStartCount).to.equal(Count.ZERO);
    });

    it("sets", () => {
      const claim = new Claim({
        id: id.toString(),
      });

      claim.setClientsStartCount(Count.ZERO);

      expect(claim.value.clientsStartCount).to.equal(Count.ZERO);
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

    it("gets", () => {
      const claim = new Claim({
        id: id.toString(),
        multiClientHearingFlag: true,
      });

      expect(claim.multiClientHearingFlag).to.equal(true);
    });

    it("sets", () => {
      const claim = new Claim({
        id: id.toString(),
      });

      claim.setMultiClientHearingFlag(true);

      expect(claim.value.multiClientHearingFlag).to.equal(true);
    });
  });

  describe("escaped", () => {
    it("parses a valid value", () => {
      const result = ClaimResponseSchema.parse({
        id: id.toString(),
        escaped: true,
      });

      expect(result.escaped).to.equal(true);
    });

    it("gets", () => {
      const claim = new Claim({
        id: id.toString(),
        escaped: true,
      });

      expect(claim.escapedFlag).to.equal(true);
    });

    it("sets", () => {
      const claim = new Claim({
        id: id.toString(),
      });

      claim.setEscapedFlag(true);

      expect(claim.value.escaped).to.equal(true);
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
        concluded: "2026-05-07",
      });

      expect(result.concluded?.day).to.equal(7);
      expect(result.concluded?.month).to.equal(5);
      expect(result.concluded?.year).to.equal(2026);
    });

    it("fails to parse an invalid date string", () => {
      const inputs = ["2020-1-1", "2020-01-32"];
      inputs.forEach((input) => {
        const result = () =>
          ClaimResponseSchema.parse({
            id: id.toString(),
            concluded: input,
          });

        expect(result).to.throw(ZodError);
      });
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
      escaped: undefined,
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
    expect(result.escaped).to.be.undefined;
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
      escaped: null,
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
    expect(result.escaped).to.be.null;
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
    expect(result.escaped).to.be.undefined;
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

      expect(result.submittedOn).to.equal("2026-06-17T14:34:01.226855Z");
    });

    it("fails to parse an invalid date/time string", () => {
      const inputs = [
        "2020-1-1T14:34:01.226855Z",
        "2020-01-32T14:34:01.226855Z",
      ];
      inputs.forEach((input) => {
        const result = () =>
          EvidenceItemSchema.parse({
            id: id.toString(),
            fileKey: "test.pdf",
            fileSize: 123456,
            submittedOn: input,
          });

        expect(result).to.throw(ZodError);
      });
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

  describe("LineItemSchema", () => {
    it("parses a valid expert cost line item", () => {
      const result = LineItemSchema.parse({
        id: "019fad29-2579-7544-9961-3b3b6061f64e",
        title: "Title",
        category: "Disbursement",
        date: "2007-03-26",
        actualNetValue: 123,
        netProfitCostAmount: null,
        netAdvocacyCostAmount: null,
        vatApplicable: true,
        feeEarnerName: "Joe Bloggs",
        evidenceItems: [],
      }) as DisbursementLineItem;

      expect(result.id).to.equal("019fad29-2579-7544-9961-3b3b6061f64e");
      expect(result.title).to.equal("Title");
      expect(result.category).to.equal(Category.DISBURSEMENT);
      expect(result.date.day).to.equal(26);
      expect(result.date.month).to.equal(3);
      expect(result.date.year).to.equal(2007);
      expect(result.evidenceItems).has.length(0);
      expect(result.feeEarnerName).to.equal("Joe Bloggs");
      expect(result.vatApplicable).to.equal(true);
      expect(result.actualNetValue).to.equal(123);
      expect(result.netProfitCostAmount).to.be.null;
      expect(result.netAdvocacyCostAmount).to.be.null;
    });

    it("parses a valid profit cost bill line item", () => {
      const result = LineItemSchema.parse({
        id: "019fad29-2579-7544-9961-3b3b6061f64e",
        title: "Title",
        category: "Disbursement",
        date: "2007-03-26",
        actualNetValue: null,
        netProfitCostAmount: 123,
        netAdvocacyCostAmount: 456,
        vatApplicable: true,
        feeEarnerName: "Joe Bloggs",
        evidenceItems: [],
      }) as ProfitCostBillLineItem;

      expect(result.id).to.equal("019fad29-2579-7544-9961-3b3b6061f64e");
      expect(result.title).to.equal("Title");
      expect(result.category).to.equal(Category.DISBURSEMENT);
      expect(result.date.day).to.equal(26);
      expect(result.date.month).to.equal(3);
      expect(result.date.year).to.equal(2007);
      expect(result.evidenceItems).has.length(0);
      expect(result.feeEarnerName).to.equal("Joe Bloggs");
      expect(result.vatApplicable).to.equal(true);
      expect(result.actualNetValue).to.be.null;
      expect(result.netProfitCostAmount).to.equal(123);
      expect(result.netAdvocacyCostAmount).to.equal(456);
    });

    it("parses a valid stubbed line item", () => {
      const result = LineItemSchema.parse({
        id: "019fad29-2579-7544-9961-3b3b6061f64e",
        title: "Title",
        category: "Disbursement",
        date: "2007-03-26",
        evidenceItems: [],
      }) as StubLineItem;

      expect(result.id).to.equal("019fad29-2579-7544-9961-3b3b6061f64e");
      expect(result.title).to.equal("Title");
      expect(result.category).to.equal(Category.DISBURSEMENT);
      expect(result.date.day).to.equal(26);
      expect(result.date.month).to.equal(3);
      expect(result.date.year).to.equal(2007);
      expect(result.evidenceItems).has.length(0);
    });

    it("fails to parse when mandatory field is undefined", () => {
      expect(() =>
        LineItemSchema.parse({
          id: id.toString(),
          title: undefined,
          category: "Disbursement",
          date: "2007-03-26",
          evidenceItems: [],
        }),
      ).to.throw();
    });

    it("fails to parse when mandatory field is null", () => {
      expect(() =>
        LineItemSchema.parse({
          id: id.toString(),
          title: null,
          category: "Disbursement",
          date: "2007-03-26",
          evidenceItems: [],
        }),
      ).to.throw();
    });

    it("fails to parse when mandatory field is missing", () => {
      expect(() =>
        LineItemSchema.parse({
          id: id.toString(),
          category: "Disbursement",
          date: "2007-03-26",
          evidenceItems: [],
        }),
      ).to.throw();
    });
  });
});