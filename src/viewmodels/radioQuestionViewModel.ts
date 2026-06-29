import type { Message } from "#src/viewmodels/components/message.js";

export interface RadioQuestionOptions<ChoiceType> {
  value: ChoiceType;
  text: Message;
  hint?: {
    text: Message;
  };
  checked?: boolean;
}

interface RadioQuestionViewModelParams<ChoiceType> {
  title: string;
  fieldName: string;
  choices: ReadonlyArray<RadioQuestionOptions<ChoiceType>>;
  selectedValue?: ChoiceType;
  error?: {
    text: Message;
  };
}

/**
 * View model for the Radio Questions page.
 */
export class RadioQuestionViewModel<ChoiceType> {
  readonly title;
  readonly choices;
  readonly form: RadioQuestionForm<ChoiceType>;

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
    error,
  }: RadioQuestionViewModelParams<ChoiceType>) {
    this.title = title;
    this.choices = choices;
    this.form = radioQuestionForm<ChoiceType>(
      fieldName,
      choices,
      selectedValue,
      error,
    );
  }
}

export interface RadioQuestionForm<ChoiceType> {
  fieldName: string;
  choices: ReadonlyArray<RadioQuestionOptions<ChoiceType>>;
  error?: {
    text: Message;
  };
}

/**
 * Radio question form builder.
 * @param {string} fieldName field name
 * @param {ReadonlyArray<RadioQuestionOptions>} choices radio choices
 * @param {unknown} selectedValue selected value
 * @param {object} error error
 * @param {TextOrMessage} error.text error text message
 * @returns {RadioQuestionForm} radio question form object
 */
export function radioQuestionForm<ChoiceType>(
  fieldName: string,
  choices: ReadonlyArray<RadioQuestionOptions<ChoiceType>>,
  selectedValue?: unknown,
  error?: { text: Message },
): RadioQuestionForm<ChoiceType> {
  return {
    fieldName,
    choices: choices.map((choice) => ({
      ...choice,
      checked: choice.value === selectedValue,
    })),
    error,
  };
}

/**
 * Checks whether the choice is valid.
 *
 * @param {ReadonlyArray<RadioQuestionOptions>} choices The available choices.
 * @param {unknown} value The submitted choice.
 * @returns {boolean} Whether the submitted choice is valid.
 */
export function isValidChoice<ChoiceType>(
  choices: ReadonlyArray<RadioQuestionOptions<ChoiceType>>,
  value: unknown,
): value is ChoiceType {
  return choices.some((choice) => choice.value === value);
}