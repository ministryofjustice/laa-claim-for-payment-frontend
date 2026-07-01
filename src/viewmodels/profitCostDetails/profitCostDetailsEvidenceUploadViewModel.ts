import type { ReusableDocument } from "#src/viewmodels/components/taskList.js";
import type { Message } from "#src/viewmodels/components/message.js";
import { type FieldValidationError, getErrorSummary } from "#src/helpers/validation.js";
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
  readonly errorSummary: ErrorSummary;

/**
 * Creates a profit cost details evidence upload view model.
 *
 * @param {object} options View model options.
 * @param {string} options.uploadUrl URL used by the AJAX upload request.
 * @param {string} options.deleteUrl URL used by the AJAX delete request.
 * @param {string} options.saveAndContinueHref URL for the save and continue action.
 * @param {string} options.saveAndComeBackLaterHref URL for the save and come back later action.
 * @param {ReusableDocument[]} [options.uploadedFiles] Files already uploaded to the claim.
 * @param {FieldValidationError[]} [options.errors] Validation errors.
 */
  constructor(options: {
  uploadUrl: string;
  deleteUrl: string;
  saveAndContinueHref: string;
  saveAndComeBackLaterHref: string;
  uploadedFiles?: ReusableDocument[];
  errors?: FieldValidationError[];
}) {
    const {
      uploadUrl,
      deleteUrl,
      saveAndContinueHref,
      saveAndComeBackLaterHref,
      uploadedFiles = [],
      errors = [],
    } = options;

    this.title = "pages.poaEvidenceUpload.title";
    this.uploadUrl = uploadUrl;
    this.deleteUrl = deleteUrl;
    this.saveAndContinueHref = saveAndContinueHref;
    this.saveAndComeBackLaterHref = saveAndComeBackLaterHref;
    this.uploadedFiles = uploadedFiles;
    this.errorSummary = getErrorSummary(errors);
  }
}