import type {
  FieldValidationError,
  ProfitCostBillLineForm,
} from "#src/helpers/profitCostBillLineValidation.js";

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
  readonly errorList;

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
      activityDateDay: getStringValue(form.activityDateDay),
      activityDateMonth: getStringValue(form.activityDateMonth),
      activityDateYear: getStringValue(form.activityDateYear),
      actualNetProfitCostExcludingAdvocacy: getStringValue(
        form.actualNetProfitCostExcludingAdvocacy,
      ),
      actualNetAdvocacyCosts: getStringValue(form.actualNetAdvocacyCosts),
      vatApplies: getStringValue(form.vatApplies),
      feeEarnerName: getStringValue(form.feeEarnerName),

      activityDateError: getError(errors, "activityDate"),
      actualNetProfitCostExcludingAdvocacyError: getError(
        errors,
        "actualNetProfitCostExcludingAdvocacy",
      ),
      actualNetAdvocacyCostsError: getError(errors, "actualNetAdvocacyCosts"),
      vatAppliesError: getError(errors, "vatApplies"),
      feeEarnerNameError: getError(errors, "feeEarnerName"),
    };

    this.errorList = errors.map((error) => ({
      text: error.text,
      href: error.href,
    }));
  }
}

function getStringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function getError(
  errors: FieldValidationError[],
  fieldName: string,
): { text: string } | undefined {
  const error = errors.find((item) => item.fieldName === fieldName);

  if (error === undefined) {
    return undefined;
  }

  return {
    text: error.text,
  };
}