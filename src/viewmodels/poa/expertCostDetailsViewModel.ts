import type { ExpertCostDetailsForm } from "#src/helpers/expertCostDetailsValidation.js";
import {
  type FieldValidationError,
  getError,
  getErrorSummary,
  getStringValue,
} from "#src/helpers/validation.js";
import type { ErrorSummary } from "#src/viewmodels/components/errorSummary.js";
import { yesNoQuestionForm } from "#src/viewmodels/radioQuestionViewModel.js";
import type { UUID } from "uuidv7";
import { EXPERT_COST_DETAILS_FIELDS } from "#src/controllers/poa/expertCostDetailsController.js";

export interface ExpertCostDetailsViewModelParams {
  claimId: UUID;
  lineItemId?: UUID;
  form?: ExpertCostDetailsForm;
  errors?: FieldValidationError[];
}

/**
 * View model for the POA expert cost details page.
 */
export class ExpertCostDetailsViewModel {
  readonly claimId: string;
  readonly title: string;
  readonly form;
  readonly errorSummary: ErrorSummary;

  /**
   * Creates a profit cost bill line page view model.
   *
   * @param {ExpertCostDetailsViewModelParams} params View model params.
   */
  constructor(params: ExpertCostDetailsViewModelParams) {
    const { claimId, form = {}, errors = [] } = params;

    this.claimId = claimId.toString();
    this.title = "pages.poa.expertCostDetails.title";

    this.form = {
      activityDate: {
        value: {
          day: getStringValue(form.activityDateDay),
          month: getStringValue(form.activityDateMonth),
          year: getStringValue(form.activityDateYear),
        },
        error: getError(errors, EXPERT_COST_DETAILS_FIELDS.activityDate),
      },
      actualNetValue: {
        value: getStringValue(form.actualNetValue),
        error: getError(errors, EXPERT_COST_DETAILS_FIELDS.actualNetValue),
      },
      vatApplies: yesNoQuestionForm(
        EXPERT_COST_DETAILS_FIELDS.vatApplies,
        errors,
        form.vatApplies,
      ),
      feeEarnerName: {
        value: getStringValue(form.feeEarnerName),
        error: getError(errors, EXPERT_COST_DETAILS_FIELDS.feeEarnerName),
      },
      description: {
        value: getStringValue(form.description),
        error: getError(errors, EXPERT_COST_DETAILS_FIELDS.description),
      },
    };

    this.errorSummary = getErrorSummary(errors);
  }
}
