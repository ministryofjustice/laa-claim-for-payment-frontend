import type { ExpertCostDetailsForm } from "#src/helpers/expertCostDetailsValidation.js";
import { buildRadios, type Radios } from "#src/viewmodels/components/radios.js";
import type { BooleanChoice } from "#src/models/booleanChoice.js";
import {
  buildDateInput,
  type DateInput,
} from "#src/viewmodels/components/dateInput.js";
import {
  buildInput,
  buildMonetaryInput,
  type Input,
} from "#src/viewmodels/components/input.js";
import type { ErrorSummary } from "#src/viewmodels/components/errorSummary.js";

export interface ExpertCostDetailsViewModelParams {
  form: ExpertCostDetailsForm;
}

/**
 * View model for the POA expert cost details page.
 */
export class ExpertCostDetailsViewModel {
  readonly title: string;
  readonly activityDateInput: DateInput;
  readonly actualNetValueInput: Input;
  readonly vatApplicableRadios: Radios<BooleanChoice>;
  readonly feeEarnerNameInput: Input;
  readonly descriptionInput: Input;
  readonly errorSummary?: ErrorSummary;

  /**
   * Creates a profit cost bill line page view model.
   *
   * @param {ExpertCostDetailsViewModelParams} params View model params.
   */
  constructor(params: ExpertCostDetailsViewModelParams) {
    const { form } = params;

    this.title = "pages.poa.expertCostDetails.title";

    this.activityDateInput = buildDateInput(form.fields.activityDate);

    this.actualNetValueInput = buildMonetaryInput(form.fields.actualNetValue);

    this.vatApplicableRadios = buildRadios(
      form.fields.vatApplies,
      {
        key: `${form.fields.vatApplies.messagePrefix}.title`,
      },
      false,
    );

    this.feeEarnerNameInput = buildInput(form.fields.feeEarnerName);

    this.descriptionInput = buildInput(form.fields.description);

    this.errorSummary = form.getErrorSummary();
  }
}
