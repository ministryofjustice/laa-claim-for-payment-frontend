import { type Claim, CostType, Count } from "#src/types/Claim.js";
import {
  buildChangeRoute,
  buildRoute,
  type Mode,
  ROUTES,
} from "#routes/helper.js";
import type { ProfitCostDetails } from "#src/types/poa.js";

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
    const route =
      this.mode === "change" && this.claim.costType === value
        ? ROUTES.POA.CHECK_DETAILS
        : value === CostType.PROFIT_COST
          ? ROUTES.POA.PROFIT_COST.DETAILS
          : ROUTES.POA.DISBURSEMENTS.ADD;

    return buildRoute(route, { claimId: this.claimId });
  }

  /**
   * Get URL to redirect to from profit cost details page
   *
   * @param {ProfitCostDetails} value profit cost details value
   * @returns {string} URL to redirect to
   */
  redirectFromProfitCostDetails(value: ProfitCostDetails): string {
    if (
      this.mode === "change" &&
      value.transferOfSolicitor &&
      value.transferOfSolicitor !== this.claim.transferOfSolicitorFlag
    ) {
      return buildChangeRoute(
        ROUTES.POA.PROFIT_COST.HOW_MANY_CLIENTS_RETAINED,
        { claimId: this.claimId },
      );
    }

    const route =
      this.mode === "change"
        ? ROUTES.POA.CHECK_DETAILS
        : value.transferOfSolicitor
          ? ROUTES.POA.PROFIT_COST.HOW_MANY_CLIENTS_RETAINED
          : ROUTES.POA.PROFIT_COST.NUMBER_OF_CLIENTS_START_OF_CASE;

    return buildRoute(route, { claimId: this.claimId });
  }

  /**
   * Get URL to redirect to from how many clients retained page
   *
   * @param {ProfitCostDetails} value count value
   * @returns {string} URL to redirect to
   */
  redirectFromHowManyClientsRetained(value: Count): string {
    if (
      this.mode === "change" &&
      value === Count.ZERO &&
      value !== this.claim.clientsRetainedCount
    ) {
      return buildChangeRoute(
        ROUTES.POA.PROFIT_COST.NUMBER_OF_CLIENTS_START_OF_CASE,
        { claimId: this.claimId },
      );
    }

    const route =
      this.mode === "change"
        ? ROUTES.POA.CHECK_DETAILS
        : value === Count.ZERO
          ? ROUTES.POA.PROFIT_COST.NUMBER_OF_CLIENTS_START_OF_CASE
          : ROUTES.POA.PROFIT_COST.MULTIPLE_CLIENT_HEARINGS;

    return buildRoute(route, { claimId: this.claimId });
  }

  /**
   * Get URL to redirect to from number of clients at start of case page
   *
   * @returns {string} URL to redirect to
   */
  redirectFromNumberOfClientStartOfCase(): string {
    const route =
      this.mode === "change"
        ? ROUTES.POA.CHECK_DETAILS
        : ROUTES.POA.PROFIT_COST.MULTIPLE_CLIENT_HEARINGS;

    return buildRoute(route, { claimId: this.claimId });
  }

  /**
   * Get URL to redirect to from multiple client hearings page
   *
   * @returns {string} URL to redirect to
   */
  redirectFromMultipleClientHearings(): string {
    const route =
      this.mode === "change"
        ? ROUTES.POA.CHECK_DETAILS
        : ROUTES.POA.PROFIT_COST.ESCAPING_FIXED_FEE;

    return buildRoute(route, { claimId: this.claimId });
  }

  /**
   * Get URL to redirect to from escaping standard fixed fee page
   *
   * @param {boolean} value escaped value
   * @returns {string} URL to redirect to
   */
  redirectFromEscapingStandardFixedFee(value: boolean): string {
    if (this.mode === "change" && value && value !== this.claim.escapedFlag) {
      return buildChangeRoute(ROUTES.POA.EVIDENCE_UPLOAD, {
        claimId: this.claimId,
      });
    }

    const route =
      this.mode === "change"
        ? ROUTES.POA.CHECK_DETAILS
        : ROUTES.POA.PROFIT_COST.CPGFS_BILL_LINE;

    return buildRoute(route, { claimId: this.claimId });
  }

  /**
   * Get URL to redirect to from profit cost bill line page
   *
   * @returns {string} URL to redirect to
   */
  redirectFromProfitCostBillLine(): string {
    // eslint-disable-next-line @typescript-eslint/prefer-destructuring -- ignore
    const { escapedFlag: escaped } = this.claim;

    const route =
      this.mode === "change" || escaped === false
        ? ROUTES.POA.CHECK_DETAILS
        : escaped === true
          ? ROUTES.POA.EVIDENCE_UPLOAD
          : ROUTES.POA.PROFIT_COST.ESCAPING_FIXED_FEE;

    return buildRoute(route, { claimId: this.claimId });
  }

  /**
   * Get URL to redirect to from evidence upload page
   *
   * @returns {string} URL to redirect to
   */
  redirectFromEvidenceUpload(): string {
    return buildRoute(ROUTES.POA.CHECK_DETAILS, {
      claimId: this.claimId,
    });
  }

  /**
   * Get URL to redirect to from add another disbursement page
   *
   * @param {boolean} value add another value
   * @returns {string} URL to redirect to
   */
  redirectFromAddAnotherDisbursement(value: boolean): string {
    const route =
      this.mode === "change"
        ? ROUTES.POA.CHECK_DETAILS
        : value
          ? ROUTES.POA.DISBURSEMENTS.DETAILS
          : this.claim.requiresEvidence || this.claim.hasEvidence
            ? ROUTES.POA.EVIDENCE_UPLOAD
            : ROUTES.POA.CHECK_DETAILS;

    return buildRoute(route, { claimId: this.claimId });
  }

  /**
   * Get URL to redirect to from disbursement details page
   *
   * @returns {string} URL to redirect to
   */
  redirectFromDisbursementDetails(): string {
    const route =
      this.mode === "change"
        ? ROUTES.POA.CHECK_DETAILS
        : ROUTES.POA.DISBURSEMENTS.ADD;

    return buildRoute(route, { claimId: this.claimId });
  }

  /**
   * Get URL to redirect to from remove disbursement page
   *
   * @returns {string} URL to redirect to
   */
  redirectFromRemoveDisbursement(): string {
    const route =
      this.mode === "change"
        ? ROUTES.POA.CHECK_DETAILS
        : ROUTES.POA.DISBURSEMENTS.ADD;

    return buildRoute(route, { claimId: this.claimId });
  }
}
