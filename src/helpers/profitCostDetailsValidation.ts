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

export interface ProfitCostDetailsFields {
  courtType: RadioField<CourtType, CourtType>;
  clientStatus: RadioField<ClientPartyStatus, ClientPartyStatus>;
  firstSolicitor: BooleanField;
  transferOfSolicitor: BooleanField;
}

function buildProfitCostDetailsFields(): ProfitCostDetailsFields {
  const prefix = "pages.profitCostDetails";

  return {
    courtType: new RadioField(
      `${prefix}.courtType`,
      "courtTypeChoice",
      "courtTypeChoice",
      [
        {
          value: CourtType.COUNTY_COURT,
          text: {
            key: `${prefix}.courtType.COUNTY_COURT.text`,
          },
        },
        {
          value: CourtType.HIGH_COURT,
          text: {
            key: `${prefix}.courtType.HIGH_COURT.text`,
          },
        },
        {
          value: CourtType.MAGISTRATES_COURT,
          text: {
            key: `${prefix}.courtType.MAGISTRATES_COURT.text`,
          },
        },
        {
          value: CourtType.OTHER_JUDGE,
          text: {
            key: `${prefix}.courtType.OTHER_JUDGE.text`,
          },
        },
      ],
      (value: CourtType) => value,
    ),

    clientStatus: new RadioField(
      `${prefix}.clientStatus`,
      "clientStatusChoice",
      "clientStatusChoice",
      [
        {
          value: ClientPartyStatus.CHILD,
          text: {
            key: `${prefix}.clientStatus.CHILD.text`,
          },
        },
        {
          value: ClientPartyStatus.JOINED_PARTY,
          text: {
            key: `${prefix}.clientStatus.JOINED_PARTY.text`,
          },
        },
        {
          value: ClientPartyStatus.PARENT,
          text: {
            key: `${prefix}.clientStatus.PARENT.text`,
          },
        },
      ],
      (value: ClientPartyStatus) => value,
    ),

    firstSolicitor: new BooleanField(
      `${prefix}.firstSolicitor`,
      "firstSolicitorChoice",
      "firstSolicitorChoice",
    ),

    transferOfSolicitor: new BooleanField(
      `${prefix}.transferOfSolicitor`,
      "transferOfSolicitorChoice",
      "transferOfSolicitorChoice",
    ),
  };
}

/**
 *
 * @param value
 * @param value.courtType
 * @param value.clientStatus
 * @param value.firstSolicitor
 * @param value.transferOfSolicitor
 */
export function buildProfitCostDetailsForm(
  value?: {
    courtType: CourtType | null | undefined,
    clientStatus: ClientPartyStatus | null | undefined,
    firstSolicitor: boolean | null | undefined,
    transferOfSolicitor: boolean | null | undefined,
  },
): ProfitCostDetailsForm {
  const fields = buildProfitCostDetailsFields();

  fields.courtType.setValue(value?.courtType);
  fields.clientStatus.setValue(value?.clientStatus);
  fields.firstSolicitor.setValue(value?.firstSolicitor);
  fields.transferOfSolicitor.setValue(value?.transferOfSolicitor);

  return new Form(fields);
}

export type ProfitCostDetailsForm = Form<
  ProfitCostDetailsFields,
  ProfitCostDetails
>;

/**
 * Validates the profit cost details form.
 *
 * @param {ProfitCostDetailsRequestBody} requestBody The expert cost details form.
 * @returns {ValidationResult} Validation result.
 */
export function validateProfitCostDetails(
  requestBody: ProfitCostDetailsRequestBody,
): ProfitCostDetailsForm {
  const fields = buildProfitCostDetailsFields();

  fields.courtType.validate(requestBody.courtTypeChoice);
  fields.clientStatus.validate(requestBody.clientStatusChoice);
  fields.firstSolicitor.validate(requestBody.firstSolicitorChoice);
  fields.transferOfSolicitor.validate(requestBody.transferOfSolicitorChoice);

  return new Form(fields, combine(fields));
}
