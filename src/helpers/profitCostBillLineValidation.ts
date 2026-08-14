import {
  combine,
  validateBooleanInput,
  validateDateInput,
  validateMoneyInput,
  validateStringInput,
  type ValidationResult,
} from "#src/helpers/validation.js";
import type { ProfitCostBillLine } from "#src/types/poa.js";
import type { LocalDate } from "#src/types/date.js";
import { PROFIT_COST_BILL_LINE_FIELDS } from "#src/controllers/poa/profitCostBillLineController.js";

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
 * @param {ProfitCostBillLineForm} form The profit cost bill line form.
 * @returns {ValidationResult} Validation result.
 */
export function validateProfitCostBillLine(
  form: ProfitCostBillLineForm,
): ValidationResult<ProfitCostBillLine> {
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
): ValidationResult<LocalDate> {
  return validateDateInput(
    {
      day: form.activityDateDay,
      month: form.activityDateMonth,
      year: form.activityDateYear,
    },
    PROFIT_COST_BILL_LINE_FIELDS.activityDate,
  );
}

function validateActualNetProfitCostExcludingAdvocacy(
  value: unknown,
): ValidationResult<number> {
  return validateMoneyInput(
    value,
    PROFIT_COST_BILL_LINE_FIELDS.actualNetProfitCostExcludingAdvocacy,
  );
}

function validateActualNetAdvocacyCosts(
  value: unknown,
): ValidationResult<number> {
  return validateMoneyInput(
    value,
    PROFIT_COST_BILL_LINE_FIELDS.actualNetAdvocacyCosts,
  );
}

function validateVatApplies(value: unknown): ValidationResult<boolean> {
  return validateBooleanInput(
    value,
    PROFIT_COST_BILL_LINE_FIELDS.vatApplies,
  );
}

function validateFeeEarnerName(value: unknown): ValidationResult<string> {
  return validateStringInput(
    value,
    PROFIT_COST_BILL_LINE_FIELDS.feeEarnerName,
    FEE_EARNER_NAME_REGEX,
  );
}
