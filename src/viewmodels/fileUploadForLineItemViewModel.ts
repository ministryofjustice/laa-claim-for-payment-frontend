import { buildRoute, ROUTES } from "#routes/helper.js";
import { formatDateReadable } from "#src/helpers/dataFormatters.js";
import type { Claim, EvidenceItem, LineItem } from "#src/types/Claim.js";
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

    this.reusableDocuments = this.getReusableDocuments(claim, lineItem);
  }

  private getReusableDocuments(claim: Claim, lineItem: LineItem) {
    const otherLineItems = this.getOtherLineItems(claim, lineItem);
    const allEvidence = this.extractEvidenceItems(otherLineItems);
    const filteredEvidence = this.excludeExistingEvidence(allEvidence, lineItem);

    return this.mapToReusableDocuments(filteredEvidence);
  }

  private getOtherLineItems(claim: Claim, currentLineItem: LineItem): LineItem[] {
    return claim.lineItems?.filter(li => li.id !== currentLineItem.id) ?? [];
  }

  private extractEvidenceItems(lineItems: LineItem[]): EvidenceItem[] {
    return lineItems.flatMap(li => li.evidenceItems);
  }

  private excludeExistingEvidence(
    evidenceItems: EvidenceItem[],
    lineItem: LineItem
  ): EvidenceItem[] {
    const existingIds = new Set(lineItem.evidenceItems.map(e => e.id));
    return evidenceItems.filter(ei => !existingIds.has(ei.id));
  }

  private mapToReusableDocuments(evidenceItems: EvidenceItem[]) {
    return evidenceItems.map(ei => ({
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
      key: "common.onDate",
      args: {
        title: lineItem.title,
        date: formatDateReadable(lineItem.date),
      },
    };
  }
}
