import type { ReusableDocument } from "#src/viewmodels/components/taskList.js";
import type { Message } from "#src/viewmodels/components/message.js";
import type { FieldValidationError, Form } from "#src/helpers/validation.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import type { UUID } from "uuidv7";
import { ClaimStatus } from "#src/types/Claim.js";
import type { ErrorSummary } from "#src/viewmodels/components/errorSummary.js";

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
   * @param {object} options View model options.
   * @param {string} options.uploadUrl URL used by the AJAX upload request.
   * @param {string} options.deleteUrl URL used by the AJAX delete request.
   * @param {string} options.saveAndContinueHref URL for the save and continue action.
   * @param {string} options.saveAndComeBackLaterHref URL for the save and come back later action.
   * @param options.claimId
   * @param options.form
   * @param {ReusableDocument[]} [options.uploadedFiles] Files already uploaded to the claim.
   * @param {FieldValidationError[]} [options.errors] Validation errors.
   */
  constructor(options: {
    claimId: UUID;
    form: Form<unknown, unknown>;
    uploadedFiles?: ReusableDocument[];
  }) {
    const { claimId, form, uploadedFiles = [] } = options;

    this.title = "pages.poaEvidenceUpload.title";
    this.uploadUrl = buildRoute(
      ROUTES.AJAX_UPLOAD_POA_EVIDENCE,
      { claimId },
      { claimStatus: ClaimStatus.DRAFT },
    );
    this.deleteUrl = buildRoute(
      ROUTES.AJAX_DELETE_POA_EVIDENCE,
      { claimId },
      { claimStatus: ClaimStatus.DRAFT },
    );
    this.saveAndContinueHref = buildRoute(ROUTES.POA_CHECK_YOUR_DETAILS, {
      claimId,
    });
    this.saveAndComeBackLaterHref = "#";
    this.uploadedFiles = uploadedFiles;
    this.errorSummary = form.getErrorSummary();
  }
}
