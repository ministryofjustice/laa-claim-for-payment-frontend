import type { ProfitCostDetailsForm } from "#src/helpers/profitCostDetailsValidation.js";
import {
  type FieldValidationError,
  getErrorSummary,
} from "#src/helpers/validation.js";
import type { ErrorSummary } from "#src/viewmodels/components/errorSummary.js";
import {
  radioQuestionForm,
  yesNoQuestionForm,
} from "#src/viewmodels/radioQuestionViewModel.js";
import {
  clientStatusChoices,
  courtTypeChoices,
  PROFIT_COST_DETAILS_FIELDS,
} from "#src/controllers/poa/profitCostDetailsController.js";
import type { ClientPartyStatus, CourtType } from "#src/types/Claim.js";

export interface ProfitCostDetailsViewModelParams {
  form?: ProfitCostDetailsForm;
  errors?: FieldValidationError[];
}

/**
 *
 */
export class ProfitCostDetailsViewModel {
  readonly form;
  readonly errorSummary: ErrorSummary;

  /**
   * Creates a choose upload page view model.
   * @param { ProfitCostDetailsViewModelParams } params The selected value and error state
   */
  constructor(params: ProfitCostDetailsViewModelParams = {}) {
    const { form = {}, errors = [] } = params;

    this.form = {
      courtType: radioQuestionForm<CourtType>(
        PROFIT_COST_DETAILS_FIELDS.courtType,
        courtTypeChoices,
        errors,
        form.courtTypeChoice,
      ),
      clientStatus: radioQuestionForm<ClientPartyStatus>(
        PROFIT_COST_DETAILS_FIELDS.clientStatus,
        clientStatusChoices,
        errors,
        form.clientStatusChoice,
      ),
      firstSolicitor: yesNoQuestionForm(
        PROFIT_COST_DETAILS_FIELDS.firstSolicitor,
        errors,
        form.firstSolicitorChoice,
      ),
      transferOfSolicitor: yesNoQuestionForm(
        PROFIT_COST_DETAILS_FIELDS.transferOfSolicitor,
        errors,
        form.transferOfSolicitorChoice,
      ),
    };

    this.errorSummary = getErrorSummary(errors);
  }
}
