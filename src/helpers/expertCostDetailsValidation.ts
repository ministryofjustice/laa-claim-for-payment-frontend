import {
  type FieldValidationError,
  validateBooleanInput,
  validateDateInput,
  validateMoneyInput,
  validateStringInput,
  validationResult,
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
): ValidationResult {
  const errors: FieldValidationError[] = [
    ...validateActivityDate(form),
    ...validateMoneyInput(
      form.actualNetValue,
      "actualNetValue",
      "actual-net-value",
      "pages.poa.expertCostDetails.actualNetValue",
    ),
    ...validateVatApplies(form.vatApplies),
    ...validateFeeEarnerName(form.feeEarnerName),
    ...validateDescription(form.description),
  ];

  return validationResult(errors);
}

function validateActivityDate(
  form: ExpertCostDetailsForm,
): FieldValidationError[] {
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

function validateVatApplies(value: unknown): FieldValidationError[] {
  return validateBooleanInput(
    value,
    "vatApplies",
    "vat-applies",
    "pages.poa.expertCostDetails.vatApplies",
  );
}

function validateFeeEarnerName(value: unknown): FieldValidationError[] {
  return validateStringInput(
    value,
    "feeEarnerName",
    "fee-earner-name",
    "pages.poa.expertCostDetails.feeEarnerName",
    FEE_EARNER_NAME_REGEX,
  );
}

function validateDescription(value: unknown): FieldValidationError[] {
  return validateStringInput(
    value,
    "description",
    "description",
    "pages.poa.expertCostDetails.description",
    DESCRIPTION_REGEX,
  );
}
