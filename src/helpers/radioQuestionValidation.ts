import type { RadioField } from "#src/helpers/fields.js";
import { Form } from "#src/helpers/validation.js";
import type { BooleanChoice } from "#src/models/booleanChoice.js";

interface RadioQuestionField<ChoiceType, ValueType> {
  field: RadioField<ChoiceType, ValueType>;
}

export class RadioQuestionForm<ChoiceType, ValueType> extends Form<
  RadioQuestionField<ChoiceType, ValueType>,
  ValueType,
  unknown,
  ValueType
> {
  constructor(field: RadioField<ChoiceType, ValueType>) {
    super({ field });
  }

  fill(value: ValueType): void {
    this.fields.field.setValue(value);
  }

  validate(value: unknown): void {
    this.fields.field.validate(value);
    this.validation = this.fields.field.getResult();
  }
}

export class YesNoQuestionForm extends RadioQuestionForm<
  BooleanChoice,
  boolean
> {}