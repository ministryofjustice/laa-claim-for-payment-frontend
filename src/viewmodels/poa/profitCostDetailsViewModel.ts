import {
  type BooleanChoice,
  booleanChoices,
} from "#src/models/booleanChoice.js";
import type { ProfitCostDetailsForm } from "#src/helpers/profitCostDetailsValidation.js";
import {
  type FieldValidationError,
  type FieldValidationErrorsBuilder,
  getError,
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
import type { ClientPartyStatus, CourtType } from "#src/types/Claim.js";

export interface ProfitCostDetailsViewModelParams {
  form?: ProfitCostDetailsForm;
  getErrors?: FieldValidationErrorsBuilder;
}

/**
 *
 */
export class ProfitCostDetailsViewModel {
  readonly prefix: string;
  readonly form;
  readonly errorSummary: ErrorSummary;

  /**
   * Creates a choose upload page view model.
   * @param { ProfitCostDetailsViewModelParams } params The selected value and error state
   */
  constructor(params: ProfitCostDetailsViewModelParams = {}) {
    const { form = {}, getErrors = (_: string) => [] } = params;

    this.prefix = "pages.profitCostDetails";

    const courtTypeError = getError(
      getErrors(`${this.prefix}.courtType`),
      courtTypeFieldName,
    );

    const clientStatusError = getError(
      getErrors(`${this.prefix}.clientStatus`),
      clientStatusFieldName,
    );

    const firstSolicitorError = getError(
      getErrors(`${this.prefix}.firstSolicitor`),
      firstSolicitorFieldName,
    );

    const transferOfSolicitorError = getError(
      getErrors(`${this.prefix}.transferOfSolicitor`),
      transferOfSolicitorFieldName,
    );

    const errors = [
      courtTypeError,
      clientStatusError,
      firstSolicitorError,
      transferOfSolicitorError,
    ].filter(
      (error): error is FieldValidationError => error !== undefined,
    );

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
      firstSolicitor: radioQuestionForm<BooleanChoice>(
        firstSolicitorFieldName,
        firstSolicitorFieldName,
        booleanChoices,
        firstSolicitorError,
        form.firstSolicitorChoice,
      ),
      transferOfSolicitor: radioQuestionForm<BooleanChoice>(
        transferOfSolicitorFieldName,
        transferOfSolicitorFieldName,
        booleanChoices,
        transferOfSolicitorError,
        form.transferOfSolicitorChoice,
      ),
    };

    this.errorSummary = getErrorSummary(errors);
  }
}
