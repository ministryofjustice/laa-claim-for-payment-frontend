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

export interface RadioQuestionViewModelParams<ChoiceType> {
  title: Message;
  fieldName: string;
  fieldId: string;
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
    fieldId,
    choices,
    selectedValue,
    errors = [],
  }: RadioQuestionViewModelParams<ChoiceType>) {
    this.title = title;
    this.choices = choices;
    this.form = radioQuestionForm<ChoiceType>(
      fieldName,
      fieldId,
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
 * @param {string} fieldName field name
 * @param {string} fieldId field ID
 * @param {ReadonlyArray<RadioQuestionOptions>} choices radio choices
 * @param {FieldValidationError[]} errors errors
 * @param {unknown} selectedValue selected value
 * @returns {RadioQuestionForm} radio question form object
 */
// eslint-disable-next-line @typescript-eslint/max-params -- ignore
export function radioQuestionForm<ChoiceType>(
  fieldName: string,
  fieldId: string,
  choices: ReadonlyArray<RadioQuestionOptions<ChoiceType>>,
  errors: FieldValidationError[],
  selectedValue?: unknown,
): RadioQuestionForm<ChoiceType> {
  return {
    fieldName,
    fieldId,
    choices: choices.map((choice) => ({
      ...choice,
      checked: choice.value === selectedValue,
    })),
    error: getError(errors, fieldName),
  };
}
