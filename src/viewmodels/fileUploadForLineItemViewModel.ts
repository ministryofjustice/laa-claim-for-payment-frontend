import { Category, type Claim, ClaimStatus, type EvidenceItem, type LineItem } from "#src/types/Claim.js";
import type { Message } from "#src/viewmodels/components/message.js";
import type { ReusableDocument } from "#src/viewmodels/components/taskList.js";
import { formatFileSize } from "#src/helpers/fileSizeFormatter.js";
import { formatDateReadable } from "#src/helpers/index.js";
import { buildRoute, ROUTES } from "#routes/helper.js";

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
  constructor(
    claim: Claim,
    lineItem: LineItem,
  ) {
    this.uploadUrl = buildRoute(
      ROUTES.AJAX_UPLOAD_FILE_FOR_LINE_ITEM,
      {
        claimId: claim.id,
        lineItemId: lineItem.id,
      },
      { claimStatus: ClaimStatus.SUBMITTED },
    );

    this.deleteUrl = buildRoute(
      ROUTES.AJAX_DELETE_FILE_FOR_LINE_ITEM,
      {
        claimId: claim.id,
        lineItemId: lineItem.id,
      },
      { claimStatus: ClaimStatus.SUBMITTED },
    );

    this.title = FileUploadForLineItemViewModel.buildTitle(lineItem);

    this.saveAndContinueHref = buildRoute(
      ROUTES.UPLOAD_EVIDENCE_INDIVIDUALLY,
      {
        claimId: claim.id,
      },
    );

    const existingIds = new Set(lineItem.evidenceItems);

    this.reusableDocuments =
      claim.evidence
        .filter((evidence) => !existingIds.has(evidence.id))
        .map((evidence) =>
          FileUploadForLineItemViewModel.buildReusableDocument(evidence),
        );

    this.uploadedFiles =
      claim.evidence
        .filter((evidence) => existingIds.has(evidence.id))
        .map((evidence) =>
          FileUploadForLineItemViewModel.buildReusableDocument(evidence),
        );
  }

  private static buildReusableDocument(
    evidence: EvidenceItem,
  ): ReusableDocument {
    return {
      id: evidence.id,
      name: evidence.fileKey,
      size: formatFileSize(evidence.fileSize),
    };
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