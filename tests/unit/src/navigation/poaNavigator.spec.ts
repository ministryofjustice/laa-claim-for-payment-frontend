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
import { Mode } from "#routes/helper.js";

describe("poaNavigator", () => {
  const claimId = "foo";
  const lineItemId = "bar";
  const evidenceId = "baz";

  describe("normal mode navigation", () => {
    const mode: Mode = "normal";

    describe("redirectFromCostType", () => {
      const claim = new Claim({
        id: claimId,
      });
      const navigator = new PoaNavigator(claim, mode);

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
      const navigator = new PoaNavigator(claim, mode);

      it("redirects to 'how many clients retained' when yes selected for 'transfer of solicitor'", () => {
        const value: ProfitCostDetails = {
          courtType: CourtType.COUNTY_COURT,
          clientStatus: ClientPartyStatus.CHILD,
          firstSolicitor: true,
          transferOfSolicitor: true,
        };
        const result = navigator.redirectFromProfitCostDetails(value);
        expect(result).to.equal("/claims/foo/poa/how-many-clients-retained");
      });

      it("redirects to 'number of clients at start of case' when no selected for 'transfer of solicitor'", () => {
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
      const navigator = new PoaNavigator(claim, mode);

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
      const navigator = new PoaNavigator(claim, mode);

      it("redirects to 'multiple client hearings'", () => {
        const result = navigator.redirectFromNumberOfClientStartOfCase();
        expect(result).to.equal("/claims/foo/poa/multiple-client-hearings");
      });
    });

    describe("redirectFromMultipleClientHearings", () => {
      const claim = new Claim({
        id: claimId,
      });
      const navigator = new PoaNavigator(claim, mode);

      it("redirects to 'escaping standard fixed fee'", () => {
        const result = navigator.redirectFromMultipleClientHearings();
        expect(result).to.equal("/claims/foo/poa/escaping-standard-fixed-fee");
      });
    });

    describe("redirectFromEscapingStandardFixedFee", () => {
      const claim = new Claim({
        id: claimId,
      });
      const navigator = new PoaNavigator(claim, mode);

      it("redirects to 'profit cost bill line'", () => {
        for (const bool of [true, false]) {
          const result = navigator.redirectFromEscapingStandardFixedFee(bool);
          expect(result).to.equal(
            "/claims/foo/poa/cpgfs-profit-cost-bill-line",
            `Test failed for ${bool}`,
          );
        }
      });
    });

    describe("redirectFromProfitCostBillLine", () => {
      it("redirects to 'evidence upload' when escaped is true", () => {
        const claim = new Claim({
          id: claimId,
          escaped: true,
        });
        const navigator = new PoaNavigator(claim, mode);
        const result = navigator.redirectFromProfitCostBillLine();
        expect(result).to.equal("/claims/foo/poa/evidence-upload");
      });

      it("redirects to 'check details' when escaped is false", () => {
        const claim = new Claim({
          id: claimId,
          escaped: false,
        });
        const navigator = new PoaNavigator(claim, mode);
        const result = navigator.redirectFromProfitCostBillLine();
        expect(result).to.equal("/claims/foo/poa/check-details");
      });

      it("redirects to 'escaping standard fixed fee' when escaped is undefined", () => {
        const claim = new Claim({
          id: claimId,
        });
        const navigator = new PoaNavigator(claim, mode);
        const result = navigator.redirectFromProfitCostBillLine();
        expect(result).to.equal("/claims/foo/poa/escaping-standard-fixed-fee");
      });
    });

    describe("redirectFromEvidenceUpload", () => {
      const claim = new Claim({
        id: claimId,
      });
      const navigator = new PoaNavigator(claim, mode);

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
        const navigator = new PoaNavigator(claim, mode);
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
        const navigator = new PoaNavigator(claim, mode);
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
        const navigator = new PoaNavigator(claim, mode);
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
        const navigator = new PoaNavigator(claim, mode);
        const result = navigator.redirectFromAddAnotherDisbursement(false);
        expect(result).to.equal("/claims/foo/poa/check-details");
      });
    });

    describe("redirectFromDisbursementDetails", () => {
      const claim = new Claim({
        id: claimId,
      });
      const navigator = new PoaNavigator(claim, mode);

      it("redirects to 'add another disbursement'", () => {
        const result = navigator.redirectFromDisbursementDetails();
        expect(result).to.equal("/claims/foo/poa/disbursement-details/add");
      });
    });

    describe("redirectFromRemoveDisbursement", () => {
      const claim = new Claim({
        id: claimId,
      });
      const navigator = new PoaNavigator(claim, mode);

      it("redirects to 'add another disbursement'", () => {
        const result = navigator.redirectFromRemoveDisbursement();
        expect(result).to.equal("/claims/foo/poa/disbursement-details/add");
      });
    });
  });

  describe("change mode navigation", () => {
    const mode: Mode = "change";

    const completedProfitCostClaim = new Claim({
      id: claimId,
      costType: CostType.PROFIT_COST,
      courtType: CourtType.COUNTY_COURT,
      clientPartyStatus: ClientPartyStatus.CHILD,
      firstActingSolicitorFlag: true,
      transferOfSolicitorFlag: false,
      clientsStartCount: Count.ONE,
      multiClientHearingFlag: true,
      escaped: false,
      lineItems: [
        {
          id: lineItemId,
          title: "Line item",
          category: Category.DISBURSEMENT,
          date: new LocalDate(18, 3, 2025),
          evidenceItems: [],
          feeEarnerName: "Joe Bloggs",
          vatApplicable: true,
          actualNetValue: 123,
        },
      ],
    });

    const completedDisbursementClaim = new Claim({
      id: claimId,
      costType: CostType.EXPERT_COST,
      lineItems: [
        {
          id: lineItemId,
          title: "Line item",
          category: Category.DISBURSEMENT,
          date: new LocalDate(29, 7, 2026),
          actualNetValue: 20,
          vatApplicable: false,
          feeEarnerName: "John Smith",
          evidenceItems: [],
        },
      ],
      evidence: [
        {
          id: evidenceId,
          fileKey: "test.pdf",
          fileSize: 123456,
          submittedOn: "2026-06-17T14:34:01.226855Z",
        },
      ],
    });

    describe("redirectFromCostType", () => {
      it(`redirects to 'check details' when answer remains profit cost`, () => {
        const navigator = new PoaNavigator(completedProfitCostClaim, mode);
        const result = navigator.redirectFromCostType(CostType.PROFIT_COST);
        expect(result).to.equal("/claims/foo/poa/check-details");
      });

      it(`redirects to 'check details' when answer remains expert cost`, () => {
        const claim = new Claim({
          ...completedDisbursementClaim.value,
          costType: CostType.EXPERT_COST,
        });
        const navigator = new PoaNavigator(claim, mode);
        const result = navigator.redirectFromCostType(CostType.EXPERT_COST);
        expect(result).to.equal("/claims/foo/poa/check-details");
      });

      it(`redirects to 'check details' when answer remains non-expert disbursement`, () => {
        const claim = new Claim({
          ...completedDisbursementClaim.value,
          costType: CostType.NON_EXPERT_DISBURSEMENT,
        });
        const navigator = new PoaNavigator(claim, mode);
        const result = navigator.redirectFromCostType(CostType.NON_EXPERT_DISBURSEMENT);
        expect(result).to.equal("/claims/foo/poa/check-details");
      });
    });

    describe("redirectFromProfitCostDetails", () => {
      it("redirects to 'how many clients retained' when no changes to yes for 'transfer of solicitor'", () => {
        const claim = new Claim({
          ...completedProfitCostClaim.value,
          transferOfSolicitorFlag: false,
          clientsRetainedCount: undefined,
        });
        const navigator = new PoaNavigator(claim, mode);
        const value: ProfitCostDetails = {
          courtType: CourtType.COUNTY_COURT,
          clientStatus: ClientPartyStatus.CHILD,
          firstSolicitor: true,
          transferOfSolicitor: true,
        };
        const result = navigator.redirectFromProfitCostDetails(value);
        expect(result).to.equal(
          "/claims/foo/poa/how-many-clients-retained?mode=change",
        );
      });

      it("redirects to 'check details' when no changes to yes for 'transfer of solicitor' and 'how many clients retained' is already answered", () => {
        const claim = new Claim({
          ...completedProfitCostClaim.value,
          transferOfSolicitorFlag: false,
          clientsRetainedCount: Count.ZERO,
        });
        const navigator = new PoaNavigator(claim, mode);
        const value: ProfitCostDetails = {
          courtType: CourtType.COUNTY_COURT,
          clientStatus: ClientPartyStatus.CHILD,
          firstSolicitor: true,
          transferOfSolicitor: true,
        };
        const result = navigator.redirectFromProfitCostDetails(value);
        expect(result).to.equal("/claims/foo/poa/check-details");
      });

      it("redirects to 'how many clients retained' when no changes to yes for 'transfer of solicitor' and 'how many clients retained' is not already answered", () => {
        const claim = new Claim({
          ...completedProfitCostClaim.value,
          transferOfSolicitorFlag: false,
          clientsRetainedCount: undefined,
        });
        const navigator = new PoaNavigator(claim, mode);
        const value: ProfitCostDetails = {
          courtType: CourtType.COUNTY_COURT,
          clientStatus: ClientPartyStatus.CHILD,
          firstSolicitor: true,
          transferOfSolicitor: true,
        };
        const result = navigator.redirectFromProfitCostDetails(value);
        expect(result).to.equal("/claims/foo/poa/how-many-clients-retained?mode=change");
      });
    });

    describe("redirectFromHowManyClientsRetained", () => {
      it("redirects to 'number of clients at start of case' when 1 changes to 0", () => {
        const claim = new Claim({
          ...completedProfitCostClaim.value,
          clientsRetainedCount: Count.ONE,
          clientsStartCount: undefined,
        });
        const navigator = new PoaNavigator(claim, mode);
        const result = navigator.redirectFromHowManyClientsRetained(Count.ZERO);
        expect(result).to.equal(
          "/claims/foo/poa/number-of-clients-start-of-case?mode=change",
        );
      });

      it("redirects to 'number of clients at start of case' when 2+ changes to 0", () => {
        const claim = new Claim({
          ...completedProfitCostClaim.value,
          clientsRetainedCount: Count.TWO_OR_MORE,
          clientsStartCount: undefined,
        });
        const navigator = new PoaNavigator(claim, mode);
        const result = navigator.redirectFromHowManyClientsRetained(Count.ZERO);
        expect(result).to.equal(
          "/claims/foo/poa/number-of-clients-start-of-case?mode=change",
        );
      });

      it("redirects to 'check details' when answer changes to 1", () => {
        for (const count of Object.values(Count)) {
          const claim = new Claim({
            ...completedProfitCostClaim.value,
            clientsRetainedCount: count,
          });
          const navigator = new PoaNavigator(claim, mode);
          const result = navigator.redirectFromHowManyClientsRetained(
            Count.ONE,
          );
          expect(result).to.equal(
            "/claims/foo/poa/check-details",
            `Test failed for ${count}`,
          );
        }
      });

      it("redirects to 'check details' when answer changes to 2+", () => {
        for (const count of Object.values(Count)) {
          const claim = new Claim({
            ...completedProfitCostClaim.value,
            clientsRetainedCount: count,
          });
          const navigator = new PoaNavigator(claim, mode);
          const result = navigator.redirectFromHowManyClientsRetained(
            Count.TWO_OR_MORE,
          );
          expect(result).to.equal(
            "/claims/foo/poa/check-details",
            `Test failed for ${count}`,
          );
        }
      });

      it("redirects to 'check details' when answer changes to 0 and 'number of clients at start of case' is already answered", () => {
        for (const count of Object.values(Count)) {
          const claim = new Claim({
            ...completedProfitCostClaim.value,
            clientsStartCount: count,
          });
          const navigator = new PoaNavigator(claim, mode);
          const result = navigator.redirectFromHowManyClientsRetained(
            Count.ZERO,
          );
          expect(result).to.equal(
            "/claims/foo/poa/check-details",
            `Test failed for ${count}`,
          );
        }
      });
    });

    describe("redirectFromNumberOfClientStartOfCase", () => {
      it("redirects to 'check details'", () => {
        const navigator = new PoaNavigator(completedProfitCostClaim, mode);
        const result = navigator.redirectFromNumberOfClientStartOfCase();
        expect(result).to.equal("/claims/foo/poa/check-details");
      });

      it("redirects to 'multiple client hearings' when not answered", () => {
        const claim = new Claim({
          ...completedProfitCostClaim.value,
          multiClientHearingFlag: undefined,
        });
        const navigator = new PoaNavigator(claim, mode);
        const result = navigator.redirectFromNumberOfClientStartOfCase();
        expect(result).to.equal("/claims/foo/poa/multiple-client-hearings?mode=change");
      });
    });

    describe("redirectFromMultipleClientHearings", () => {
      it("redirects to 'check details'", () => {
        const navigator = new PoaNavigator(completedProfitCostClaim, mode);
        const result = navigator.redirectFromMultipleClientHearings();
        expect(result).to.equal("/claims/foo/poa/check-details");
      });

      it("redirects to 'escaping standard fixed fee' when not answered", () => {
        const claim = new Claim({
          ...completedProfitCostClaim.value,
          escaped: undefined,
        });
        const navigator = new PoaNavigator(claim, mode);
        const result = navigator.redirectFromMultipleClientHearings();
        expect(result).to.equal("/claims/foo/poa/escaping-standard-fixed-fee?mode=change");
      });
    });

    describe("redirectFromEscapingStandardFixedFee", () => {
      it("redirects to 'evidence upload' when answer changes from no to yes", () => {
        const claim = new Claim({
          ...completedProfitCostClaim.value,
          escaped: false,
          evidence: [],
        });
        const navigator = new PoaNavigator(claim, mode);
        const result = navigator.redirectFromEscapingStandardFixedFee(true);
        expect(result).to.equal("/claims/foo/poa/evidence-upload?mode=change");
      });

      it("redirects to 'check details' when answer changes from yes to no", () => {
        const claim = new Claim({
          ...completedProfitCostClaim.value,
          escaped: true,
          evidence: [],
        });
        const navigator = new PoaNavigator(claim, mode);
        const result = navigator.redirectFromEscapingStandardFixedFee(false);
        expect(result).to.equal("/claims/foo/poa/check-details");
      });

      it("redirects to 'check details' when answer changes from no to yes and evidence already provided", () => {
        const claim = new Claim({
          ...completedProfitCostClaim.value,
          escaped: false,
          evidence: [
            {
              id: evidenceId.toString(),
              fileKey: "test.pdf",
              fileSize: 123456,
              submittedOn: "2026-06-17T14:34:01.226855Z",
            },
          ],
        });
        const navigator = new PoaNavigator(claim, mode);
        const result = navigator.redirectFromEscapingStandardFixedFee(true);
        expect(result).to.equal("/claims/foo/poa/check-details");
      });
    });

    describe("redirectFromProfitCostBillLine", () => {
      it("redirects to 'check details' when escaped is false", () => {
        const claim = new Claim({
          ...completedProfitCostClaim.value,
          escaped: false,
          evidence: [],
        });
        const navigator = new PoaNavigator(claim, mode);
        const result = navigator.redirectFromProfitCostBillLine();
        expect(result).to.equal("/claims/foo/poa/check-details");
      });

      it("redirects to 'evidence upload' when escaped is true and there's no evidence", () => {
        const claim = new Claim({
          ...completedProfitCostClaim.value,
          escaped: true,
          evidence: [],
        });
        const navigator = new PoaNavigator(claim, mode);
        const result = navigator.redirectFromProfitCostBillLine();
        expect(result).to.equal("/claims/foo/poa/evidence-upload?mode=change");
      });

      it("redirects to 'escaping standard fixed fee' when escaped is undefined", () => {
        const claim = new Claim({
          ...completedProfitCostClaim.value,
          escaped: undefined,
        });
        const navigator = new PoaNavigator(claim, mode);
        const result = navigator.redirectFromProfitCostBillLine();
        expect(result).to.equal("/claims/foo/poa/escaping-standard-fixed-fee?mode=change");
      });
    });

    describe("redirectFromEvidenceUpload", () => {
      const navigator = new PoaNavigator(completedProfitCostClaim, mode);

      it("redirects to 'check details'", () => {
        const result = navigator.redirectFromEvidenceUpload();
        expect(result).to.equal("/claims/foo/poa/check-details");
      });
    });

    describe("redirectFromAddAnotherDisbursement", () => {
      it("redirects to 'disbursement details' when yes selected", () => {
        const navigator = new PoaNavigator(completedDisbursementClaim, mode);
        const result = navigator.redirectFromAddAnotherDisbursement(true);
        expect(result).to.equal("/claims/foo/poa/disbursement-details?mode=change");
      });

      it("redirects to 'check details' when no selected", () => {
        const navigator = new PoaNavigator(completedDisbursementClaim, mode);
        const result = navigator.redirectFromAddAnotherDisbursement(false);
        expect(result).to.equal("/claims/foo/poa/check-details");
      });

      it("redirects to 'evidence upload' when no selected and no evidence", () => {
        const claim = new Claim({
          ...completedDisbursementClaim.value,
          evidence: [],
        });
        const navigator = new PoaNavigator(claim, mode);
        const result = navigator.redirectFromAddAnotherDisbursement(false);
        expect(result).to.equal("/claims/foo/poa/evidence-upload?mode=change");
      });
    });

    describe("redirectFromDisbursementDetails", () => {
      const navigator = new PoaNavigator(completedDisbursementClaim, mode);

      it("redirects to 'check details' when everything else answered", () => {
        const result = navigator.redirectFromDisbursementDetails();
        expect(result).to.equal("/claims/foo/poa/check-details");
      });

      it("redirects to 'evidence upload' when evidence required and no evidence", () => {
        const claim = new Claim({
          ...completedDisbursementClaim.value,
          evidence: [],
        });
        const navigator = new PoaNavigator(claim, mode);
        const result = navigator.redirectFromDisbursementDetails();
        expect(result).to.equal("/claims/foo/poa/evidence-upload?mode=change");
      });

      it("redirects to 'check details' when no evidence required and no evidence", () => {
        const claim = new Claim({
          ...completedDisbursementClaim.value,
          lineItems: [
            {
              id: lineItemId,
              title: "Line item",
              category: Category.DISBURSEMENT,
              date: new LocalDate(29, 7, 2026),
              actualNetValue: 19,
              vatApplicable: false,
              feeEarnerName: "John Smith",
              evidenceItems: [],
            },
          ],
          evidence: [],
        });
        const navigator = new PoaNavigator(claim, mode);
        const result = navigator.redirectFromDisbursementDetails();
        expect(result).to.equal("/claims/foo/poa/check-details");
      });
    });

    describe("redirectFromRemoveDisbursement", () => {
      const navigator = new PoaNavigator(completedDisbursementClaim, mode);

      it("redirects to 'check details' when everything else answered", () => {
        const result = navigator.redirectFromRemoveDisbursement();
        expect(result).to.equal("/claims/foo/poa/check-details");
      });

      it("redirects to 'evidence upload' when evidence required and no evidence", () => {
        const claim = new Claim({
          ...completedDisbursementClaim.value,
          evidence: [],
        });
        const navigator = new PoaNavigator(claim, mode);
        const result = navigator.redirectFromRemoveDisbursement();
        expect(result).to.equal("/claims/foo/poa/evidence-upload?mode=change");
      });

      it("redirects to 'check details' when no evidence required and no evidence", () => {
        const claim = new Claim({
          ...completedDisbursementClaim.value,
          lineItems: [
            {
              id: lineItemId,
              title: "Line item",
              category: Category.DISBURSEMENT,
              date: new LocalDate(29, 7, 2026),
              actualNetValue: 19,
              vatApplicable: false,
              feeEarnerName: "John Smith",
              evidenceItems: [],
            },
          ],
          evidence: [],
        });
        const navigator = new PoaNavigator(claim, mode);
        const result = navigator.redirectFromRemoveDisbursement();
        expect(result).to.equal("/claims/foo/poa/check-details");
      });

      it("redirects to 'add disbursement' when no line items remaining", () => {
        const claim = new Claim({
          ...completedDisbursementClaim.value,
          lineItems: [],
        });
        const navigator = new PoaNavigator(claim, mode);
        const result = navigator.redirectFromRemoveDisbursement();
        expect(result).to.equal("/claims/foo/poa/disbursement-details/add?mode=change");
      });
    });
  });
});
