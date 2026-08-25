import type {
  TaskList,
  TaskListItem,
  TaskListItemStatus,
} from "#src/viewmodels/components/taskList.js";
import { UploadStatus } from "#src/models/uploadStatus.js";
import { UploadStatusTagClass } from "#src/viewmodels/components/status.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { Category, type Claim, type LineItem } from "#src/types/Claim.js";
import type { Message } from "./components/message.js";
import type { LocalDate } from "#src/types/date.js";
import { formatDateReadable } from "#src/helpers/index.js";

/**
 *
 */
export class UploadEvidenceIndividuallyViewModel {
  readonly billNarrativeTaskList: TaskList;
  readonly workItemsTaskList: TaskList;
  readonly disbursementsTaskList: TaskList;

  /**
   * Creates a view model containing the task lists data.
   * @param {Claim} claim claim object
   */
  constructor(claim: Claim) {
    this.billNarrativeTaskList = {
      idPrefix: "bill-narrative",
      items: UploadEvidenceIndividuallyViewModel.buildBillNarrativeTasks(claim),
      attributes: {
        id: "bill-narrative",
      },
    };
    this.workItemsTaskList = {
      idPrefix: "work-items",
      items: UploadEvidenceIndividuallyViewModel.buildItemTasks(
        Category.WORK_ITEM,
        claim,
      ),
      attributes: {
        id: "work-items",
      },
    };
    this.disbursementsTaskList = {
      idPrefix: "disbursements",
      items: UploadEvidenceIndividuallyViewModel.buildItemTasks(
        Category.DISBURSEMENT,
        claim,
      ),
      attributes: {
        id: "disbursements",
      },
    };
  }

  private static buildLineItemTitle(title: string, date: LocalDate): Message {
    return {
      key: "common.onDate",
      args: {
        title,
        date: formatDateReadable(date.toDate()),
      },
    };
  }

  private static buildBillNarrativeTasks(claim: Claim): TaskListItem[] {
    return claim.lineItems
      .filter((lineItem) => lineItem.category === Category.BILL_NARRATIVE)
      .map((lineItem: LineItem) => ({
        title: {
          text: lineItem.title,
        },
        href: buildRoute(ROUTES.LINE_ITEM_UPLOAD.FILE_UPLOAD, {
          claimId: claim.id,
          lineItemId: lineItem.id,
        }),
        status: this.buildStatus(lineItem.evidenceItems),
      }));
  }

  private static buildItemTasks(
    category: Category,
    claim: Claim,
  ): TaskListItem[] {
    return claim.lineItems
      .filter((lineItem) => lineItem.category === category)
      .map((lineItem: LineItem) => ({
        title: {
          text: this.buildLineItemTitle(lineItem.title, lineItem.date),
        },
        href: buildRoute(ROUTES.LINE_ITEM_UPLOAD.FILE_UPLOAD, {
          claimId: claim.id,
          lineItemId: lineItem.id,
        }),
        status: this.buildStatus(lineItem.evidenceItems),
      }));
  }

  private static buildStatus(evidenceItems: string[]): TaskListItemStatus {
    const status =
      evidenceItems.length > 0
        ? UploadStatus.Uploaded
        : UploadStatus.NotUploaded;
    return {
      tag: {
        text: {
          key: `common.uploadStatus.${status}`,
        },
        classes: UploadStatusTagClass[status],
      },
    };
  }
}
