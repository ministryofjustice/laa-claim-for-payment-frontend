import {
  type FieldValidationError,
  getForm,
  validateBooleanInput,
  validateDateInput,
  validateMoneyInput,
  validateStringInput, validationResult,
  type ValidationResult,
} from "#src/helpers/validation.js";

export interface ProfitCostBillLineForm {
  activityDateDay?: unknown;
  activityDateMonth?: unknown;
  activityDateYear?: unknown;
  actualNetProfitCostExcludingAdvocacy?: unknown;
  actualNetAdvocacyCosts?: unknown;
  vatApplies?: unknown;
  feeEarnerName?: unknown;
}

const FEE_EARNER_NAME_REGEX = /^[A-Za-z' -]+$/;

/**
 * Validates the profit cost bill line form.
 *
 * @param {unknown} body Express request body.
 * @returns {ValidationResult} Validation result.
 */
export function validateProfitCostBillLine(
  body: unknown,
): ValidationResult {
  const form = getForm(body) as ProfitCostBillLineForm;

  const errors: FieldValidationError[] = [
    ...validateActivityDate(form),
    ...validateMoneyInput(
      form.actualNetProfitCostExcludingAdvocacy,
      "actualNetProfitCostExcludingAdvocacy",
      "actualNetProfitCostExcludingAdvocacy",
      "pages.profitCostBillLine.actualNetProfitCostExcludingAdvocacy",
    ),
    ...validateMoneyInput(
      form.actualNetAdvocacyCosts,
      "actualNetAdvocacyCosts",
      "actualNetAdvocacyCosts",
      "pages.profitCostBillLine.actualNetAdvocacyCosts",
    ),
    ...validateVatApplies(form.vatApplies),
    ...validateFeeEarnerName(form.feeEarnerName),
  ];

  return validationResult(errors);
}

function validateActivityDate(
  form: ProfitCostBillLineForm,
): FieldValidationError[] {
  return validateDateInput(
    {
      day: form.activityDateDay,
      month: form.activityDateMonth,
      year: form.activityDateYear,
    },
    "activityDate",
    "activityDate",
    "pages.profitCostBillLine.activityDate",
  );
}

function validateVatApplies(value: unknown): FieldValidationError[] {
  return validateBooleanInput(
    value,
    "vatApplies",
    "vatApplies",
    "pages.profitCostBillLine.vatApplies",
  );
}

function validateFeeEarnerName(value: unknown): FieldValidationError[] {
  return validateStringInput(
    value,
    "feeEarnerName",
    "feeEarnerName",
    "pages.profitCostBillLine.feeEarnerName",
    FEE_EARNER_NAME_REGEX,
  );
}
