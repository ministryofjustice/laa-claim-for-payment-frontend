import type { Message } from "#src/viewmodels/components/message.js";
import { type FieldValidationError, getError, getErrorSummary } from "#src/helpers/validation.js";
import type { ErrorSummary } from "#src/viewmodels/components/errorSummary.js";

export interface RadioQuestionOptions<ChoiceType> {
  value: ChoiceType;
  text: Message;
  hint?: {
    text: Message;
  };
  checked?: boolean;
}

interface RadioQuestionViewModelParams<ChoiceType> {
  title: Message;
  fieldName: string;
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
    fieldName,
    choices,
    selectedValue,
    errors = [],
  }: RadioQuestionViewModelParams<ChoiceType>) {
    this.title = title;
    this.choices = choices;
    this.form = radioQuestionForm<ChoiceType>(
      fieldName,
      choices,
      errors,
      selectedValue,
    );
    this.errorSummary = getErrorSummary(errors)
  }
}

export interface RadioQuestionForm<ChoiceType> {
  fieldName: string;
  choices: ReadonlyArray<RadioQuestionOptions<ChoiceType>>;
  error?: FieldValidationError;
}

/**
 * Radio question form builder.
 * @param {string} fieldName field name
 * @param {ReadonlyArray<RadioQuestionOptions>} choices radio choices
 * @param {FieldValidationError[]} errors errors
 * @param {unknown} selectedValue selected value
 * @returns {RadioQuestionForm} radio question form object
 */
export function radioQuestionForm<ChoiceType>(
  fieldName: string,
  choices: ReadonlyArray<RadioQuestionOptions<ChoiceType>>,
  errors: FieldValidationError[],
  selectedValue?: unknown,
): RadioQuestionForm<ChoiceType> {
  return {
    fieldName,
    choices: choices.map((choice) => ({
      ...choice,
      checked: choice.value === selectedValue,
    })),
    error: getError(errors, fieldName),
  };
}
