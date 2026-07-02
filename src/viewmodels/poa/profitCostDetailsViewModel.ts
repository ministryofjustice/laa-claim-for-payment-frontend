import {
  type BooleanChoice,
  booleanChoices,
} from "#src/models/booleanChoice.js";
import type { ProfitCostDetailsForm } from "#src/helpers/profitCostDetailsValidation.js";
import {
  type FieldValidationError,
  getErrorSummary,
} from "#src/helpers/validation.js";
import type { ErrorSummary } from "#src/viewmodels/components/errorSummary.js";
import { radioQuestionForm } from "#src/viewmodels/radioQuestionViewModel.js";
import {
  clientStatusChoices,
  clientStatusFieldName,
  courtTypeChoices,
  courtTypeFieldName,
  firstSolicitorFieldName,
  transferOfSolicitorFieldName,
} from "#src/controllers/poa/profitCostDetailsController.js";
import type { ClientStatusChoice, CourtTypeChoice } from "#src/types/poa.js";

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
      courtType: radioQuestionForm<CourtTypeChoice>(
        courtTypeFieldName,
        courtTypeChoices,
        errors,
        form.courtTypeChoice,
      ),
      clientStatus: radioQuestionForm<ClientStatusChoice>(
        clientStatusFieldName,
        clientStatusChoices,
        errors,
        form.clientStatusChoice,
      ),
      firstSolicitor: radioQuestionForm<BooleanChoice>(
        firstSolicitorFieldName,
        booleanChoices,
        errors,
        form.firstSolicitorChoice,
      ),
      transferOfSolicitor: radioQuestionForm<BooleanChoice>(
        transferOfSolicitorFieldName,
        booleanChoices,
        errors,
        form.transferOfSolicitorChoice,
      ),
    };

    this.errorSummary = getErrorSummary(errors);
  }
}
