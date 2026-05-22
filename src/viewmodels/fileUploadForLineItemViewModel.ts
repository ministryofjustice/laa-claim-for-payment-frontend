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
  readonly uploadedFiles: ReusableDocument[];

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

    this.saveAndContinueHref = buildRoute(ROUTES.UPLOAD_EVIDENCE_INDIVIDUALLY, {
      claimId: claim.id,
    });

    const existingIds = new Set(lineItem.evidenceItems.map((ei) => ei.id));
    this.reusableDocuments =
      claim.evidence
        ?.filter((e) => !existingIds.has(e.id))
        .map((e) => ({
          id: e.id,
          name: e.fileKey,
          size: formatFileSize(e.fileSize),
        })) ?? [];

    this.uploadedFiles =
      claim.evidence
        ?.filter((evidence) => existingIds.has(evidence.id))
        .map((evidence) => ({
          id: evidence.id,
          name: evidence.fileKey,
          size: formatFileSize(evidence.fileSize),
        })) ?? [];
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
