import { combine, Form } from "#src/helpers/validation.js";
import type { ProfitCostBillLine } from "#src/types/poa.js";
import {
  BooleanField,
  DateField,
  MoneyField,
  StringField,
} from "#src/helpers/fields.js";
import config from "#config.js";

export interface ProfitCostBillLineRequestBody {
  activityDateDay?: unknown;
  activityDateMonth?: unknown;
  activityDateYear?: unknown;
  actualNetProfitCostExcludingAdvocacy?: unknown;
  actualNetAdvocacyCosts?: unknown;
  vatApplies?: unknown;
  feeEarnerName?: unknown;
}

export interface ProfitCostBillLineLimits {
  actualNetProfitCostExcludingAdvocacy?: number;
  actualNetAdvocacyCosts?: number;
}

interface ProfitCostBillLineFields {
  activityDate: DateField;
  actualNetProfitCostExcludingAdvocacy: MoneyField;
  actualNetAdvocacyCosts: MoneyField;
  vatApplies: BooleanField;
  feeEarnerName: StringField;
}

/**
 * Profit cost bill line form.
 */
export class ProfitCostBillLineForm extends Form<
  ProfitCostBillLineFields,
  ProfitCostBillLineRequestBody,
  ProfitCostBillLine
> {
  /**
   * Creates a form.
   */
  constructor() {
    const messagePrefix = "pages.profitCostBillLine";
    super(buildProfitCostBillLineFields(messagePrefix), messagePrefix);
  }

  /**
   * Fills the form.
   * @param {ProfitCostBillLine} value form value
   */
  fill(value: ProfitCostBillLine): void {
    this.fields.activityDate.setValue(value.activityDate);
    this.fields.actualNetProfitCostExcludingAdvocacy.setValue(
      value.actualNetProfitCostExcludingAdvocacy,
    );
    this.fields.actualNetAdvocacyCosts.setValue(value.actualNetAdvocacyCosts);
    this.fields.vatApplies.setValue(value.vatApplies);
    this.fields.feeEarnerName.setValue(value.feeEarnerName);
  }

  /**
   * Validates the form.
   * @param {ProfitCostBillLineRequestBody} value value to validate
   * @param {ProfitCostBillLineLimits} [limits] optional overrides for default monetary limits
   */
  validate(
    value: ProfitCostBillLineRequestBody,
    limits: ProfitCostBillLineLimits = {},
  ): void {
    this.fields.activityDate.validate({
      day: value.activityDateDay,
      month: value.activityDateMonth,
      year: value.activityDateYear,
    });

    this.fields.actualNetProfitCostExcludingAdvocacy.validate(
      value.actualNetProfitCostExcludingAdvocacy,
      limits.actualNetProfitCostExcludingAdvocacy,
    );

    this.fields.actualNetAdvocacyCosts.validate(
      value.actualNetAdvocacyCosts,
      limits.actualNetAdvocacyCosts,
    );

    this.fields.vatApplies.validate(value.vatApplies);
    this.fields.feeEarnerName.validate(value.feeEarnerName);

    this.validation = combine(value, this.fields);
  }
}

function buildProfitCostBillLineFields(
  messagePrefix: string,
): ProfitCostBillLineFields {
  return {
    activityDate: new DateField(
      `${messagePrefix}.activityDate`,
      "activityDate",
      "activityDate",
    ),

    actualNetProfitCostExcludingAdvocacy: new MoneyField(
      `${messagePrefix}.actualNetProfitCostExcludingAdvocacy`,
      "actualNetProfitCostExcludingAdvocacy",
      "actualNetProfitCostExcludingAdvocacy",
    ),

    actualNetAdvocacyCosts: new MoneyField(
      `${messagePrefix}.actualNetAdvocacyCosts`,
      "actualNetAdvocacyCosts",
      "actualNetAdvocacyCosts",
    ),

    vatApplies: new BooleanField(
      `${messagePrefix}.vatApplies`,
      "vatApplies",
      "vatApplies",
    ),

    feeEarnerName: new StringField(
      `${messagePrefix}.feeEarnerName`,
      "feeEarnerName",
      "feeEarnerName",
      /^[A-Za-z' -]+$/u,
      config.fields.poa.feeEarnerNameLength,
    ),
  };
}