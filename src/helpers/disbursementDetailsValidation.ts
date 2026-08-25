import { combine, Form } from "#src/helpers/validation.js";
import type { DisbursementDetails } from "#src/types/poa.js";
import {
  BooleanField,
  DateField,
  MoneyField,
  StringField,
} from "#src/helpers/fields.js";
import {
  type DisbursementCostType,
  DisbursementCostTypeMessagePrefix,
} from "#src/types/Claim.js";

export interface DisbursementDetailsRequestBody {
  activityDateDay?: unknown;
  activityDateMonth?: unknown;
  activityDateYear?: unknown;
  actualNetValue?: unknown;
  vatApplies?: unknown;
  feeEarnerName?: unknown;
  description?: unknown;
}

interface DisbursementDetailsFields {
  activityDate: DateField;
  actualNetValue: MoneyField;
  vatApplies: BooleanField;
  feeEarnerName: StringField;
  description: StringField;
}

/**
 * Expert cost details form.
 */
export class DisbursementDetailsForm extends Form<
  DisbursementDetailsFields,
  DisbursementDetailsRequestBody,
  DisbursementDetails
> {
  /**
   * Creates a form.
   * @param {DisbursementCostType} costType cost type
   */
  constructor(costType: DisbursementCostType) {
    const messagePrefix: string = DisbursementCostTypeMessagePrefix[costType];
    super(buildDisbursementDetailsFields(messagePrefix), messagePrefix);
  }

  /**
   * Fills the form.
   * @param {DisbursementDetails} value form value
   */
  fill(value: DisbursementDetails): void {
    this.fields.activityDate.setValue(value.activityDate);
    this.fields.actualNetValue.setValue(value.actualNetValue);
    this.fields.vatApplies.setValue(value.vatApplies);
    this.fields.feeEarnerName.setValue(value.feeEarnerName);
    this.fields.description.setValue(value.description);
  }

  /**
   * Validates the form.
   * @param {DisbursementDetailsRequestBody} value value to validate
   */
  validate(value: DisbursementDetailsRequestBody): void {
    this.fields.activityDate.validate({
      day: value.activityDateDay,
      month: value.activityDateMonth,
      year: value.activityDateYear,
    });

    this.fields.actualNetValue.validate(value.actualNetValue);
    this.fields.vatApplies.validate(value.vatApplies);
    this.fields.feeEarnerName.validate(value.feeEarnerName);
    this.fields.description.validate(value.description);

    this.validation = combine(this.fields);
  }
}

function buildDisbursementDetailsFields(
  messagePrefix: string,
): DisbursementDetailsFields {
  return {
    activityDate: new DateField(
      `${messagePrefix}.activityDate`,
      "activityDate",
      "activity-date",
    ),

    actualNetValue: new MoneyField(
      `${messagePrefix}.actualNetValue`,
      "actualNetValue",
      "actual-net-value",
    ),

    vatApplies: new BooleanField(
      `${messagePrefix}.vatApplies`,
      "vatApplies",
      "vat-applies",
    ),

    feeEarnerName: new StringField(
      `${messagePrefix}.feeEarnerName`,
      "feeEarnerName",
      "fee-earner-name",
      /^[A-Za-z' -]+$/u,
    ),

    description: new StringField(
      `${messagePrefix}.description`,
      "description",
      "description",
      /^[\p{L}\p{N}\p{P}\p{Zs}\n\r]*$/u,
    ),
  };
}
