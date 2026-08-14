import type { ProfitCostDetailsForm } from "#src/helpers/profitCostDetailsValidation.js";
import {
  type FieldValidationError,
  type FieldValidationErrorsBuilder,
  getError,
  getErrorSummary,
} from "#src/helpers/validation.js";
import type { ErrorSummary } from "#src/viewmodels/components/errorSummary.js";
import {
  radioQuestionForm,
  yesNoQuestionForm,
} from "#src/viewmodels/radioQuestionViewModel.js";
import {
  clientStatusChoices,
  clientStatusFieldName,
  courtTypeChoices,
  courtTypeFieldName,
  firstSolicitorFieldName,
  transferOfSolicitorFieldName,
} from "#src/controllers/poa/profitCostDetailsController.js";
import type { ClientPartyStatus, CourtType } from "#src/types/Claim.js";

export interface ProfitCostDetailsViewModelParams {
  form?: ProfitCostDetailsForm;
  getErrors?: FieldValidationErrorsBuilder;
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
    const { form = {}, getErrors = () => [] } = params;

    const prefix = "pages.profitCostDetails";

    const courtTypeError = getError(
      getErrors(`${prefix}.courtType`),
      courtTypeFieldName,
    );

    const clientStatusError = getError(
      getErrors(`${prefix}.clientStatus`),
      clientStatusFieldName,
    );

    const firstSolicitorError = getError(
      getErrors(`${prefix}.firstSolicitor`),
      firstSolicitorFieldName,
    );

    const transferOfSolicitorError = getError(
      getErrors(`${prefix}.transferOfSolicitor`),
      transferOfSolicitorFieldName,
    );

    const errors = [
      courtTypeError,
      clientStatusError,
      firstSolicitorError,
      transferOfSolicitorError,
    ].filter((error): error is FieldValidationError => error !== undefined);

    this.form = {
      courtType: radioQuestionForm<CourtType>(
        courtTypeFieldName,
        courtTypeFieldName,
        courtTypeChoices,
        courtTypeError,
        form.courtTypeChoice,
      ),
      clientStatus: radioQuestionForm<ClientPartyStatus>(
        clientStatusFieldName,
        clientStatusFieldName,
        clientStatusChoices,
        clientStatusError,
        form.clientStatusChoice,
      ),
      firstSolicitor: yesNoQuestionForm(
        firstSolicitorFieldName,
        firstSolicitorFieldName,
        firstSolicitorError,
        form.firstSolicitorChoice,
      ),
      transferOfSolicitor: yesNoQuestionForm(
        transferOfSolicitorFieldName,
        transferOfSolicitorFieldName,
        transferOfSolicitorError,
        form.transferOfSolicitorChoice,
      ),
    };

    this.errorSummary = getErrorSummary(errors);
  }
}
