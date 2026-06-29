import type { ExpertCostDetailsForm } from "#src/helpers/expertCostDetailsValidation.js";
import {
  type FieldValidationError,
  getError,
  getErrorSummary,
  getStringValue,
} from "#src/helpers/validation.js";
import type { ErrorSummary } from "#src/viewmodels/components/errorSummary.js";
import { radioQuestionForm } from "#src/viewmodels/radioQuestionViewModel.js";
import { type BooleanChoice, booleanChoices } from "#src/models/booleanChoice.js";

export interface ExpertCostDetailsViewModelParams {
  claimId: number;
  expertCostId: number;
  form?: ExpertCostDetailsForm;
  errors?: FieldValidationError[];
}

/**
 * View model for the POA expert cost details page.
 */
export class ExpertCostDetailsViewModel {
  readonly claimId: number;
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

    this.claimId = claimId;
    this.title = "pages.poa.expertCostDetails.title";

    this.form = {
      activityDate: {
        value: {
          day: getStringValue(form.activityDateDay),
          month: getStringValue(form.activityDateMonth),
          year: getStringValue(form.activityDateYear),
        },
        error: getError(errors, "activityDate"),
      },
      actualNetValue: {
        value: getStringValue(form.actualNetValue),
        error: getError(errors, "actualNetValue"),
      },
      vatApplies: radioQuestionForm<BooleanChoice>(
        "vatApplies",
        booleanChoices,
        errors,
        form.vatApplies,
      ),
      feeEarnerName: {
        value: getStringValue(form.feeEarnerName),
        error: getError(errors, "feeEarnerName"),
      },
      description: {
        value: getStringValue(form.description),
        error: getError(errors, "description"),
      },
    };

    this.errorSummary = getErrorSummary(errors);
  }
}
