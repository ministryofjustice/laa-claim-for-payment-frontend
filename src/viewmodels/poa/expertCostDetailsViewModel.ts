import type { ExpertCostDetailsForm } from "#src/helpers/expertCostDetailsValidation.js";
import {
  type FieldValidationError,
  getError,
  getErrorSummary,
  getStringValue,
} from "#src/helpers/validation.js";
import type { ErrorSummary } from "#src/viewmodels/components/errorSummary.js";

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
      activityDateDay: getStringValue(form.activityDateDay),
      activityDateMonth: getStringValue(form.activityDateMonth),
      activityDateYear: getStringValue(form.activityDateYear),
      actualNetValue: getStringValue(form.actualNetValue),
      vatApplies: getStringValue(form.vatApplies),
      feeEarnerName: getStringValue(form.feeEarnerName),
      description: getStringValue(form.description),

      activityDateError: getError(errors, "activityDate"),
      actualNetValueError: getError(errors, "actualNetValue"),
      vatAppliesError: getError(errors, "vatApplies"),
      feeEarnerNameError: getError(errors, "feeEarnerName"),
      descriptionError: getError(errors, "description"),
    };

    this.errorSummary = getErrorSummary(errors);
  }
}
