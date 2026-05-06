import type { EvidenceTask } from "#src/viewmodels/components/evidence.js";
import { UploadStatus } from "#src/models/uploadStatus.js";
import { UploadStatusTagClass } from "#src/viewmodels/components/status.js";

/**
 *
 */
export class UploadEvidenceIndividuallyViewModel {
  readonly billNarrativeTasks: EvidenceTask[];
  readonly workItemsTasks: EvidenceTask[];
  readonly disbursementsTasks: EvidenceTask[];

  /** Creates a view model containing the task lists data. */
  constructor() {
    this.billNarrativeTasks =
      UploadEvidenceIndividuallyViewModel.buildBillNarrativeTasks();
    this.workItemsTasks =
      UploadEvidenceIndividuallyViewModel.buildWorkItemsTasks();
    this.disbursementsTasks =
      UploadEvidenceIndividuallyViewModel.buildDisbursementsTasks();
  }

  // TODO - only show if a bill narrative is present in the claim
  private static buildBillNarrativeTasks(): EvidenceTask[] {
    return [
      {
        link: {
          text: "Bill narrative",
          href: "#",
        },
        tag: this.buildTag(UploadStatus.Uploaded),
      },
    ];
  }

  // TODO - use line items to populate the work items tasks
  private static buildWorkItemsTasks(): EvidenceTask[] {
    return [
      {
        link: {
          text: "Interim hearing on 20 December 2023",
          href: "#",
        },
        tag: this.buildTag(UploadStatus.NotUploaded),
      },
      {
        link: {
          text: "Interim hearing on 4 January 2024",
          href: "#",
        },
        tag: this.buildTag(UploadStatus.NotUploaded),
      },
      {
        link: {
          text: "Final hearing on 24 January 2024",
          href: "#",
        },
        tag: this.buildTag(UploadStatus.NotUploaded),
      },
    ];
  }

  // TODO - use line items to populate the disbursements tasks
  private static buildDisbursementsTasks(): EvidenceTask[] {
    return [
      {
        link: {
          text: "Enquiry agent on 23 December 2023",
          href: "#",
        },
        tag: this.buildTag(UploadStatus.NotUploaded),
      },
      {
        link: {
          text: "Enquiry agent on 13 January 2023",
          href: "#",
        },
        tag: this.buildTag(UploadStatus.NotUploaded),
      },
      {
        link: {
          text: "Car mileage on 20 December 2023",
          href: "#",
        },
        tag: this.buildTag(UploadStatus.NotUploaded),
      },
      {
        link: {
          text: "Car mileage on 4 January 2024",
          href: "#",
        },
        tag: this.buildTag(UploadStatus.NotUploaded),
      },
    ];
  }

  private static buildTag(status: UploadStatus): EvidenceTask["tag"] {
    return {
      text: {
        key: `common.uploadStatus.${status}`,
      },
      classes: UploadStatusTagClass[status],
    };
  }
}
