import type { EvidenceTask } from "#src/viewmodels/components/evidence.js";
import { UploadStatus } from "#src/models/uploadStatus.js";
import { UploadStatusTagClass } from "#src/viewmodels/components/status.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { type Claim, Category, type EvidenceItem } from "#src/types/Claim.js";
import { formatDateReadable } from "#src/helpers/dataFormatters.js";
import type { Message } from "./components/message.js";

/**
 *
 */
export class UploadEvidenceIndividuallyViewModel {
  readonly billNarrativeTasks: EvidenceTask[];
  readonly workItemsTasks: EvidenceTask[];
  readonly disbursementsTasks: EvidenceTask[];

/**
 * Creates a view model containing the task lists data.
 * @param {Claim} claim claim object
 */
  constructor(claim: Claim) {
    this.billNarrativeTasks =
      UploadEvidenceIndividuallyViewModel.buildBillNarrativeTasks(claim);
    this.workItemsTasks =
      UploadEvidenceIndividuallyViewModel.buildItemTasks(Category.WORK_ITEM, claim);
    this.disbursementsTasks =
      UploadEvidenceIndividuallyViewModel.buildItemTasks(Category.DISBURSEMENT, claim);
  }

  private static buildLineItemTitle(title: string, date: Date): Message {
    return {
      key: 'common.onDate',
      args: {
        title,
        date: formatDateReadable(date),
      },
    };
  }

  private static buildBillNarrativeTasks(claim: Claim): EvidenceTask[] {
    return claim.lineItems?.filter((lineItem) => lineItem.category ===  Category.BILL_NARRATIVE)
    .map((lineItem) => ({
      link: {
        text: lineItem.title,
        href:  buildRoute(ROUTES.UPLOAD_FILE_FOR_LINE_ITEM, {claimId: claim.id, lineItemId: lineItem.id}),
      },
      tag: this.buildTag(lineItem.evidenceItems),
    })) ?? [];
  }

  private static buildItemTasks(category: Category, claim: Claim): EvidenceTask[] {
    return claim.lineItems?.filter((lineItem) => lineItem.category ===  category)
    .map((lineItem) => ({
      link: {
        text: this.buildLineItemTitle(lineItem.title, lineItem.date ),
        href:  buildRoute(ROUTES.UPLOAD_FILE_FOR_LINE_ITEM, {claimId: claim.id, lineItemId: lineItem.id}),
      },
      tag: this.buildTag(lineItem.evidenceItems),
    })) ?? [];
  }

  private static buildTag(evidenceItems: EvidenceItem[]): EvidenceTask["tag"] {
    const status = evidenceItems.length > 0 ?  UploadStatus.Uploaded : UploadStatus.NotUploaded
    return {
      text: {
        key: `common.uploadStatus.${status}`,
      },
      classes: UploadStatusTagClass[status],
    };
  }
}
