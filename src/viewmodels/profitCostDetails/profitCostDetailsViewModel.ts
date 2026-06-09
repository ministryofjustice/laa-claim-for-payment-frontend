import { clientStatusChoices, clientStatusFieldName, CourtTypeChoice, courtTypeChoices, courtTypeFieldName, firstSolicitorChoices, firstSolicitorFieldName, transferSolicitorChoices, transferSolicitorFieldName } from "./profitCostDetailsFields.js";



interface ProfitCostDetailsViewModelParams {
  courtTypeSelectedValue?: string;
  clientStatusSelectedValue?: string;
  firstSolicitorSelectedValue?: string;
  transferSolicitorSelectedValue?: string;
  error?: {
    text: string;
  };
}


/**
 *
 */
export class ProfitCostDetailsViewModel {
  readonly form;

  /**
   * Creates a choose upload page view model.
   * @param { ProfitCostDetailsViewModelParams } params The selected value and error state
   */
  constructor(params: ProfitCostDetailsViewModelParams = {}) {
    this.form = {
      courtTypeFieldName,
      courtTypeChoices: courtTypeChoices.map((choice) => ({
        ...choice,
        checked: choice.value === params.courtTypeSelectedValue,
      })),

      clientStatusFieldName,
      clientStatusChoices: clientStatusChoices.map((choice) => ({
        ...choice,
        checked: choice.value === params.clientStatusSelectedValue,
      })),

      firstSolicitorFieldName,
      firstSolicitorChoices: firstSolicitorChoices.map((choice) => ({
        ...choice,
        checked: choice.value === params.firstSolicitorSelectedValue,
      })),

      transferSolicitorFieldName,
      transferSolicitorChoices: transferSolicitorChoices.map((choice) => ({
        ...choice,
        checked: choice.value === params.transferSolicitorSelectedValue,
      })),

      error: params.error,
    };
  }
}

/**
 * Checks whether the submitted court type choice is valid.
 *
 * @param {unknown} value The submitted court type choice.
 * @returns {boolean} Whether the submitted choice is valid.
 */
export function isValidCourtTypeChoice(value: unknown): value is CourtTypeChoice {
  return courtTypeChoices.some((choice) => choice.value === value);
}