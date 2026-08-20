import { combine, Form } from "#src/helpers/validation.js";
import type { ProfitCostBillLine } from "#src/types/poa.js";
import {
  BooleanField,
  DateField,
  MoneyField,
  StringField,
} from "#src/helpers/fields.js";

export interface ProfitCostBillLineRequestBody {
  activityDateDay?: unknown;
  activityDateMonth?: unknown;
  activityDateYear?: unknown;
  actualNetProfitCostExcludingAdvocacy?: unknown;
  actualNetAdvocacyCosts?: unknown;
  vatApplies?: unknown;
  feeEarnerName?: unknown;
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
    super(buildProfitCostBillLineFields());
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
   */
  validate(value: ProfitCostBillLineRequestBody): void {
    this.fields.activityDate.validate({
      day: value.activityDateDay,
      month: value.activityDateMonth,
      year: value.activityDateYear,
    });

    this.fields.actualNetProfitCostExcludingAdvocacy.validate(
      value.actualNetProfitCostExcludingAdvocacy,
    );
    this.fields.actualNetAdvocacyCosts.validate(value.actualNetAdvocacyCosts);
    this.fields.vatApplies.validate(value.vatApplies);
    this.fields.feeEarnerName.validate(value.feeEarnerName);

    this.validation = combine({
      activityDate: this.fields.activityDate.getResult(),
      actualNetProfitCostExcludingAdvocacy:
        this.fields.actualNetProfitCostExcludingAdvocacy.getResult(),
      actualNetAdvocacyCosts: this.fields.actualNetAdvocacyCosts.getResult(),
      vatApplies: this.fields.vatApplies.getResult(),
      feeEarnerName: this.fields.feeEarnerName.getResult(),
    });
  }
}

function buildProfitCostBillLineFields(): ProfitCostBillLineFields {
  const prefix = "pages.profitCostBillLine";

  return {
    activityDate: new DateField(
      `${prefix}.activityDate`,
      "activityDate",
      "activityDate",
    ),

    actualNetProfitCostExcludingAdvocacy: new MoneyField(
      `${prefix}.actualNetProfitCostExcludingAdvocacy`,
      "actualNetProfitCostExcludingAdvocacy",
      "actualNetProfitCostExcludingAdvocacy",
    ),

    actualNetAdvocacyCosts: new MoneyField(
      `${prefix}.actualNetAdvocacyCosts`,
      "actualNetAdvocacyCosts",
      "actualNetAdvocacyCosts",
    ),

    vatApplies: new BooleanField(
      `${prefix}.vatApplies`,
      "vatApplies",
      "vatApplies",
    ),

    feeEarnerName: new StringField(
      `${prefix}.feeEarnerName`,
      "feeEarnerName",
      "feeEarnerName",
      /^[A-Za-z' -]+$/,
    ),
  };
}
