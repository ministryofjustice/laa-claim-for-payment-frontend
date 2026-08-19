import type { ReusableDocument } from "#src/viewmodels/components/taskList.js";
import type { Message } from "#src/viewmodels/components/message.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import type { UUID } from "uuidv7";
import { ClaimStatus } from "#src/types/Claim.js";
import type { ErrorSummary } from "#src/viewmodels/components/errorSummary.js";
import { UploadForm } from "#src/helpers/fileUploadValidation.js";
import { formatFileSize } from "#src/helpers/fileSizeFormatter.js";

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
  constructor(options: { claimId: UUID; form: UploadForm }) {
    const { claimId, form } = options;

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
