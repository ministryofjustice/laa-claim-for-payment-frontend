import { formatDateReadable } from "#src/helpers/dataFormatters.js";
import { Category, type Claim, type EvidenceItem, type LineItem } from "#src/types/Claim.js";
import type { Message } from "#src/viewmodels/components/message.js";
import type { ReusableDocument } from "#src/viewmodels/components/taskList.js";
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
   * @param {string} uploadUrl url for upload
   * @param {string} deleteUrl url for delete
   * @param {string} saveAndContinueHref url for form submit
   */
<<<<<<< HEAD
  constructor(claim: Claim, lineItem: LineItem) {
    const fileUploadRoute = buildRoute(ROUTES.UPLOAD_FILE_FOR_LINE_ITEM, {
      claimId: claim.id,
      lineItemId: lineItem.id,
    });

    this.uploadUrl = `${fileUploadRoute}/ajax-upload`;
    this.deleteUrl = `${fileUploadRoute}/ajax-delete`;

=======
  // eslint-disable-next-line @typescript-eslint/max-params -- ignore
  constructor(claim: Claim, lineItem: LineItem, uploadUrl: string, deleteUrl: string, saveAndContinueHref: string) {
    this.uploadUrl = uploadUrl;
    this.deleteUrl = deleteUrl;
>>>>>>> cead14f (more ajax endpoints for POA)
    this.title = FileUploadForLineItemViewModel.buildTitle(lineItem);
    this.saveAndContinueHref = saveAndContinueHref;

    const existingIds = new Set(lineItem.evidenceItems);

    this.reusableDocuments =
      claim.evidence
        ?.filter((e) => !existingIds.has(e.id))
        .map((evidence) =>
          FileUploadForLineItemViewModel.buildReusableDocument(evidence),
        ) ?? [];

    this.uploadedFiles =
      claim.evidence
        ?.filter((e) => existingIds.has(e.id))
        .map((evidence) =>
          FileUploadForLineItemViewModel.buildReusableDocument(evidence),
        ) ?? [];
  }

  private static buildReusableDocument(evidence: EvidenceItem): ReusableDocument {
    return {
      id: evidence.id,
      name: evidence.fileKey,
      size: formatFileSize(evidence.fileSize),
    }
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
