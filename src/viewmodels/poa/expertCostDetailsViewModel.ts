import type { ExpertCostDetailsForm } from "#src/helpers/expertCostDetailsValidation.js";
import {
  type FieldValidationError,
  type FieldValidationErrorsBuilder,
  getError,
  getErrorSummary,
  getStringValue,
} from "#src/helpers/validation.js";
import type { ErrorSummary } from "#src/viewmodels/components/errorSummary.js";
import { radioQuestionForm } from "#src/viewmodels/radioQuestionViewModel.js";
import {
  type BooleanChoice,
  booleanChoices,
} from "#src/models/booleanChoice.js";
import type { UUID } from "uuidv7";

export interface ExpertCostDetailsViewModelParams {
  claimId: UUID;
  lineItemId?: UUID;
  form?: ExpertCostDetailsForm;
  getErrors?: FieldValidationErrorsBuilder;
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
    const { claimId, form = {}, getErrors = (_: string) => [] } = params;

    this.claimId = claimId.toString();
    const prefix = "pages.poa.expertCostDetails";
    this.title = `${prefix}.title`;

    const activityDateError = getError(
      getErrors(`${prefix}.activityDate`),
      "activityDate",
    );
    const actualNetValueError = getError(
      getErrors(`${prefix}.actualNetValue`),
      "actualNetValue",
    );
    const vatAppliesError = getError(
      getErrors(`${prefix}.vatApplies`),
      "vatApplies",
    );
    const feeEarnerNameError = getError(
      getErrors(`${prefix}.feeEarnerName`),
      "feeEarnerName",
    );
    const descriptionError = getError(
      getErrors(`${prefix}.description`),
      "description",
    );

    const errors = [
      activityDateError,
      actualNetValueError,
      vatAppliesError,
      feeEarnerNameError,
      descriptionError,
    ].filter((error): error is FieldValidationError => error !== undefined);

    this.form = {
      activityDate: {
        value: {
          day: getStringValue(form.activityDateDay),
          month: getStringValue(form.activityDateMonth),
          year: getStringValue(form.activityDateYear),
        },
        error: activityDateError,
      },
      actualNetValue: {
        value: getStringValue(form.actualNetValue),
        error: actualNetValueError,
      },
      vatApplies: radioQuestionForm<BooleanChoice>(
        "vatApplies",
        "vatApplies",
        booleanChoices,
        vatAppliesError,
        form.vatApplies,
      ),
      feeEarnerName: {
        value: getStringValue(form.feeEarnerName),
        error: feeEarnerNameError,
      },
      description: {
        value: getStringValue(form.description),
        error: descriptionError,
      },
    };

    this.errorSummary = getErrorSummary(errors);
  }
}
