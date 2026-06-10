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
  TransferOfSolicitorChoice,
  transferOfSolicitorChoices,
  transferOfSolicitorFieldName,
} from "./profitCostDetailsFields.js";

export interface ProfitCostDetailsViewModelParams {
  courtTypeSelectedValue?: string;
  clientStatusSelectedValue?: string;
  firstSolicitorSelectedValue?: string;
  transferOfSolicitorSelectedValue?: string;
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
    transferOfSolicitorError?: {
      text: string;
    };
  };
}

/**
 *
 */
export class ProfitCostDetailsViewModel {
  readonly form;
  readonly errorList;

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

      transferOfSolicitorFieldName: transferOfSolicitorFieldName,
      transferOfSolicitorChoices: transferOfSolicitorChoices.map((choice) => ({
        ...choice,
        checked: choice.value === params.transferOfSolicitorSelectedValue,
      })),

      courtTypeError: params.error?.courtTypeError,
      clientStatusError: params.error?.clientStatusError,
      firstSolicitorError: params.error?.firstSolicitorError,
      transferOfSolicitorError: params.error?.transferOfSolicitorError,
    };

    this.errorList = [];

    if (params.error?.courtTypeError) {
      this.errorList.push({
        text: params.error.courtTypeError.text,
        href: `#${courtTypeFieldName}`,
      });
    }

    if (params.error?.clientStatusError) {
      this.errorList.push({
        text: params.error.clientStatusError.text,
        href: `#${clientStatusFieldName}`,
      });
    }

    if (params.error?.firstSolicitorError) {
      this.errorList.push({
        text: params.error.firstSolicitorError.text,
        href: `#${firstSolicitorFieldName}`,
      });
    }

    if (params.error?.transferOfSolicitorError) {
      this.errorList.push({
        text: params.error.transferOfSolicitorError.text,
        href: `#${transferOfSolicitorFieldName}`,
      });
    }
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

export function isValidTransferOfSolicitorChoice(
  value: unknown,
): value is TransferOfSolicitorChoice {
  return transferOfSolicitorChoices.some((choice) => choice.value === value);
}
