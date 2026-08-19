import type { Message } from "#src/viewmodels/components/message.js";
import { Form } from "#src/helpers/validation.js";
import type { BooleanChoice } from "#src/models/booleanChoice.js";
import type { BooleanField, RadioField } from "#src/helpers/fields.js";
import { buildRadios, type Radios } from "#src/viewmodels/components/radios.js";
import type { ErrorSummary } from "#src/viewmodels/components/errorSummary.js";

export interface RadioQuestionOptions<ChoiceType> {
  value: ChoiceType;
  text: Message;
  hint?: {
    text: Message;
  };
  checked?: boolean;
}

export interface RadioQuestionViewModelParams<ChoiceType, ValueType> {
  title: string;
  form: RadioQuestionForm<ChoiceType, ValueType>;
  isLegendPageHeading: boolean;
}

/**
 * View model for the Radio Questions page.
 */
export class RadioQuestionViewModel<ChoiceType, ValueType> {
  readonly title: Message;
  readonly radios: Radios<ChoiceType>;
  readonly errorSummary?: ErrorSummary;

  /**
   * Creates a radio question page view model.
   *
   * @param {RadioQuestionViewModelParams} params The selected value and error state.
   */
  constructor({
    title,
    form,
    isLegendPageHeading,
  }: RadioQuestionViewModelParams<ChoiceType, ValueType>) {
    this.title = {
      key: title,
    };
    this.radios = buildRadios(form.fields.field, this.title, isLegendPageHeading);
    this.errorSummary = form.getErrorSummary();
  }
}

export interface RadioQuestionField<ChoiceType, ValueType> {
  field: RadioField<ChoiceType, ValueType>;
}

export type RadioQuestionForm<ChoiceType, ValueType> = Form<
  RadioQuestionField<ChoiceType, ValueType>,
  ValueType
>;

export type YesNoQuestionForm = RadioQuestionForm<BooleanChoice, boolean>;

export type YesNoQuestionViewModel = RadioQuestionViewModel<
  BooleanChoice,
  boolean
>;

/**
 * Radio question form builder.
 * @param {Field} field field
 * @returns {RadioQuestionForm} radio question form object
 */
export function radioQuestionForm<ChoiceType, ValueType>(
  field: RadioField<ChoiceType, ValueType>,
): RadioQuestionForm<ChoiceType, ValueType> {
  return new Form(
    {
      field,
    },
    field.validation,
  );
}

/**
 * Yes/No question form builder.
 * @param {Field} field field
 * @returns {RadioQuestionForm} radio question form object
 */
export function yesNoQuestionForm(
  field: BooleanField,
): RadioQuestionForm<BooleanChoice, boolean> {
  return radioQuestionForm(field);
}
