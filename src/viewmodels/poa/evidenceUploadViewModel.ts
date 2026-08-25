import type { ReusableDocument } from "#src/viewmodels/components/taskList.js";
import type { Message } from "#src/viewmodels/components/message.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import type { UUID } from "uuidv7";
import { ClaimStatus } from "#src/types/Claim.js";
import type { ErrorSummary } from "#src/viewmodels/components/errorSummary.js";
import type { UploadForm } from "#src/helpers/fileUploadValidation.js";
import { formatFileSize } from "#src/helpers/fileSizeFormatter.js";

export interface PoaEvidenceUploadViewModelParams {
  claimId: UUID;
  form: UploadForm;
}

/**
 * View model for the POA evidence upload page.
 */
export class PoaEvidenceUploadViewModel {
  readonly title: string | Message;
  readonly uploadUrl: string;
  readonly deleteUrl: string;
  readonly saveAndContinueHref: string;
  readonly saveAndComeBackLaterHref: string;
  readonly uploadedFiles: ReusableDocument[];
  readonly errorSummary?: ErrorSummary;

  /**
   * Creates a profit cost details evidence upload view model.
   *
   * @param {PoaEvidenceUploadViewModelParams} params View model params.
   */
  constructor({ claimId, form }: PoaEvidenceUploadViewModelParams) {
    this.title = `${form.messagePrefix}.title`;

    this.uploadUrl = buildRoute(
      ROUTES.POA.AJAX_UPLOAD_EVIDENCE,
      { claimId },
      { claimStatus: ClaimStatus.DRAFT },
    );

    this.deleteUrl = buildRoute(
      ROUTES.POA.AJAX_DELETE_EVIDENCE,
      { claimId },
      { claimStatus: ClaimStatus.DRAFT },
    );

    this.saveAndContinueHref = buildRoute(ROUTES.POA.CHECK_DETAILS, {
      claimId,
    });

    this.saveAndComeBackLaterHref = "#";

    this.uploadedFiles = (form.fields.field.getValue() ?? []).map(
      (evidence) => ({
        id: evidence.id,
        name: evidence.fileKey,
        size: formatFileSize(evidence.fileSize),
      }),
    );

    this.errorSummary = form.getErrorSummary();
  }
}
