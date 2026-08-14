import {
  combine,
  validateBooleanInput,
  validateRadioInput,
  type ValidationResult,
} from "#src/helpers/validation.js";
import type { ProfitCostDetails } from "#src/types/poa.js";
import {
  clientStatusChoices,
  courtTypeChoices,
  PROFIT_COST_DETAILS_FIELDS,
} from "#src/controllers/poa/profitCostDetailsController.js";

export interface ProfitCostDetailsForm {
  courtTypeChoice?: unknown;
  clientStatusChoice?: unknown;
  firstSolicitorChoice?: unknown;
  transferOfSolicitorChoice?: unknown;
}

/**
 * Validates the profit cost details form.
 *
 * @param {ProfitCostDetailsForm} form The expert cost details form.
 * @returns {ValidationResult} Validation result.
 */
export function validateProfitCostDetails(
  form: ProfitCostDetailsForm,
): ValidationResult<ProfitCostDetails> {
  return combine({
    courtType: validateRadioInput(
      courtTypeChoices,
      form.courtTypeChoice,
      PROFIT_COST_DETAILS_FIELDS.courtType,
    ),
    clientStatus: validateRadioInput(
      clientStatusChoices,
      form.clientStatusChoice,
      PROFIT_COST_DETAILS_FIELDS.clientStatus,
    ),
    firstSolicitor: validateBooleanInput(
      form.firstSolicitorChoice,
      PROFIT_COST_DETAILS_FIELDS.firstSolicitor,
    ),
    transferOfSolicitor: validateBooleanInput(
      form.transferOfSolicitorChoice,
      PROFIT_COST_DETAILS_FIELDS.transferOfSolicitor,
    ),
  });
}
