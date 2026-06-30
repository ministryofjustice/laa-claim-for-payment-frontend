import {
  combine,
  getForm,
  validateBooleanInput,
  validateDateInput,
  validateMoneyInput,
  validateStringInput,
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

export interface ProfitCostBillLine {
  activityDate: Date;
  actualNetProfitCostExcludingAdvocacy: number;
  actualNetAdvocacyCosts: number;
  vatApplies: boolean;
  feeEarnerName: string;
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
): ValidationResult<ProfitCostBillLine> {
  const form = getForm<ProfitCostBillLineForm>(body);
  return combine({
    activityDate: validateActivityDate(form),
    actualNetProfitCostExcludingAdvocacy:
      validateActualNetProfitCostExcludingAdvocacy(
        form.actualNetProfitCostExcludingAdvocacy,
      ),
    actualNetAdvocacyCosts: validateActualNetAdvocacyCosts(
      form.actualNetAdvocacyCosts,
    ),
    vatApplies: validateVatApplies(form.vatApplies),
    feeEarnerName: validateFeeEarnerName(form.feeEarnerName),
  });
}

function validateActivityDate(
  form: ProfitCostBillLineForm,
): ValidationResult<Date> {
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

function validateActualNetProfitCostExcludingAdvocacy(
  value: unknown,
): ValidationResult<number> {
  return validateMoneyInput(
    value,
    "actualNetProfitCostExcludingAdvocacy",
    "actualNetProfitCostExcludingAdvocacy",
    "pages.profitCostBillLine.actualNetProfitCostExcludingAdvocacy",
  );
}

function validateActualNetAdvocacyCosts(
  value: unknown,
): ValidationResult<number> {
  return validateMoneyInput(
    value,
    "actualNetAdvocacyCosts",
    "actualNetAdvocacyCosts",
    "pages.profitCostBillLine.actualNetAdvocacyCosts",
  );
}

function validateVatApplies(value: unknown): ValidationResult<boolean> {
  return validateBooleanInput(
    value,
    "vatApplies",
    "vatApplies",
    "pages.profitCostBillLine.vatApplies",
  );
}

function validateFeeEarnerName(value: unknown): ValidationResult<string> {
  return validateStringInput(
    value,
    "feeEarnerName",
    "feeEarnerName",
    "pages.profitCostBillLine.feeEarnerName",
    FEE_EARNER_NAME_REGEX,
  );
}
