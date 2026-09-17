import { type Claim, CostType, Count } from "#src/types/Claim.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import type { ProfitCostDetails } from "#src/types/poa.js";

/**
 *
 */
export class PoaNavigator {
  private readonly claim: Claim;
  private readonly claimId: string;

  /**
   * Constructs a navigator for the POA journey
   *
   * @param {Claim} claim claim
   */
  constructor(claim: Claim) {
    this.claim = claim;
    const { id: claimId } = claim;
    this.claimId = claimId;
  }

  /**
   * Get URL to redirect to from cost type page
   *
   * @param {CostType} value cost type value
   * @returns {string} URL to redirect to
   */
  redirectFromCostType(value: CostType): string {
    const route: Record<CostType, string> = {
      [CostType.PROFIT_COST]: ROUTES.POA.PROFIT_COST.DETAILS,
      [CostType.EXPERT_COST]: ROUTES.POA.DISBURSEMENTS.ADD,
      [CostType.NON_EXPERT_DISBURSEMENT]: ROUTES.POA.DISBURSEMENTS.ADD,
    };

    return buildRoute(route[value], { claimId: this.claimId });
  }

  /**
   * Get URL to redirect to from profit cost details page
   *
   * @param {ProfitCostDetails} value profit cost details value
   * @returns {string} URL to redirect to
   */
  redirectFromProfitCostDetails(value: ProfitCostDetails): string {
    const route = value.transferOfSolicitor
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
    const route: Record<Count, string> = {
      [Count.ZERO]: ROUTES.POA.PROFIT_COST.NUMBER_OF_CLIENTS_START_OF_CASE,
      [Count.ONE]: ROUTES.POA.PROFIT_COST.MULTIPLE_CLIENT_HEARINGS,
      [Count.TWO_OR_MORE]: ROUTES.POA.PROFIT_COST.MULTIPLE_CLIENT_HEARINGS,
    };

    return buildRoute(route[value], { claimId: this.claimId });
  }

  /**
   * Get URL to redirect to from number of clients at start of case page
   *
   * @returns {string} URL to redirect to
   */
  redirectFromNumberOfClientStartOfCase(): string {
    return buildRoute(ROUTES.POA.PROFIT_COST.MULTIPLE_CLIENT_HEARINGS, {
      claimId: this.claimId,
    });
  }

  /**
   * Get URL to redirect to from multiple client hearings page
   *
   * @returns {string} URL to redirect to
   */
  redirectFromMultipleClientHearings(): string {
    return buildRoute(ROUTES.POA.PROFIT_COST.ESCAPING_FIXED_FEE, {
      claimId: this.claimId,
    });
  }

  /**
   * Get URL to redirect to from escaping standard fixed fee page
   *
   * @returns {string} URL to redirect to
   */
  redirectFromEscapingStandardFixedFee(): string {
    return buildRoute(ROUTES.POA.PROFIT_COST.CPGFS_BILL_LINE, {
      claimId: this.claimId,
    });
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
      escaped === true
        ? ROUTES.POA.EVIDENCE_UPLOAD
        : escaped === false
          ? ROUTES.POA.CHECK_DETAILS
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
   * @param {boolean} value boolean value
   * @returns {string} URL to redirect to
   */
  redirectFromAddAnotherDisbursement(value: boolean): string {
    const route = value
      ? ROUTES.POA.DISBURSEMENTS.DETAILS
      : ROUTES.POA.EVIDENCE_UPLOAD;

    return buildRoute(route, { claimId: this.claimId });
  }

  /**
   * Get URL to redirect to from disbursement details page
   *
   * @returns {string} URL to redirect to
   */
  redirectFromDisbursementDetails(): string {
    return buildRoute(ROUTES.POA.DISBURSEMENTS.ADD, {
      claimId: this.claimId,
    });
  }

  /**
   * Get URL to redirect to from remove disbursement page
   *
   * @returns {string} URL to redirect to
   */
  redirectFromRemoveDisbursement(): string {
    return buildRoute(ROUTES.POA.DISBURSEMENTS.ADD, {
      claimId: this.claimId,
    });
  }
}
