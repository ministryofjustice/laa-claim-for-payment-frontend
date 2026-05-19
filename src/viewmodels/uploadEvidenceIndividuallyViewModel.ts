import type { EvidenceTask } from "#src/viewmodels/components/evidence.js";
import { UploadStatus } from "#src/models/uploadStatus.js";
import { UploadStatusTagClass } from "#src/viewmodels/components/status.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import type { Claim } from "#src/types/Claim.js";

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
      UploadEvidenceIndividuallyViewModel.buildWorkItemsTasks(claim);
    this.disbursementsTasks =
      UploadEvidenceIndividuallyViewModel.buildDisbursementsTasks(claim);
  }

  // TODO - only show if a bill narrative is present in the claim
  private static buildBillNarrativeTasks(claim: Claim): EvidenceTask[] {
    return [
      {
        link: {
          text: "Bill narrative",
          href:  buildRoute(ROUTES.UPLOAD_FILE_FOR_LINE_ITEM, {claimId: claim.id, lineItemId: 1}),
        },
        tag: this.buildTag(UploadStatus.Uploaded),
      },
    ];
  }

  // TODO - use line items to populate the work items tasks
  private static buildWorkItemsTasks(claim: Claim): EvidenceTask[] {
    return [
      {
        link: {
          text: "Interim hearing on 20 December 2023",
          href:  buildRoute(ROUTES.UPLOAD_FILE_FOR_LINE_ITEM, {claimId: claim.id, lineItemId: 2}),
        },
        tag: this.buildTag(UploadStatus.NotUploaded),
      },
      {
        link: {
          text: "Interim hearing on 4 January 2024",
          href:  buildRoute(ROUTES.UPLOAD_FILE_FOR_LINE_ITEM, {claimId: claim.id, lineItemId: 3}),
        },
        tag: this.buildTag(UploadStatus.NotUploaded),
      },
      {
        link: {
          text: "Final hearing on 24 January 2024",
          href:  buildRoute(ROUTES.UPLOAD_FILE_FOR_LINE_ITEM, {claimId: claim.id, lineItemId: 4}),
        },
        tag: this.buildTag(UploadStatus.NotUploaded),
      },
    ];
  }

  // TODO - use line items to populate the disbursements tasks
  private static buildDisbursementsTasks(claim: Claim): EvidenceTask[] {
    return [
      {
        link: {
          text: "Enquiry agent on 23 December 2023",
          href:  buildRoute(ROUTES.UPLOAD_FILE_FOR_LINE_ITEM, {claimId: claim.id, lineItemId: 5}),
        },
        tag: this.buildTag(UploadStatus.NotUploaded),
      },
      {
        link: {
          text: "Enquiry agent on 13 January 2023",
          href:  buildRoute(ROUTES.UPLOAD_FILE_FOR_LINE_ITEM, {claimId: claim.id, lineItemId: 6}),
        },
        tag: this.buildTag(UploadStatus.NotUploaded),
      },
      {
        link: {
          text: "Car mileage on 20 December 2023",
          href:  buildRoute(ROUTES.UPLOAD_FILE_FOR_LINE_ITEM, {claimId: claim.id, lineItemId: 7}),
        },
        tag: this.buildTag(UploadStatus.NotUploaded),
      },
      {
        link: {
          text: "Car mileage on 4 January 2024",
          href:  buildRoute(ROUTES.UPLOAD_FILE_FOR_LINE_ITEM, {claimId: claim.id, lineItemId: 8}),
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
