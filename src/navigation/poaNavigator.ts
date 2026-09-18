import { type Claim, CostType, Count } from "#src/types/Claim.js";
import { buildModeRoute, buildRoute, type Mode, ROUTES } from "#routes/helper.js";
import type { DisbursementDetails, ProfitCostDetails } from "#src/types/poa.js";
import config from "#config.js";

/**
 *
 */
export class PoaNavigator {
  private readonly claim: Claim;
  private readonly claimId: string;
  private readonly mode: Mode;

  /**
   * Constructs a navigator for the POA journey
   *
   * @param {Claim} claim claim
   * @param {Mode} mode navigation mode
   */
  constructor(claim: Claim, mode: Mode) {
    this.claim = claim;
    const { id: claimId } = claim;
    this.claimId = claimId;
    this.mode = mode;
  }

  /**
   * Get URL to redirect to from cost type page
   *
   * @param {CostType} value cost type value
   * @returns {string} URL to redirect to
   */
  redirectFromCostType(value: CostType): string {
    if (value === CostType.PROFIT_COST) {
      return this.redirectToProfitCostDetails();
    }
    return this.redirectToAddAnotherDisbursement(!this.claim.hasLineItems);
  }

  private redirectToProfitCostDetails(): string {
    if (this.mode === "normal" || this.claim.profitCostDetails == null) {
      return this.buildRoute(ROUTES.POA.PROFIT_COST.DETAILS);
    }

    return this.redirectFromProfitCostDetails(this.claim.profitCostDetails);
  }

  /**
   * Get URL to redirect to from profit cost details page
   *
   * @param {ProfitCostDetails} value profit cost details value
   * @returns {string} URL to redirect to
   */
  redirectFromProfitCostDetails(value: ProfitCostDetails): string {
    if (value.transferOfSolicitor) {
      return this.redirectToHowManyClientsRetained();
    }
    return this.redirectToNumberOfClientStartOfCase();
  }

  private redirectToHowManyClientsRetained(): string {
    if (this.mode === "normal" || this.claim.clientsRetainedCount == null) {
      return this.buildRoute(ROUTES.POA.PROFIT_COST.HOW_MANY_CLIENTS_RETAINED);
    }

    return this.redirectFromHowManyClientsRetained(
      this.claim.clientsRetainedCount,
    );
  }

  /**
   * Get URL to redirect to from how many clients retained page
   *
   * @param {ProfitCostDetails} value count value
   * @returns {string} URL to redirect to
   */
  redirectFromHowManyClientsRetained(value: Count): string {
    if (value === Count.ZERO) {
      return this.redirectToNumberOfClientStartOfCase();
    }
    return this.redirectToMultipleClientHearings();
  }

  private redirectToNumberOfClientStartOfCase(): string {
    if (this.mode === "normal" || this.claim.clientsStartCount == null) {
      return this.buildRoute(
        ROUTES.POA.PROFIT_COST.NUMBER_OF_CLIENTS_START_OF_CASE,
      );
    }

    return this.redirectFromNumberOfClientStartOfCase();
  }

  /**
   * Get URL to redirect to from number of clients at start of case page
   *
   * @returns {string} URL to redirect to
   */
  redirectFromNumberOfClientStartOfCase(): string {
    return this.redirectToMultipleClientHearings();
  }

  private redirectToMultipleClientHearings(): string {
    if (this.mode === "normal" || this.claim.multiClientHearingFlag == null) {
      return this.buildRoute(ROUTES.POA.PROFIT_COST.MULTIPLE_CLIENT_HEARINGS);
    }

    return this.redirectFromMultipleClientHearings();
  }

  /**
   * Get URL to redirect to from multiple client hearings page
   *
   * @returns {string} URL to redirect to
   */
  redirectFromMultipleClientHearings(): string {
    return this.redirectToEscapingStandardFixedFee();
  }

  private redirectToEscapingStandardFixedFee(): string {
    if (this.mode === "normal" || this.claim.escapedFlag == null) {
      return this.buildRoute(ROUTES.POA.PROFIT_COST.ESCAPING_FIXED_FEE);
    }

    return this.redirectFromEscapingStandardFixedFee(this.claim.escapedFlag);
  }

  /**
   * Get URL to redirect to from escaping standard fixed fee page
   *
   * @param {boolean} value escaped value
   * @returns {string} URL to redirect to
   */
  redirectFromEscapingStandardFixedFee(value: boolean): string {
    if (this.mode === "change") {
      if (value) {
        return this.redirectToEvidenceUpload();
      }
      return this.redirectToCheckDetails();
    }
    return this.redirectToProfitCostBillLine();
  }

  private redirectToProfitCostBillLine(): string {
    if (this.mode === "normal" || this.claim.profitCostLineItem == null) {
      return this.buildRoute(ROUTES.POA.PROFIT_COST.CPGFS_BILL_LINE);
    }

    return this.redirectFromProfitCostBillLine();
  }

  /**
   * Get URL to redirect to from profit cost bill line page
   *
   * @returns {string} URL to redirect to
   */
  redirectFromProfitCostBillLine(): string {
    // eslint-disable-next-line @typescript-eslint/prefer-destructuring -- ignore
    const { escapedFlag: escaped } = this.claim;

    switch (escaped) {
      case true:
        return this.redirectToEvidenceUpload();
      case false:
        return this.redirectToCheckDetails();
      default:
        return this.redirectToEscapingStandardFixedFee();
    }
  }

  private redirectToEvidenceUpload(): string {
    if (this.mode === "normal" || !this.claim.hasEvidence) {
      return this.buildRoute(ROUTES.POA.EVIDENCE_UPLOAD);
    }

    return this.redirectFromEvidenceUpload();
  }

  /**
   * Get URL to redirect to from evidence upload page
   *
   * @returns {string} URL to redirect to
   */
  redirectFromEvidenceUpload(): string {
    return this.redirectToCheckDetails();
  }

  private redirectToAddAnotherDisbursement(noLineItems: boolean): string {
    if (this.mode === "normal" || noLineItems) {
      return this.buildRoute(ROUTES.POA.DISBURSEMENTS.ADD);
    }

    return this.redirectFromAddAnotherDisbursement(false);
  }

  /**
   * Get URL to redirect to from add another disbursement page
   *
   * @param {boolean} value add another value
   * @returns {string} URL to redirect to
   */
  redirectFromAddAnotherDisbursement(value: boolean): string {
    if (value) {
      return this.redirectToDisbursementDetails();
    }
    if (this.claim.requiresEvidence || this.claim.hasEvidence) {
      return this.redirectToEvidenceUpload();
    }
    return this.redirectToCheckDetails();
  }

  private redirectToDisbursementDetails(): string {
    return this.buildRoute(ROUTES.POA.DISBURSEMENTS.DETAILS);
  }

  /**
   * Get URL to redirect to from disbursement details page
   *
   * @param {DisbursementDetails} value disbursement details value
   * @returns {string} URL to redirect to
   */
  redirectFromDisbursementDetails(value: DisbursementDetails): string {
    if (this.mode === "change") {
      if (value.actualNetValue >= config.constants.evidenceThresholdInPounds) {
        return this.redirectToEvidenceUpload();
      }
    }
    return this.redirectToAddAnotherDisbursement(false);
  }

  /**
   * Get URL to redirect to from remove disbursement page
   *
   * @param {boolean} value remove value
   * @returns {string} URL to redirect to
   */
  redirectFromRemoveDisbursement(value: boolean): string {
    const noLineItems = value && this.claim.lineItems.length <= 1;
    return this.redirectToAddAnotherDisbursement(noLineItems);
  }

  private redirectToCheckDetails(): string {
    return buildRoute(ROUTES.POA.CHECK_DETAILS, {
      claimId: this.claimId,
    });
  }

  private buildRoute(route: string): string {
    return buildModeRoute(this.mode, route, { claimId: this.claimId });
  }
}
