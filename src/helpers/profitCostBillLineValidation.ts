import { combine, Form } from "#src/helpers/validation.js";
import type { ProfitCostBillLine } from "#src/types/poa.js";
import {
  BooleanField,
  DateField,
  MoneyField,
  StringField,
} from "#src/helpers/fields.js";
import type { ProfitCostBillLineItem } from "#src/types/Claim.js";

export interface ProfitCostBillLineRequestBody {
  activityDateDay?: unknown;
  activityDateMonth?: unknown;
  activityDateYear?: unknown;
  actualNetProfitCostExcludingAdvocacy?: unknown;
  actualNetAdvocacyCosts?: unknown;
  vatApplies?: unknown;
  feeEarnerName?: unknown;
}

export interface ProfitCostBillLineFields {
  activityDate: DateField;
  actualNetProfitCostExcludingAdvocacy: MoneyField;
  actualNetAdvocacyCosts: MoneyField;
  vatApplies: BooleanField;
  feeEarnerName: StringField;
}

export class ProfitCostBillLineForm extends Form<
  ProfitCostBillLineFields,
  ProfitCostBillLineItem,
  ProfitCostBillLineRequestBody,
  ProfitCostBillLine
> {
  constructor() {
    super(buildProfitCostBillLineFields());
  }

  fill(value: ProfitCostBillLineItem): void {
    this.fields.activityDate.setValue(value.date);
    this.fields.actualNetProfitCostExcludingAdvocacy.setValue(
      value.netProfitCostAmount,
    );
    this.fields.actualNetAdvocacyCosts.setValue(value.netAdvocacyCostAmount);
    this.fields.vatApplies.setValue(value.vatApplicable);
    this.fields.feeEarnerName.setValue(value.feeEarnerName);
  }

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
