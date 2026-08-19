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
      FEE_EARNER_NAME_REGEX,
    ),
  };
}

/**
 *
 * @param value
 */
export function buildProfitCostBillLineForm(
  value?: ProfitCostBillLineItem,
): ProfitCostBillLineForm {
  const fields = buildProfitCostBillLineFields();

  fields.activityDate.setValue(value?.date);
  fields.actualNetProfitCostExcludingAdvocacy.setValue(
    value?.netProfitCostAmount,
  );
  fields.actualNetAdvocacyCosts.setValue(value?.netAdvocacyCostAmount);
  fields.vatApplies.setValue(value?.vatApplicable);
  fields.feeEarnerName.setValue(value?.feeEarnerName);

  return new Form(fields);
}

export type ProfitCostBillLineForm = Form<
  ProfitCostBillLineFields,
  ProfitCostBillLine
>;

const FEE_EARNER_NAME_REGEX = /^[A-Za-z' -]+$/;

/**
 * Validates the profit cost bill line form.
 *
 * @param {ProfitCostBillLineRequestBody} requestBody The profit cost bill line request body.
 * @returns {ProfitCostBillLineForm} Form.
 */
export function validateProfitCostBillLine(
  requestBody: ProfitCostBillLineRequestBody,
): ProfitCostBillLineForm {
  const fields = buildProfitCostBillLineFields();

  fields.activityDate.validate({
    day: requestBody.activityDateDay,
    month: requestBody.activityDateMonth,
    year: requestBody.activityDateYear,
  });

  fields.actualNetProfitCostExcludingAdvocacy.validate(
    requestBody.actualNetProfitCostExcludingAdvocacy,
  );
  fields.actualNetAdvocacyCosts.validate(requestBody.actualNetAdvocacyCosts);
  fields.vatApplies.validate(requestBody.vatApplies);
  fields.feeEarnerName.validate(requestBody.feeEarnerName);

  return new Form(fields, combine(fields));
}
