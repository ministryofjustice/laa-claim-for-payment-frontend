import {
  Category,
  Claim,
  ClientPartyStatus,
  CostType,
  Count,
  CourtType,
} from "#src/types/Claim.js";
import { PoaNavigator } from "#src/navigation/poaNavigator.js";
import { expect } from "chai";
import { ProfitCostDetails } from "#src/types/poa.js";
import { LocalDate } from "#src/types/date.js";

describe("poaNavigator", () => {
  const claimId = "foo";
  const lineItemId = "bar";
  const evidenceId = "baz";

  describe("redirectFromCostType", () => {
    const claim = new Claim({
      id: claimId,
    });
    const navigator = new PoaNavigator(claim);

    it("redirects to 'profit cost details' when profit cost selected", () => {
      const result = navigator.redirectFromCostType(CostType.PROFIT_COST);
      expect(result).to.equal("/claims/foo/poa/profit-cost-details");
    });

    it("redirects to 'add another disbursement' when expert cost selected", () => {
      const result = navigator.redirectFromCostType(CostType.EXPERT_COST);
      expect(result).to.equal("/claims/foo/poa/disbursement-details/add");
    });

    it("redirects to 'add another disbursement' when non-expert disbursement selected", () => {
      const result = navigator.redirectFromCostType(
        CostType.NON_EXPERT_DISBURSEMENT,
      );
      expect(result).to.equal("/claims/foo/poa/disbursement-details/add");
    });
  });

  describe("redirectFromProfitCostDetails", () => {
    const claim = new Claim({
      id: claimId,
    });
    const navigator = new PoaNavigator(claim);

    it("redirects to 'how many clients retained' when yes selected", () => {
      const value: ProfitCostDetails = {
        courtType: CourtType.COUNTY_COURT,
        clientStatus: ClientPartyStatus.CHILD,
        firstSolicitor: true,
        transferOfSolicitor: true,
      };
      const result = navigator.redirectFromProfitCostDetails(value);
      expect(result).to.equal("/claims/foo/poa/how-many-clients-retained");
    });

    it("redirects to 'number of clients at start of case' when no selected", () => {
      const value: ProfitCostDetails = {
        courtType: CourtType.COUNTY_COURT,
        clientStatus: ClientPartyStatus.CHILD,
        firstSolicitor: true,
        transferOfSolicitor: false,
      };
      const result = navigator.redirectFromProfitCostDetails(value);
      expect(result).to.equal(
        "/claims/foo/poa/number-of-clients-start-of-case",
      );
    });
  });

  describe("redirectFromHowManyClientsRetained", () => {
    const claim = new Claim({
      id: claimId,
    });
    const navigator = new PoaNavigator(claim);

    it("redirects to 'number of clients at start of case' when 0 selected", () => {
      const result = navigator.redirectFromHowManyClientsRetained(Count.ZERO);
      expect(result).to.equal(
        "/claims/foo/poa/number-of-clients-start-of-case",
      );
    });

    it("redirects to 'multiple client hearings' when 1 selected", () => {
      const result = navigator.redirectFromHowManyClientsRetained(Count.ONE);
      expect(result).to.equal("/claims/foo/poa/multiple-client-hearings");
    });

    it("redirects to 'multiple client hearings' when 2+ selected", () => {
      const result = navigator.redirectFromHowManyClientsRetained(
        Count.TWO_OR_MORE,
      );
      expect(result).to.equal("/claims/foo/poa/multiple-client-hearings");
    });
  });

  describe("redirectFromNumberOfClientStartOfCase", () => {
    const claim = new Claim({
      id: claimId,
    });
    const navigator = new PoaNavigator(claim);

    it("redirects to 'multiple client hearings'", () => {
      const result = navigator.redirectFromNumberOfClientStartOfCase();
      expect(result).to.equal("/claims/foo/poa/multiple-client-hearings");
    });
  });

  describe("redirectFromMultipleClientHearings", () => {
    const claim = new Claim({
      id: claimId,
    });
    const navigator = new PoaNavigator(claim);

    it("redirects to 'escaping standard fixed fee'", () => {
      const result = navigator.redirectFromMultipleClientHearings();
      expect(result).to.equal("/claims/foo/poa/escaping-standard-fixed-fee");
    });
  });

  describe("redirectFromEscapingStandardFixedFee", () => {
    const claim = new Claim({
      id: claimId,
    });
    const navigator = new PoaNavigator(claim);

    it("redirects to 'profit cost bill line'", () => {
      const result = navigator.redirectFromEscapingStandardFixedFee();
      expect(result).to.equal("/claims/foo/poa/cpgfs-profit-cost-bill-line");
    });
  });

  describe("redirectFromProfitCostBillLine", () => {
    it("redirects to 'evidence upload' when escaped is true", () => {
      const claim = new Claim({
        id: claimId,
        escaped: true,
      });
      const navigator = new PoaNavigator(claim);
      const result = navigator.redirectFromProfitCostBillLine();
      expect(result).to.equal("/claims/foo/poa/evidence-upload");
    });

    it("redirects to 'check details' when escaped is false", () => {
      const claim = new Claim({
        id: claimId,
        escaped: false,
      });
      const navigator = new PoaNavigator(claim);
      const result = navigator.redirectFromProfitCostBillLine();
      expect(result).to.equal("/claims/foo/poa/check-details");
    });

    it("redirects to 'escaping standard fixed fee' when escaped is undefined", () => {
      const claim = new Claim({
        id: claimId,
      });
      const navigator = new PoaNavigator(claim);
      const result = navigator.redirectFromProfitCostBillLine();
      expect(result).to.equal("/claims/foo/poa/escaping-standard-fixed-fee");
    });
  });

  describe("redirectFromEvidenceUpload", () => {
    const claim = new Claim({
      id: claimId,
    });
    const navigator = new PoaNavigator(claim);

    it("redirects to 'check details'", () => {
      const result = navigator.redirectFromEvidenceUpload();
      expect(result).to.equal("/claims/foo/poa/check-details");
    });
  });

  describe("redirectFromAddAnotherDisbursement", () => {
    it("redirects to 'disbursement details' when yes selected", () => {
      const claim = new Claim({
        id: claimId,
      });
      const navigator = new PoaNavigator(claim);
      const result = navigator.redirectFromAddAnotherDisbursement(true);
      expect(result).to.equal("/claims/foo/poa/disbursement-details");
    });

    it("redirects to 'evidence upload' when no selected and a line item has a net value of >= 20", () => {
      const claim = new Claim({
        id: claimId,
        costType: CostType.EXPERT_COST,
        lineItems: [
          {
            id: lineItemId,
            title: "Line item >= threshold",
            category: Category.DISBURSEMENT,
            date: new LocalDate(29, 7, 2026),
            actualNetValue: 20,
            vatApplicable: false,
            feeEarnerName: "John Smith",
            evidenceItems: [],
          },
        ],
      });
      const navigator = new PoaNavigator(claim);
      const result = navigator.redirectFromAddAnotherDisbursement(false);
      expect(result).to.equal("/claims/foo/poa/evidence-upload");
    });

    it("redirects to 'evidence upload' when no selected and no line item has a net value of >= 20 and I have already uploaded evidence", () => {
      const claim = new Claim({
        id: claimId,
        costType: CostType.EXPERT_COST,
        lineItems: [
          {
            id: lineItemId.toString(),
            title: "Line item < threshold",
            category: Category.DISBURSEMENT,
            date: new LocalDate(29, 7, 2026),
            actualNetValue: 19.99,
            vatApplicable: false,
            feeEarnerName: "John Smith",
            evidenceItems: [],
          },
        ],
        evidence: [
          {
            id: evidenceId.toString(),
            fileKey: "test.pdf",
            fileSize: 123456,
            submittedOn: "2026-06-17T14:34:01.226855Z",
          },
        ],
      });
      const navigator = new PoaNavigator(claim);
      const result = navigator.redirectFromAddAnotherDisbursement(false);
      expect(result).to.equal("/claims/foo/poa/evidence-upload");
    });

    it("redirects to 'check details' when no selected and no line item has a net value of >= 20 and I have not already uploaded evidence", () => {
      const claim = new Claim({
        id: claimId,
        costType: CostType.EXPERT_COST,
        lineItems: [
          {
            id: lineItemId.toString(),
            title: "Line item < threshold",
            category: Category.DISBURSEMENT,
            date: new LocalDate(29, 7, 2026),
            actualNetValue: 19.99,
            vatApplicable: false,
            feeEarnerName: "John Smith",
            evidenceItems: [],
          },
        ],
      });
      const navigator = new PoaNavigator(claim);
      const result = navigator.redirectFromAddAnotherDisbursement(false);
      expect(result).to.equal("/claims/foo/poa/check-details");
    });
  });

  describe("redirectFromDisbursementDetails", () => {
    const claim = new Claim({
      id: claimId,
    });
    const navigator = new PoaNavigator(claim);

    it("redirects to 'add another disbursement'", () => {
      const result = navigator.redirectFromDisbursementDetails();
      expect(result).to.equal("/claims/foo/poa/disbursement-details/add");
    });
  });

  describe("redirectFromRemoveDisbursement", () => {
    const claim = new Claim({
      id: claimId,
    });
    const navigator = new PoaNavigator(claim);

    it("redirects to 'add another disbursement'", () => {
      const result = navigator.redirectFromRemoveDisbursement();
      expect(result).to.equal("/claims/foo/poa/disbursement-details/add");
    });
  });
});
