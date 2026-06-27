import { type BooleanChoice, booleanChoices } from "#src/models/booleanChoice.js";
import {
  type ClientStatusChoice,
  clientStatusChoices,
  clientStatusFieldName,
  type CourtTypeChoice,
  courtTypeChoices,
  courtTypeFieldName,
  firstSolicitorFieldName,
  transferOfSolicitorFieldName,
} from "./profitCostDetailsFields.js";
import type { ProfitCostDetailsForm } from "#src/helpers/profitCostDetailsValidation.js";
import {
  type FieldValidationError,
  getError,
  getErrorSummary,
} from "#src/helpers/validation.js";
import type { ErrorSummary } from "#src/viewmodels/components/errorSummary.js";
import { radioQuestionForm } from "#src/viewmodels/radioQuestionViewModel.js";

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
        form.courtTypeChoice,
        getError(errors, courtTypeFieldName),
      ),
      clientStatus: radioQuestionForm<ClientStatusChoice>(
        clientStatusFieldName,
        clientStatusChoices,
        form.clientStatusChoice,
        getError(errors, clientStatusFieldName),
      ),
      firstSolicitor: radioQuestionForm<BooleanChoice>(
        firstSolicitorFieldName,
        booleanChoices,
        form.firstSolicitorChoice,
        getError(errors, firstSolicitorFieldName),
      ),
      transferOfSolicitor: radioQuestionForm<BooleanChoice>(
        transferOfSolicitorFieldName,
        booleanChoices,
        form.transferOfSolicitorChoice,
        getError(errors, transferOfSolicitorFieldName),
      ),
    };

    this.errorSummary = getErrorSummary(errors);
  }
}
