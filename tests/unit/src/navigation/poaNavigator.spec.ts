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

    describe("redirectFromCostType", () => {
      it(`redirects to 'check details' when answer doesn't change`, () => {
        for (const costType of Object.values(CostType)) {
          const claim = new Claim({
            id: claimId,
            costType: costType,
          });
          const navigator = new PoaNavigator(claim, mode);
          const result = navigator.redirectFromCostType(costType);
          expect(result).to.equal(
            "/claims/foo/poa/check-details",
            `Test failed for ${costType}`,
          );
        }
      });
    });

    describe("redirectFromProfitCostDetails", () => {
      it("redirects to 'how many clients retained' when no changes to yes for 'transfer of solicitor'", () => {
        const claim = new Claim({
          id: claimId,
          transferOfSolicitorFlag: false,
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

      it("redirects to 'check details' when answer doesn't change for 'transfer of solicitor'", () => {
        for (const bool of [true, false]) {
          const claim = new Claim({
            id: claimId,
            transferOfSolicitorFlag: bool,
          });
          const navigator = new PoaNavigator(claim, mode);
          const value: ProfitCostDetails = {
            courtType: CourtType.COUNTY_COURT,
            clientStatus: ClientPartyStatus.CHILD,
            firstSolicitor: true,
            transferOfSolicitor: bool,
          };
          const result = navigator.redirectFromProfitCostDetails(value);
          expect(result).to.equal(
            "/claims/foo/poa/check-details",
            `Test failed for ${bool}`,
          );
        }
      });
    });

    describe("redirectFromHowManyClientsRetained", () => {
      it("redirects to 'number of clients at start of case' when 1 changes to 0", () => {
        const claim = new Claim({
          id: claimId,
          clientsRetainedCount: Count.ONE,
        });
        const navigator = new PoaNavigator(claim, mode);
        const result = navigator.redirectFromHowManyClientsRetained(Count.ZERO);
        expect(result).to.equal(
          "/claims/foo/poa/number-of-clients-start-of-case?mode=change",
        );
      });

      it("redirects to 'number of clients at start of case' when 2+ changes to 0", () => {
        const claim = new Claim({
          id: claimId,
          clientsRetainedCount: Count.TWO_OR_MORE,
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
            id: claimId,
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
            id: claimId,
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

      it("redirects to 'check details' when answer changes from 0", () => {
        for (const count of Object.values(Count)) {
          const claim = new Claim({
            id: claimId,
            clientsRetainedCount: Count.ZERO,
          });
          const navigator = new PoaNavigator(claim, mode);
          const result = navigator.redirectFromHowManyClientsRetained(count);
          expect(result).to.equal(
            "/claims/foo/poa/check-details",
            `Test failed for ${count}`,
          );
        }
      });
    });

    describe("redirectFromNumberOfClientStartOfCase", () => {
      const claim = new Claim({
        id: claimId,
      });
      const navigator = new PoaNavigator(claim, mode);

      it("redirects to 'check details'", () => {
        const result = navigator.redirectFromNumberOfClientStartOfCase();
        expect(result).to.equal("/claims/foo/poa/check-details");
      });
    });

    describe("redirectFromMultipleClientHearings", () => {
      const claim = new Claim({
        id: claimId,
      });
      const navigator = new PoaNavigator(claim, mode);

      it("redirects to 'check details'", () => {
        const result = navigator.redirectFromMultipleClientHearings();
        expect(result).to.equal("/claims/foo/poa/check-details");
      });
    });

    describe("redirectFromEscapingStandardFixedFee", () => {
      it("redirects to 'evidence upload' when answer changes from no to yes", () => {
        const claim = new Claim({
          id: claimId,
          escaped: false,
        });
        const navigator = new PoaNavigator(claim, mode);
        const result = navigator.redirectFromEscapingStandardFixedFee(true);
        expect(result).to.equal("/claims/foo/poa/evidence-upload?mode=change");
      });

      it("redirects to 'check details' when answer changes from yes to no", () => {
        const claim = new Claim({
          id: claimId,
          escaped: true,
        });
        const navigator = new PoaNavigator(claim, mode);
        const result = navigator.redirectFromEscapingStandardFixedFee(false);
        expect(result).to.equal("/claims/foo/poa/check-details");
      });

      it("redirects to 'check details' when answer doesn't change", () => {
        for (const bool of [true, false]) {
          const claim = new Claim({
            id: claimId,
            escaped: bool,
          });
          const navigator = new PoaNavigator(claim, mode);
          const result = navigator.redirectFromEscapingStandardFixedFee(bool);
          expect(result).to.equal(
            "/claims/foo/poa/check-details",
            `Test failed for ${bool}`,
          );
        }
      });
    });

    describe("redirectFromProfitCostBillLine", () => {
      const claim = new Claim({
        id: claimId,
      });
      const navigator = new PoaNavigator(claim, mode);

      it("redirects to 'check details'", () => {
        const result = navigator.redirectFromProfitCostBillLine();
        expect(result).to.equal("/claims/foo/poa/check-details");
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
      const claim = new Claim({
        id: claimId,
      });
      const navigator = new PoaNavigator(claim, mode);

      it("redirects to 'check details'", () => {
        for (const bool of [true, false]) {
          const result = navigator.redirectFromAddAnotherDisbursement(bool);
          expect(result).to.equal(
            "/claims/foo/poa/check-details",
            `Test failed for ${bool}`,
          );
        }
      });
    });

    describe("redirectFromDisbursementDetails", () => {
      const claim = new Claim({
        id: claimId,
      });
      const navigator = new PoaNavigator(claim, mode);

      it("redirects to 'check details'", () => {
        const result = navigator.redirectFromDisbursementDetails();
        expect(result).to.equal("/claims/foo/poa/check-details");
      });
    });

    describe("redirectFromRemoveDisbursement", () => {
      const claim = new Claim({
        id: claimId,
      });
      const navigator = new PoaNavigator(claim, mode);

      it("redirects to 'check details'", () => {
        const result = navigator.redirectFromRemoveDisbursement();
        expect(result).to.equal("/claims/foo/poa/check-details");
      });
    });
  });
});
