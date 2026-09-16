import type { ReusableDocument } from "#src/viewmodels/components/taskList.js";
import type { Message } from "#src/viewmodels/components/message.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { type Claim, ClaimStatus } from "#src/types/Claim.js";
import type { ErrorSummary } from "#src/viewmodels/components/errorSummary.js";
import type { UploadForm } from "#src/helpers/fileUploadValidation.js";
import { formatFileSize } from "#src/helpers/fileSizeFormatter.js";
import type { Alert } from "#src/viewmodels/components/alert.js";
import { formatMoneyWhole } from "#src/helpers/index.js";
import config from "#config.js";

export interface PoaEvidenceUploadViewModelParams {
  claim: Claim;
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
  readonly alert?: Alert;

  /**
   * Creates a profit cost details evidence upload view model.
   *
   * @param {PoaEvidenceUploadViewModelParams} params View model params.
   */
  constructor({ claim, form }: PoaEvidenceUploadViewModelParams) {
    const { id: claimId } = claim;
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

    if (claim.hasEvidence && !claim.requiresEvidence) {
      this.alert = {
        variant: "information",
        title: {
          key: "pages.poaEvidenceUpload.alert.title",
          args: {
            amount: formatMoneyWhole(
              config.constants.evidenceThresholdInPounds,
            ),
          },
        },
        showTitleAsHeading: true,
        dismissable: false,
        text: {
          key: "pages.poaEvidenceUpload.alert.text",
        },
      };
    }
  }
}
