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
      "courtTypeChoice",
      "courtTypeChoice",
    ),
    clientStatus: validateRadioInput(
      clientStatusChoices,
      form.clientStatusChoice,
      "clientStatusChoice",
      "clientStatusChoice",
    ),
    firstSolicitor: validateBooleanInput(
      form.firstSolicitorChoice,
      "firstSolicitorChoice",
      "firstSolicitorChoice",
    ),
    transferOfSolicitor: validateBooleanInput(
      form.transferOfSolicitorChoice,
      "transferOfSolicitorChoice",
      "transferOfSolicitorChoice",
    ),
  });
}
