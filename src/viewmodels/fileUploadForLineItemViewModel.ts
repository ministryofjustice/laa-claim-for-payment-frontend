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
  readonly reusableDocuments: ReusableDocument[];

  /**
   * Creates a view model containing the summary rows derived from the claim data
   * @param {Claim} claim Array of claims
   * @param {LineItem} lineItem Line item
   */
  constructor(claim: Claim, lineItem: LineItem) {
    this.title = FileUploadForLineItemViewModel.buildTitle(lineItem);

    this.saveAndContinueHref = buildRoute(ROUTES.UPLOAD_EVIDENCE_INDIVIDUALLY, {
      claimId: claim.id,
    });

    this.reusableDocuments =
      claim.lineItems
        ?.filter((li) => li.id !== lineItem.id)
        .flatMap((li) => li.evidenceItems)
        .map((ei) => ({ name: ei.fileKey, size: formatFileSize(ei.fileSize) })) ?? [];
  }

  private static buildTitle(lineItem: LineItem): string | Message {
    if (lineItem.category === Category.BILL_NARRATIVE) {
      return lineItem.title;
    }

    return {
      key: "common.onDate",
      args: {
        title: lineItem.title,
        date: formatDateReadable(lineItem.date),
      },
    };
  }
}
