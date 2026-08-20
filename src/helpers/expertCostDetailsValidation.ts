import { combine, Form } from "#src/helpers/validation.js";
import type { ExpertCostDetails } from "#src/types/poa.js";
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

interface ExpertCostDetailsFields {
  activityDate: DateField;
  actualNetValue: MoneyField;
  vatApplies: BooleanField;
  feeEarnerName: StringField;
  description: StringField;
}

/**
 * Expert cost details form.
 */
export class ExpertCostDetailsForm extends Form<
  ExpertCostDetailsFields,
  ExpertCostDetailsRequestBody,
  ExpertCostDetails
> {
  /**
   * Creates a form.
   */
  constructor() {
    super(buildExpertCostDetailsFields());
  }

  /**
   * Fills the form.
   * @param {ExpertCostDetails} value form value
   */
  fill(value: ExpertCostDetails): void {
    this.fields.activityDate.setValue(value.activityDate);
    this.fields.actualNetValue.setValue(value.actualNetValue);
    this.fields.vatApplies.setValue(value.vatApplies);
    this.fields.feeEarnerName.setValue(value.feeEarnerName);
    this.fields.description.setValue(value.description);
  }

  /**
   * Validates the form.
   * @param {ExpertCostDetailsRequestBody} value value to validate
   */
  validate(value: ExpertCostDetailsRequestBody): void {
    this.fields.activityDate.validate({
      day: value.activityDateDay,
      month: value.activityDateMonth,
      year: value.activityDateYear,
    });

    this.fields.actualNetValue.validate(value.actualNetValue);
    this.fields.vatApplies.validate(value.vatApplies);
    this.fields.feeEarnerName.validate(value.feeEarnerName);
    this.fields.description.validate(value.description);

    this.validation = combine({
      activityDate: this.fields.activityDate.getResult(),
      actualNetValue: this.fields.actualNetValue.getResult(),
      vatApplies: this.fields.vatApplies.getResult(),
      feeEarnerName: this.fields.feeEarnerName.getResult(),
      description: this.fields.description.getResult(),
    });
  }
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
      /^[A-Za-z' -]+$/,
    ),

    description: new StringField(
      `${prefix}.description`,
      "description",
      "description",
      /^[\p{L}\p{N}\p{P}\p{Zs}\n\r]*$/u,
    ),
  };
}
