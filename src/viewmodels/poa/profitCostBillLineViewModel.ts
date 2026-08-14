import type { ProfitCostBillLineForm } from "#src/helpers/profitCostBillLineValidation.js";
import {
  type FieldValidationError,
  type FieldValidationErrorsBuilder,
  getError,
  getErrorSummary,
  getStringValue,
} from "#src/helpers/validation.js";
import type { ErrorSummary } from "#src/viewmodels/components/errorSummary.js";
import { yesNoQuestionForm } from "#src/viewmodels/radioQuestionViewModel.js";
import type { UUID } from "uuidv7";

export interface ProfitCostBillLineViewModelParams {
  claimId: UUID;
  form?: ProfitCostBillLineForm;
  getErrors?: FieldValidationErrorsBuilder;
}

/**
 * View model for the POA CPGFS profit cost bill line page.
 */
export class ProfitCostBillLineViewModel {
  readonly claimId: string;
  readonly title: string;
  readonly form;
  readonly errorSummary: ErrorSummary;

  /**
   * Creates a profit cost bill line page view model.
   *
   * @param {ProfitCostBillLineViewModelParams} params View model params.
   */
  constructor({
    claimId,
    form = {},
    getErrors = () => [],
  }: ProfitCostBillLineViewModelParams) {
    this.claimId = claimId.toString();
    const prefix = "pages.profitCostBillLine";
    this.title = `${prefix}.title`;

    const activityDateError = getError(
      getErrors(`${prefix}.activityDate`),
      "activityDate",
    );
    const actualNetProfitCostExcludingAdvocacyError = getError(
      getErrors(`${prefix}.actualNetProfitCostExcludingAdvocacy`),
      "actualNetProfitCostExcludingAdvocacy",
    );
    const actualNetAdvocacyCostsError = getError(
      getErrors(`${prefix}.actualNetAdvocacyCosts`),
      "actualNetAdvocacyCosts",
    );
    const vatAppliesError = getError(
      getErrors(`${prefix}.vatApplies`),
      "vatApplies",
    );
    const feeEarnerNameError = getError(
      getErrors(`${prefix}.feeEarnerName`),
      "feeEarnerName",
    );

    const errors = [
      activityDateError,
      actualNetProfitCostExcludingAdvocacyError,
      actualNetAdvocacyCostsError,
      vatAppliesError,
      feeEarnerNameError,
    ].filter((error): error is FieldValidationError => error !== undefined);

    this.form = {
      activityDate: {
        value: {
          day: getStringValue(form.activityDateDay),
          month: getStringValue(form.activityDateMonth),
          year: getStringValue(form.activityDateYear),
        },
        error: activityDateError,
      },
      actualNetProfitCostExcludingAdvocacy: {
        value: getStringValue(form.actualNetProfitCostExcludingAdvocacy),
        error: actualNetProfitCostExcludingAdvocacyError,
      },
      actualNetAdvocacyCosts: {
        value: getStringValue(form.actualNetAdvocacyCosts),
        error: actualNetAdvocacyCostsError,
      },
      vatApplies: yesNoQuestionForm(
        "vatApplies",
        "vatApplies",
        vatAppliesError,
        form.vatApplies,
      ),
      feeEarnerName: {
        value: getStringValue(form.feeEarnerName),
        error: feeEarnerNameError,
      },
    };

    this.errorSummary = getErrorSummary(errors);
  }
}
