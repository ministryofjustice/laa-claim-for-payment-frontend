import type { DisbursementDetailsForm } from "#src/helpers/disbursementDetailsValidation.js";
import { buildRadios, type Radios } from "#src/viewmodels/components/radios.js";
import type { BooleanChoice } from "#src/models/booleanChoice.js";
import {
  buildDateInput,
  type DateInput,
} from "#src/viewmodels/components/dateInput.js";
import {
  buildTextInput,
  buildMonetaryInput,
  type TextInput,
} from "#src/viewmodels/components/textInput.js";
import type { ErrorSummary } from "#src/viewmodels/components/errorSummary.js";

export interface DisbursementDetailsViewModelParams {
  form: DisbursementDetailsForm;
}

/**
 * View model for the POA expert cost details page.
 */
export class DisbursementDetailsViewModel {
  readonly title: string;
  readonly activityDateInput: DateInput;
  readonly actualNetValueInput: TextInput;
  readonly vatApplicableRadios: Radios<BooleanChoice>;
  readonly feeEarnerNameInput: TextInput;
  readonly descriptionInput: TextInput;
  readonly errorSummary?: ErrorSummary;

  /**
   * Creates a profit cost bill line page view model.
   *
   * @param {DisbursementDetailsViewModelParams} params View model params.
   */
  constructor({ form }: DisbursementDetailsViewModelParams) {
    this.title = `${form.messagePrefix}.title`;

    this.activityDateInput = buildDateInput(form.fields.activityDate);

    this.actualNetValueInput = buildMonetaryInput(form.fields.actualNetValue);

    this.vatApplicableRadios = buildRadios(
      form.fields.vatApplies,
      {
        key: `${form.fields.vatApplies.messagePrefix}.title`,
      },
      false,
    );

    this.feeEarnerNameInput = buildTextInput(form.fields.feeEarnerName);

    this.descriptionInput = buildTextInput(form.fields.description);

    this.errorSummary = form.getErrorSummary();
  }
}
