import { Category, type Claim, ClaimStatus, type LineItem } from "#src/types/Claim.js";
import type { Message } from "#src/viewmodels/components/message.js";
import { formatDateReadable } from "#src/helpers/index.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { EvidenceUploadViewModel } from "#src/viewmodels/evidenceUploadViewModel.js";
import type { ErrorSummary } from "#src/viewmodels/components/errorSummary.js";

/**
 *
 */
export class FileUploadForLineItemViewModel extends EvidenceUploadViewModel {
  readonly title: string | Message;
  readonly saveAndContinueHref: string;
  readonly uploadUrl: string;
  readonly deleteUrl: string;
  readonly errorSummary?: ErrorSummary;

  /**
   * Creates a view model containing the summary rows derived from the claim data
   * @param {Claim} claim Array of claims
   * @param {LineItem} lineItem Line item
   */
  constructor(
    claim: Claim,
    lineItem: LineItem,
  ) {
    super(claim.evidence, lineItem.evidenceItems);

    this.uploadUrl = buildRoute(
      ROUTES.LINE_ITEM_UPLOAD.AJAX_UPLOAD,
      {
        claimId: claim.id,
        lineItemId: lineItem.id,
      },
      { claimStatus: ClaimStatus.SUBMITTED },
    );

    this.deleteUrl = buildRoute(
      ROUTES.LINE_ITEM_UPLOAD.AJAX_DELETE,
      {
        claimId: claim.id,
        lineItemId: lineItem.id,
      },
      { claimStatus: ClaimStatus.SUBMITTED },
    );

    this.title = FileUploadForLineItemViewModel.buildTitle(lineItem);

    this.saveAndContinueHref = buildRoute(
      ROUTES.LINE_ITEM_UPLOAD.UPLOAD_EVIDENCE_INDIVIDUALLY,
      {
        claimId: claim.id,
      },
    );

    this.errorSummary = undefined;
  }

  private static buildTitle(lineItem: LineItem): string | Message {
    if (lineItem.category === Category.BILL_NARRATIVE) {
      return lineItem.title;
    }

    return {
      key: "common.onDate",
      args: {
        title: lineItem.title,
        date: formatDateReadable(lineItem.date.toDate()),
      },
    };
  }
}