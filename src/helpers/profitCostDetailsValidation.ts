import { combine, Form } from "#src/helpers/validation.js";
import type { ProfitCostDetails } from "#src/types/poa.js";
import { BooleanField, RadioField } from "#src/helpers/fields.js";
import { ClientPartyStatus, CourtType } from "#src/types/Claim.js";

export interface ProfitCostDetailsRequestBody {
  courtTypeChoice?: unknown;
  clientStatusChoice?: unknown;
  firstSolicitorChoice?: unknown;
  transferOfSolicitorChoice?: unknown;
}

interface ProfitCostDetailsFields {
  courtType: RadioField<CourtType, CourtType>;
  clientStatus: RadioField<ClientPartyStatus, ClientPartyStatus>;
  firstSolicitor: BooleanField;
  transferOfSolicitor: BooleanField;
}

/**
 * Profit cost details form.
 */
export class ProfitCostDetailsForm extends Form<
  ProfitCostDetailsFields,
  ProfitCostDetailsRequestBody,
  ProfitCostDetails
> {
  /**
   * Creates a form.
   */
  constructor() {
    const messagePrefix = "pages.profitCostDetails";
    super(buildProfitCostDetailsFields(messagePrefix), messagePrefix);
  }

  /**
   * Fills the form.
   * @param {Partial<ProfitCostDetails>} value form value
   */
  fill(value: Partial<ProfitCostDetails>): void {
    this.fields.courtType.setValue(value.courtType);
    this.fields.clientStatus.setValue(value.clientStatus);
    this.fields.firstSolicitor.setValue(value.firstSolicitor);
    this.fields.transferOfSolicitor.setValue(value.transferOfSolicitor);
  }

  /**
   * Validates the form.
   * @param {ProfitCostDetailsRequestBody} value value to validate
   */
  validate(value: ProfitCostDetailsRequestBody): void {
    this.fields.courtType.validate(value.courtTypeChoice);
    this.fields.clientStatus.validate(value.clientStatusChoice);
    this.fields.firstSolicitor.validate(value.firstSolicitorChoice);
    this.fields.transferOfSolicitor.validate(value.transferOfSolicitorChoice);

    this.validation = combine(this.fields);
  }
}

function buildProfitCostDetailsFields(
  messagePrefix: string,
): ProfitCostDetailsFields {
  return {
    courtType: new RadioField(
      `${messagePrefix}.courtType`,
      "courtTypeChoice",
      "courtTypeChoice",
      [
        {
          value: CourtType.COUNTY_COURT,
          text: {
            key: `${messagePrefix}.courtType.COUNTY_COURT.text`,
          },
        },
        {
          value: CourtType.HIGH_COURT,
          text: {
            key: `${messagePrefix}.courtType.HIGH_COURT.text`,
          },
        },
        {
          value: CourtType.MAGISTRATES_COURT,
          text: {
            key: `${messagePrefix}.courtType.MAGISTRATES_COURT.text`,
          },
        },
        {
          value: CourtType.OTHER_JUDGE,
          text: {
            key: `${messagePrefix}.courtType.OTHER_JUDGE.text`,
          },
        },
      ],
      (value: CourtType) => value,
    ),

    clientStatus: new RadioField(
      `${messagePrefix}.clientStatus`,
      "clientStatusChoice",
      "clientStatusChoice",
      [
        {
          value: ClientPartyStatus.CHILD,
          text: {
            key: `${messagePrefix}.clientStatus.CHILD.text`,
          },
        },
        {
          value: ClientPartyStatus.JOINED_PARTY,
          text: {
            key: `${messagePrefix}.clientStatus.JOINED_PARTY.text`,
          },
        },
        {
          value: ClientPartyStatus.PARENT,
          text: {
            key: `${messagePrefix}.clientStatus.PARENT.text`,
          },
        },
      ],
      (value: ClientPartyStatus) => value,
    ),

    firstSolicitor: new BooleanField(
      `${messagePrefix}.firstSolicitor`,
      "firstSolicitorChoice",
      "firstSolicitorChoice",
    ),

    transferOfSolicitor: new BooleanField(
      `${messagePrefix}.transferOfSolicitor`,
      "transferOfSolicitorChoice",
      "transferOfSolicitorChoice",
    ),
  };
}
