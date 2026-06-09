import {
  ClientStatusChoice,
  clientStatusChoices,
  clientStatusFieldName,
  CourtTypeChoice,
  courtTypeChoices,
  courtTypeFieldName,
  FirstSolicitorChoice,
  firstSolicitorChoices,
  firstSolicitorFieldName,
  TransferSolicitorChoice,
  transferSolicitorChoices,
  transferSolicitorFieldName,
} from "./profitCostDetailsFields.js";

export interface ProfitCostDetailsViewModelParams {
  courtTypeSelectedValue?: string;
  clientStatusSelectedValue?: string;
  firstSolicitorSelectedValue?: string;
  transferSolicitorSelectedValue?: string;
  error?: {
    courtTypeError?: {
      text: string;
    };
    clientStatusError?: {
      text: string;
    };
    firstSolicitorError?: {
      text: string;
    };
    transferSolicitorError?: {
      text: string;
    };
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

      courtTypeError: params.error?.courtTypeError,
      clientStatusError: params.error?.clientStatusError,
      firstSolicitorError: params.error?.firstSolicitorError,
      transferSolicitorError: params.error?.transferSolicitorError,
    };
  }
}

/**
 * Checks whether the submitted court type choice is valid.
 *
 * @param {unknown} value The submitted court type choice.
 * @returns {boolean} Whether the submitted choice is valid.
 */
export function isValidCourtTypeChoice(
  value: unknown,
): value is CourtTypeChoice {
  return courtTypeChoices.some((choice) => choice.value === value);
}

export function isValidClientStatusChoice(
  value: unknown,
): value is ClientStatusChoice {
  return clientStatusChoices.some((choice) => choice.value === value);
}

export function isValidFirstSolicitorChoice(
  value: unknown,
): value is FirstSolicitorChoice {
  return firstSolicitorChoices.some((choice) => choice.value === value);
}

export function isValidTransferSolicitorChoice(
  value: unknown,
): value is TransferSolicitorChoice {
  return transferSolicitorChoices.some((choice) => choice.value === value);
}
