import type { Message } from "#src/viewmodels/components/message.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { type Claim, ClaimStatus } from "#src/types/Claim.js";
import type { ErrorSummary } from "#src/viewmodels/components/errorSummary.js";
import type { UploadForm } from "#src/helpers/fileUploadValidation.js";
import type { Alert } from "#src/viewmodels/components/alert.js";
import { formatMoneyWhole } from "#src/helpers/index.js";
import config from "#config.js";
import { EvidenceUploadViewModel } from "#src/viewmodels/evidenceUploadViewModel.js";

export interface PoaEvidenceUploadViewModelParams {
  claim: Claim;
  form: UploadForm;
}

/**
 * View model for the POA evidence upload page.
 */
export class PoaEvidenceUploadViewModel extends EvidenceUploadViewModel {
  readonly title: string | Message;
  readonly uploadUrl: string;
  readonly deleteUrl: string;
  readonly saveAndContinueHref: string;
  readonly saveAndComeBackLaterHref: string;
  readonly errorSummary?: ErrorSummary;
  readonly alert?: Alert;

  /**
   * Creates a profit cost details evidence upload view model.
   *
   * @param {PoaEvidenceUploadViewModelParams} params View model params.
   */
  constructor({ claim, form }: PoaEvidenceUploadViewModelParams) {
    super(
      claim.evidence,
      claim.evidence.map(({ id }) => id),
    );

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

    this.errorSummary = form.getErrorSummary();

    if (!claim.requiresEvidence && claim.hasEvidence) {
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
