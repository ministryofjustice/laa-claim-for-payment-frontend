import type { ProfitCostBillLineForm } from "#src/helpers/profitCostBillLineValidation.js";
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

export interface ProfitCostBillLineViewModelParams {
  form: ProfitCostBillLineForm;
}

/**
 * View model for the POA CPGFS profit cost bill line page.
 */
export class ProfitCostBillLineViewModel {
  readonly title: string;
  readonly activityDateInput: DateInput;
  readonly actualNetProfitCostExcludingAdvocacyInput: TextInput;
  readonly actualNetAdvocacyCostsInput: TextInput;
  readonly vatApplicableRadios: Radios<BooleanChoice>;
  readonly feeEarnerNameInput: TextInput;
  readonly errorSummary?: ErrorSummary;

  /**
   * Creates a profit cost bill line page view model.
   *
   * @param {ProfitCostBillLineViewModelParams} params View model params.
   */
  constructor({ form }: ProfitCostBillLineViewModelParams) {
    this.title = `${form.messagePrefix}.title`;

    this.activityDateInput = buildDateInput(form.fields.activityDate);

    this.actualNetProfitCostExcludingAdvocacyInput = buildMonetaryInput(
      form.fields.actualNetProfitCostExcludingAdvocacy,
    );

    this.actualNetAdvocacyCostsInput = buildMonetaryInput(
      form.fields.actualNetAdvocacyCosts,
    );

    this.vatApplicableRadios = buildRadios(
      form.fields.vatApplies,
      {
        key: `${form.fields.vatApplies.messagePrefix}.title`,
      },
      false,
    );

    this.feeEarnerNameInput = buildTextInput(form.fields.feeEarnerName);

    this.errorSummary = form.getErrorSummary();
  }
}
