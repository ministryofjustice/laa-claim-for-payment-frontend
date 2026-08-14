import type { ProfitCostBillLineForm } from "#src/helpers/profitCostBillLineValidation.js";
import {
  type FieldValidationError,
  getError,
  getErrorSummary,
  getStringValue,
} from "#src/helpers/validation.js";
import type { ErrorSummary } from "#src/viewmodels/components/errorSummary.js";
import { yesNoQuestionForm } from "#src/viewmodels/radioQuestionViewModel.js";
import type { UUID } from "uuidv7";
import { PROFIT_COST_BILL_LINE_FIELDS } from "#src/controllers/poa/profitCostBillLineController.js";

export interface ProfitCostBillLineViewModelParams {
  claimId: UUID;
  form?: ProfitCostBillLineForm;
  errors?: FieldValidationError[];
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
    errors = [],
  }: ProfitCostBillLineViewModelParams) {
    this.claimId = claimId.toString();
    this.title = "pages.profitCostBillLine.title";

    this.form = {
      activityDate: {
        value: {
          day: getStringValue(form.activityDateDay),
          month: getStringValue(form.activityDateMonth),
          year: getStringValue(form.activityDateYear),
        },
        error: getError(errors, PROFIT_COST_BILL_LINE_FIELDS.activityDate),
      },
      actualNetProfitCostExcludingAdvocacy: {
        value: getStringValue(form.actualNetProfitCostExcludingAdvocacy),
        error: getError(
          errors,
          PROFIT_COST_BILL_LINE_FIELDS.actualNetProfitCostExcludingAdvocacy,
        ),
      },
      actualNetAdvocacyCosts: {
        value: getStringValue(form.actualNetAdvocacyCosts),
        error: getError(
          errors,
          PROFIT_COST_BILL_LINE_FIELDS.actualNetAdvocacyCosts,
        ),
      },
      vatApplies: yesNoQuestionForm(
        PROFIT_COST_BILL_LINE_FIELDS.vatApplies,
        errors,
        form.vatApplies,
      ),
      feeEarnerName: {
        value: getStringValue(form.feeEarnerName),
        error: getError(errors, PROFIT_COST_BILL_LINE_FIELDS.feeEarnerName),
      },
    };

    this.errorSummary = getErrorSummary(errors);
  }
}
