import {
  type FieldValidationError,
  validateBooleanInput,
  validateRadioInput,
  validationResult,
  type ValidationResult,
} from "#src/helpers/validation.js";
import {
  clientStatusChoices,
  courtTypeChoices,
} from "#src/viewmodels/profitCostDetails/profitCostDetailsFields.js";

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
): ValidationResult {
  const errors: FieldValidationError[] = [
    ...validateRadioInput(
      courtTypeChoices,
      form.courtTypeChoice,
      "courtTypeChoice",
      "courtTypeChoice",
      "pages.profitCostDetails.courtType",
    ),
    ...validateRadioInput(
      clientStatusChoices,
      form.clientStatusChoice,
      "clientStatusChoice",
      "clientStatusChoice",
      "pages.profitCostDetails.clientStatus",
    ),
    ...validateBooleanInput(
      form.firstSolicitorChoice,
      "firstSolicitorChoice",
      "firstSolicitorChoice",
      "pages.profitCostDetails.firstSolicitor",
    ),
    ...validateBooleanInput(
      form.transferOfSolicitorChoice,
      "transferOfSolicitorChoice",
      "transferOfSolicitorChoice",
      "pages.profitCostDetails.transferOfSolicitor",
    ),
  ];

  return validationResult(errors);
}
