import { booleanChoices } from "#src/models/booleanChoice.js";
import {
  type ClientStatusChoice,
  clientStatusChoices,
  clientStatusFieldName,
  type CourtTypeChoice,
  courtTypeChoices,
  courtTypeFieldName,
  firstSolicitorFieldName,
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
      firstSolicitorChoices: booleanChoices.map((choice) => ({
        ...choice,
        checked: choice.value === params.firstSolicitorSelectedValue,
      })),

      transferOfSolicitorFieldName,
      transferOfSolicitorChoices: booleanChoices.map((choice) => ({
        ...choice,
        checked: choice.value === params.transferOfSolicitorSelectedValue,
      })),

      courtTypeError: params.error?.courtTypeError,
      clientStatusError: params.error?.clientStatusError,
      firstSolicitorError: params.error?.firstSolicitorError,
      transferOfSolicitorError: params.error?.transferOfSolicitorError,
    };

    this.errorList = [];
    const { error } = params;

    if (error?.courtTypeError !== undefined) {
      this.errorList.push({
        text: error.courtTypeError.text,
        href: `#${courtTypeFieldName}`,
      });
    }

    if (error?.clientStatusError !== undefined) {
      this.errorList.push({
        text: error.clientStatusError.text,
        href: `#${clientStatusFieldName}`,
      });
    }

    if (error?.firstSolicitorError !== undefined) {
      this.errorList.push({
        text: error.firstSolicitorError.text,
        href: `#${firstSolicitorFieldName}`,
      });
    }

    if (error?.transferOfSolicitorError !== undefined) {
      this.errorList.push({
        text: error.transferOfSolicitorError.text,
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

/**
 * Checks whether the submitted client status choice is valid.
 *
 * @param {unknown} value The submitted client status choice.
 * @returns {boolean} Whether the submitted choice is valid.
 */
export function isValidClientStatusChoice(
  value: unknown,
): value is ClientStatusChoice {
  return clientStatusChoices.some((choice) => choice.value === value);
}