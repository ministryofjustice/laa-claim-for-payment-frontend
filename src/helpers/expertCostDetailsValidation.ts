import { combine, Form } from "#src/helpers/validation.js";
import type { ExpertCostDetails } from "#src/types/poa.js";
import type { ExpertCostLineItem } from "#src/types/Claim.js";
import {
  BooleanField,
  DateField,
  MoneyField,
  StringField,
} from "#src/helpers/fields.js";

export interface ExpertCostDetailsRequestBody {
  activityDateDay?: unknown;
  activityDateMonth?: unknown;
  activityDateYear?: unknown;
  actualNetValue?: unknown;
  vatApplies?: unknown;
  feeEarnerName?: unknown;
  description?: unknown;
}

export interface ExpertCostDetailsFields {
  activityDate: DateField;
  actualNetValue: MoneyField;
  vatApplies: BooleanField;
  feeEarnerName: StringField;
  description: StringField;
}

function buildExpertCostDetailsFields(): ExpertCostDetailsFields {
  const prefix = "pages.poa.expertCostDetails";

  return {
    activityDate: new DateField(
      `${prefix}.activityDate`,
      "activityDate",
      "activity-date",
    ),

    actualNetValue: new MoneyField(
      `${prefix}.actualNetValue`,
      "actualNetValue",
      "actual-net-value",
    ),

    vatApplies: new BooleanField(
      `${prefix}.vatApplies`,
      "vatApplies",
      "vat-applies",
    ),

    feeEarnerName: new StringField(
      `${prefix}.feeEarnerName`,
      "feeEarnerName",
      "fee-earner-name",
      FEE_EARNER_NAME_REGEX,
    ),

    description: new StringField(
      `${prefix}.description`,
      "description",
      "description",
      DESCRIPTION_REGEX,
    ),
  };
}

/**
 *
 * @param value
 */
export function buildExpertCostDetailsForm(
  value?: ExpertCostLineItem,
): ExpertCostDetailsForm {
  const fields = buildExpertCostDetailsFields();

  fields.activityDate.setValue(value?.date);
  fields.actualNetValue.setValue(value?.actualNetValue);
  fields.vatApplies.setValue(value?.vatApplicable);
  fields.feeEarnerName.setValue(value?.feeEarnerName);
  fields.description.setValue(value?.title);

  return new Form(fields);
}

export type ExpertCostDetailsForm = Form<
  ExpertCostDetailsFields,
  ExpertCostDetails
>;

const FEE_EARNER_NAME_REGEX = /^[A-Za-z' -]+$/;
const DESCRIPTION_REGEX = /^[\p{L}\p{N}\p{P}\p{Zs}\n\r]*$/u;

/**
 * Validates the expert cost details form.
 *
 * @param {ExpertCostDetailsRequestBody} requestBody The expert cost details request body.
 * @returns {ExpertCostDetailsForm} Validated form.
 */
export function validateExpertCostDetails(
  requestBody: ExpertCostDetailsRequestBody,
): ExpertCostDetailsForm {
  const fields = buildExpertCostDetailsFields();

  fields.activityDate.validate({
    day: requestBody.activityDateDay,
    month: requestBody.activityDateMonth,
    year: requestBody.activityDateYear,
  });

  fields.actualNetValue.validate(requestBody.actualNetValue);
  fields.vatApplies.validate(requestBody.vatApplies);
  fields.feeEarnerName.validate(requestBody.feeEarnerName);
  fields.description.validate(requestBody.description);

  return new Form(fields, combine(fields));
}
