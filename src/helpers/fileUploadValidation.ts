import { Form } from "#src/helpers/validation.js";
import type { EvidenceItem } from "#src/types/Claim.js";
import type { UploadField } from "#src/helpers/fields.js";

interface UploadQuestionField {
  field: UploadField;
}

/**
 * Upload form.
 */
export class UploadForm extends Form<
  UploadQuestionField,
  EvidenceItem[],
  EvidenceItem[]
> {
  /**
   * Creates a form.
   * @param {UploadField} field form field
   */
  constructor(field: UploadField) {
    super({ field });
  }

  /**
   * Fills the form.
   * @param {EvidenceItem[]} value form value
   */
  fill(value: EvidenceItem[]): void {
    this.fields.field.setValue(value);
  }

  /**
   * Validates the form.
   * @param {EvidenceItem[]} value value to validate
   */
  validate(value: EvidenceItem[]): void {
    this.fields.field.validate(value);
    this.validation = this.fields.field.getResult();
  }
}