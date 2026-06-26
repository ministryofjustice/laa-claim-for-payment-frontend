import type { ProfitCostBillLineForm } from "#src/helpers/profitCostBillLineValidation.js";
import {
  type FieldValidationError,
  getError,
  getErrorSummary,
  getStringValue,
} from "#src/helpers/validation.js";
import type { ErrorSummary } from "#src/viewmodels/components/errorSummary.js";

interface ProfitCostBillLineViewModelParams {
  claimId: number;
  form?: ProfitCostBillLineForm;
  errors?: FieldValidationError[];
}

/**
 * View model for the POA CPGFS profit cost bill line page.
 */
export class ProfitCostBillLineViewModel {
  readonly claimId: number;
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
    this.claimId = claimId;
    this.title = "pages.profitCostBillLine.title";

    this.form = {
      activityDate: {
        value: {
          day: getStringValue(form.activityDateDay),
          month: getStringValue(form.activityDateMonth),
          year: getStringValue(form.activityDateYear),
        },
        error: getError(errors, "activityDate"),
      },
      actualNetProfitCostExcludingAdvocacy: {
        value: getStringValue(form.actualNetProfitCostExcludingAdvocacy),
        error: getError(errors, "actualNetProfitCostExcludingAdvocacy"),
      },
      actualNetAdvocacyCosts: {
        value: getStringValue(form.actualNetAdvocacyCosts),
        error: getError(errors, "actualNetAdvocacyCosts"),
      },
      vatApplies: {
        value: getStringValue(form.vatApplies),
        error: getError(errors, "vatApplies"),
      },
      feeEarnerName: {
        value: getStringValue(form.feeEarnerName),
        error: getError(errors, "feeEarnerName"),
      },
    };

    this.errorSummary = getErrorSummary(errors);
  }
}
