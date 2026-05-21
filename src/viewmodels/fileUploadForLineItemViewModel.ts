import { buildRoute, ROUTES } from "#routes/helper.js";
import { formatDateReadable } from "#src/helpers/dataFormatters.js";
import type { Claim, LineItem } from "#src/types/Claim.js";
import { Category } from "#src/types/Claim.js";
import type { Message } from "#src/viewmodels/components/message.js";
import type { ReusableDocument } from "#src/viewmodels/components/evidence.js";
import { formatFileSize } from "#src/helpers/fileSizeFormatter.js";

/**
 *
 */
export class FileUploadForLineItemViewModel {
  readonly title: string | Message;
  readonly saveAndContinueHref: string;
  readonly uploadUrl: string;
  readonly deleteUrl: string;
  readonly reusableDocuments: ReusableDocument[];

  /**
   * Creates a view model containing the summary rows derived from the claim data
   * @param {Claim} claim Array of claims
   * @param {LineItem} lineItem Line item
   */
  constructor(claim: Claim, lineItem: LineItem) {
    const fileUploadRoute = buildRoute(ROUTES.UPLOAD_FILE_FOR_LINE_ITEM, {
      claimId: claim.id,
      lineItemId: lineItem.id,
    });

    this.uploadUrl = `${fileUploadRoute}/ajax-upload`;
    this.deleteUrl = `${fileUploadRoute}/ajax-delete`;

    this.title = FileUploadForLineItemViewModel.buildTitle(lineItem);

    this.saveAndContinueHref = buildRoute(
      ROUTES.UPLOAD_EVIDENCE_INDIVIDUALLY,
      { claimId: claim.id },
    );

    const existingIds = new Set(lineItem.evidenceItems.map(ei => ei.id));

    this.reusableDocuments =
      Array.from(
        new Map(
          (claim.lineItems ?? [])
            // Exclude the current line item so we don't show evidence already linked here
            .filter((li) => li.id !== lineItem.id)
            // Collect all evidence items from the remaining line items
            .flatMap((li) => li.evidenceItems)
            // Exclude any evidence already linked to this line item
            .filter((ei) => !existingIds.has(ei.id))
            // Use the evidence item id as the map key to remove duplicates
            .map((ei) => [ei.id, ei])
        ).values()
      ).map((ei) => ({
        id: ei.id,
        name: ei.fileKey,
        size: formatFileSize(ei.fileSize),
      }));
  }

  private static buildTitle(lineItem: LineItem): string | Message {
    if (lineItem.category === Category.BILL_NARRATIVE) {
      return lineItem.title;
    }

    return {
      key: 'common.onDate',
      args: {
        title: lineItem.title,
        date: formatDateReadable(lineItem.date),
      },
    };
  }
}
