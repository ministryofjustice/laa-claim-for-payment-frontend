import {
  combine,
  validateBooleanInput,
  validateDateInput,
  validateMoneyInput,
  validateStringInput,
  type ValidationResult,
} from "#src/helpers/validation.js";
import type { ExpertCostDetails } from "#src/types/poa.js";
import type { LocalDate } from "#src/types/date.js";

export interface ExpertCostDetailsForm {
  activityDateDay?: unknown;
  activityDateMonth?: unknown;
  activityDateYear?: unknown;
  actualNetValue?: unknown;
  vatApplies?: unknown;
  feeEarnerName?: unknown;
  description?: unknown;
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
): ValidationResult<LocalDate> {
  return validateDateInput(
    {
      day: form.activityDateDay,
      month: form.activityDateMonth,
      year: form.activityDateYear,
    },
    "activityDate",
    "activity-date",
  );
}

function validateActualNetValue(value: unknown): ValidationResult<number> {
  return validateMoneyInput(
    value,
    "actualNetValue",
    "actual-net-value",
  );
}

function validateVatApplies(value: unknown): ValidationResult<boolean> {
  return validateBooleanInput(
    value,
    "vatApplies",
    "vat-applies",
  );
}

function validateFeeEarnerName(value: unknown): ValidationResult<string> {
  return validateStringInput(
    value,
    "feeEarnerName",
    "fee-earner-name",
    FEE_EARNER_NAME_REGEX,
  );
}

function validateDescription(value: unknown): ValidationResult<string> {
  return validateStringInput(
    value,
    "description",
    "description",
    DESCRIPTION_REGEX,
  );
}
