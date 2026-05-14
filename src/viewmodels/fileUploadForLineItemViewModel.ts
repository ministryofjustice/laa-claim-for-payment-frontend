import type { Claim, LineItem } from "#src/types/Claim.js";
import { buildRoute, ROUTES } from "#routes/helper.js";

/**
 *
 */
export class FileUploadForLineItemViewModel {
  readonly title: string;
  readonly saveAndContinueHref: string;

/**
 * Creates a view model containing the summary rows derived from the claim data
 * @param {Claim} claim Array of claims
 * @param {LineItem} lineItem Line item
 */
// TODO: Consider taking in a claim and a lineItemId instead of duplicating json
  constructor(claim: Claim, lineItem: LineItem) {
    const { title } = lineItem;
    
    this.title = title;
    this.saveAndContinueHref = buildRoute(ROUTES.UPLOAD_EVIDENCE_INDIVIDUALLY, {claimId: claim.id})
  }
}
