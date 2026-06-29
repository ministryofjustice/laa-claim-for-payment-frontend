import {
  combine,
  validateBooleanInput,
  validateDateInput,
  validateMoneyInput,
  validateStringInput,
  type ValidationResult,
} from "#src/helpers/validation.js";

export interface ExpertCostDetailsForm {
  activityDateDay?: unknown;
  activityDateMonth?: unknown;
  activityDateYear?: unknown;
  actualNetValue?: unknown;
  vatApplies?: unknown;
  feeEarnerName?: unknown;
  description?: unknown;
}

export interface ExpertCostDetails {
  activityDate: Date;
  actualNetValue: number;
  vatApplies: boolean;
  feeEarnerName: string;
  description: string;
}

const FEE_EARNER_NAME_REGEX = /^[A-Za-z' -]+$/;
const DESCRIPTION_REGEX = /^[\p{L}\p{N}\p{P}\p{Zs}\n\r]*$/u;

/**
 * Validates the expert cost details form.
 *
 * @param {ExpertCostDetailsForm} form The expert cost details form.
 * @returns {ValidationResult} Validation result.
 */
export function validateExpertCostDetails(
  form: ExpertCostDetailsForm,
): ValidationResult<ExpertCostDetails> {
  return combine({
    activityDate: validateActivityDate(form),
    actualNetValue: validateActualNetValue(form.actualNetValue),
    vatApplies: validateVatApplies(form.vatApplies),
    feeEarnerName: validateFeeEarnerName(form.feeEarnerName),
    description: validateDescription(form.description),
  });
}

function validateActivityDate(
  form: ExpertCostDetailsForm,
): ValidationResult<Date> {
  return validateDateInput(
    {
      day: form.activityDateDay,
      month: form.activityDateMonth,
      year: form.activityDateYear,
    },
    "activityDate",
    "activity-date",
    "pages.poa.expertCostDetails.activityDate",
  );
}

function validateActualNetValue(value: unknown): ValidationResult<number> {
  return validateMoneyInput(
    value,
    "actualNetValue",
    "actual-net-value",
    "pages.poa.expertCostDetails.actualNetValue",
  );
}

function validateVatApplies(value: unknown): ValidationResult<boolean> {
  return validateBooleanInput(
    value,
    "vatApplies",
    "vat-applies",
    "pages.poa.expertCostDetails.vatApplies",
  );
}

function validateFeeEarnerName(value: unknown): ValidationResult<string> {
  return validateStringInput(
    value,
    "feeEarnerName",
    "fee-earner-name",
    "pages.poa.expertCostDetails.feeEarnerName",
    FEE_EARNER_NAME_REGEX,
  );
}

function validateDescription(value: unknown): ValidationResult<string> {
  return validateStringInput(
    value,
    "description",
    "description",
    "pages.poa.expertCostDetails.description",
    DESCRIPTION_REGEX,
  );
}
