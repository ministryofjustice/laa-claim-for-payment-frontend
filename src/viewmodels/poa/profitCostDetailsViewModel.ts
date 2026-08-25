import type { ProfitCostDetailsForm } from "#src/helpers/profitCostDetailsValidation.js";
import type { ErrorSummary } from "#src/viewmodels/components/errorSummary.js";
import { buildRadios, type Radios } from "#src/viewmodels/components/radios.js";
import type { ClientPartyStatus, CourtType } from "#src/types/Claim.js";
import type { BooleanChoice } from "#src/models/booleanChoice.js";

export interface ProfitCostDetailsViewModelParams {
  form: ProfitCostDetailsForm;
}

/**
 *
 */
export class ProfitCostDetailsViewModel {
  readonly courtTypeRadios: Radios<CourtType>;
  readonly clientStatusRadios: Radios<ClientPartyStatus>;
  readonly firstSolicitorRadios: Radios<BooleanChoice>;
  readonly transferOfSolicitorRadios: Radios<BooleanChoice>;
  readonly errorSummary?: ErrorSummary;

  /**
   * Creates a choose upload page view model.
   * @param { ProfitCostDetailsViewModelParams } params The selected value and error state
   */
  constructor(params: ProfitCostDetailsViewModelParams) {
    const { form } = params;

    this.courtTypeRadios = buildRadios(
      form.fields.courtType,
      {
        key: `${form.fields.courtType.messagePrefix}.title`,
      },
      false,
    );

    this.clientStatusRadios = buildRadios(
      form.fields.clientStatus,
      {
        key: `${form.fields.clientStatus.messagePrefix}.title`,
      },
      false,
    );

    this.firstSolicitorRadios = buildRadios(
      form.fields.firstSolicitor,
      {
        key: `${form.fields.firstSolicitor.messagePrefix}.title`,
      },
      false,
    );

    this.transferOfSolicitorRadios = buildRadios(
      form.fields.transferOfSolicitor,
      {
        key: `${form.fields.transferOfSolicitor.messagePrefix}.title`,
      },
      false,
    );

    this.errorSummary = form.getErrorSummary();
  }
}
