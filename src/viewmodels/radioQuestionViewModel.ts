import type { Message } from "#src/viewmodels/components/message.js";
import {
  type Field,
  type FieldValidationError,
  getError,
  getErrorSummary,
} from "#src/helpers/validation.js";
import type { ErrorSummary } from "#src/viewmodels/components/errorSummary.js";
import { type BooleanChoice, booleanChoices } from "#src/models/booleanChoice.js";

export interface RadioQuestionOptions<ChoiceType> {
  value: ChoiceType;
  text: Message;
  hint?: {
    text: Message;
  };
  checked?: boolean;
}

export interface RadioQuestionViewModelParams<ChoiceType> {
  title: string;
  field: Field;
  choices: ReadonlyArray<RadioQuestionOptions<ChoiceType>>;
  selectedValue?: ChoiceType;
  errors?: FieldValidationError[];
}

/**
 * View model for the Radio Questions page.
 */
export class RadioQuestionViewModel<ChoiceType> {
  readonly title: Message;
  readonly choices: ReadonlyArray<RadioQuestionOptions<ChoiceType>>;
  readonly form: RadioQuestionForm<ChoiceType>;
  readonly errorSummary: ErrorSummary;

  /**
   * Creates a radio question page view model.
   *
   * @param {RadioQuestionViewModelParams} params The selected value and error state.
   */
  constructor({
    title,
    field,
    choices,
    selectedValue,
    errors = [],
  }: RadioQuestionViewModelParams<ChoiceType>) {
    this.title = {
      key: title
    };
    this.choices = choices;
    this.form = radioQuestionForm<ChoiceType>(
      field,
      choices,
      errors,
      selectedValue,
    );
    this.errorSummary = getErrorSummary(errors)
  }
}

export interface RadioQuestionForm<ChoiceType> {
  fieldName: string;
  fieldId: string;
  choices: ReadonlyArray<RadioQuestionOptions<ChoiceType>>;
  error?: FieldValidationError;
}

/**
 * Radio question form builder.
 * @param {Field} field field
 * @param {ReadonlyArray<RadioQuestionOptions>} choices radio choices
 * @param {FieldValidationError[]} errors errors
 * @param {unknown} selectedValue selected value
 * @returns {RadioQuestionForm} radio question form object
 */
export function radioQuestionForm<ChoiceType>(
  field: Field,
  choices: ReadonlyArray<RadioQuestionOptions<ChoiceType>>,
  errors: FieldValidationError[],
  selectedValue?: unknown,
): RadioQuestionForm<ChoiceType> {
  return {
    fieldName: field.name,
    fieldId: field.id,
    choices: choices.map((choice) => ({
      ...choice,
      checked: choice.value === selectedValue,
    })),
    error: getError(errors, field),
  };
}

/**
 * Yes/No question form builder.
 * @param {Field} field field
 * @param {FieldValidationError[]} errors errors
 * @param {unknown} selectedValue selected value
 * @returns {RadioQuestionForm} radio question form object
 */
export function yesNoQuestionForm(
  field: Field,
  errors: FieldValidationError[],
  selectedValue?: unknown,
): RadioQuestionForm<BooleanChoice> {
  return radioQuestionForm(
    field,
    booleanChoices,
    errors,
    selectedValue,
  );
}
