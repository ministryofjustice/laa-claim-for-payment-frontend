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

interface ProfitCostDetailsGet {
  courtType: CourtType | null | undefined;
  clientStatus: ClientPartyStatus | null | undefined;
  firstSolicitor: boolean | null | undefined;
  transferOfSolicitor: boolean | null | undefined;
}

export class ProfitCostDetailsForm extends Form<
  ProfitCostDetailsFields,
  ProfitCostDetailsGet,
  ProfitCostDetailsRequestBody,
  ProfitCostDetails
> {
  constructor() {
    super(buildProfitCostDetailsFields());
  }

  fill(value: ProfitCostDetailsGet): void {
    this.fields.courtType.setValue(value.courtType);
    this.fields.clientStatus.setValue(value.clientStatus);
    this.fields.firstSolicitor.setValue(value.firstSolicitor);
    this.fields.transferOfSolicitor.setValue(value.transferOfSolicitor);
  }

  validate(value: ProfitCostDetailsRequestBody): void {
    this.fields.courtType.validate(value.courtTypeChoice);
    this.fields.clientStatus.validate(value.clientStatusChoice);
    this.fields.firstSolicitor.validate(value.firstSolicitorChoice);
    this.fields.transferOfSolicitor.validate(value.transferOfSolicitorChoice);

    this.validation = combine({
      courtType: this.fields.courtType.getResult(),
      clientStatus: this.fields.clientStatus.getResult(),
      firstSolicitor: this.fields.firstSolicitor.getResult(),
      transferOfSolicitor: this.fields.transferOfSolicitor.getResult(),
    });
  }
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
