import { Form } from "#src/helpers/validation.js";
import { EvidenceItem } from "#src/types/Claim.js";
import { UploadField } from "#src/helpers/fields.js";

interface UploadQuestionField {
  field: UploadField;
}

export class UploadForm extends Form<
  UploadQuestionField,
  EvidenceItem[],
  EvidenceItem[],
  EvidenceItem[]
> {
  constructor(field: UploadField) {
    super({ field });
  }

  fill(value: EvidenceItem[]): void {
    this.fields.field.setValue(value);
  }

  validate(value: EvidenceItem[]): void {
    this.fields.field.validate(value);
    this.validation = this.fields.field.getResult();
  }
}