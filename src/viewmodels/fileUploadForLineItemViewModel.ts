import { Claim, EvidenceItem, LineItem } from "#src/types/Claim.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { ReusableDocument } from "#src/viewmodels/components/evidence.js";

/**
 *
 */
export class FileUploadForLineItemViewModel {
  readonly title: string;
  readonly saveAndContinueHref: string;
  readonly reusableDocuments: ReusableDocument[];

  /**
   * Creates a view model containing the summary rows derived from the claim data
   * @param {Claim} claim Array of claims
   * @param {LineItem} lineItem Line item
   */
  // TODO: Consider taking in a claim and a lineItemId instead of duplicating json
  constructor(claim: Claim, lineItem: LineItem) {
    const { title } = lineItem;

    this.title = title;
    this.saveAndContinueHref = buildRoute(ROUTES.UPLOAD_EVIDENCE_INDIVIDUALLY, {
      claimId: claim.id,
    });
    this.reusableDocuments =
      claim.lineItems
        ?.filter((li) => li.id != claim.id)
        .flatMap((li) => li.evidenceItems)
        .map(ei => ({ name: ei.fileKey, size: "" })) ?? [];
  }
}
