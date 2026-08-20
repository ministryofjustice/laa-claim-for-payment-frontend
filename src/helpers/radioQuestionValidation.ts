import type { RadioField } from "#src/helpers/fields.js";
import { Form } from "#src/helpers/validation.js";
import type { BooleanChoice } from "#src/models/booleanChoice.js";

interface RadioQuestionField<ChoiceType, ValueType> {
  field: RadioField<ChoiceType, ValueType>;
}

/**
 * Radio question form.
 */
export class RadioQuestionForm<ChoiceType, ValueType> extends Form<
  RadioQuestionField<ChoiceType, ValueType>,
  unknown,
  ValueType
> {
  /**
   * Creates a form.
   * @param {RadioField} field form field
   */
  constructor(field: RadioField<ChoiceType, ValueType>) {
    super({ field });
  }

  /**
   * Fills the form.
   * @param {ValueType} value form value
   */
  fill(value: ValueType): void {
    this.fields.field.setValue(value);
  }

  /**
   * Validates the form.
   * @param {unknown} value value to validate
   */
  validate(value: unknown): void {
    this.fields.field.validate(value);
    this.validation = this.fields.field.getResult();
  }
}

/**
 * Yes/No question form.
 */
export class YesNoQuestionForm extends RadioQuestionForm<
  BooleanChoice,
  boolean
> {}