

interface RadioQuestionOptions<ChoiceType> {
  value: ChoiceType;
  text: string;
  hint?: {
    text: string;
  };
}

interface RadioQuestionViewModelParams<ChoiceType> {
  title: string;
  fieldName: string;
  choices: ReadonlyArray<RadioQuestionOptions<ChoiceType>>;
  selectedValue?: ChoiceType;
  error?: {
    text: string;
  };
}

/**
 * View model for the Radio Questions page.
 */
export class RadioQuestionViewModel<ChoiceType> {
  readonly title;
  readonly choices;
  readonly form;

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

    this.form = {
      fieldName,
      choices: choices.map((choice) => ({
        ...choice,
        checked: choice.value === selectedValue,
      })),
      error,
    };
  }
}

/**
 * Checks whether the choice is valid.
 *
 * @param {ReadonlyArray<RadioQuestionOptions>} choices The available choices.
 * @param {unknown} value The submitted choice.
 * @returns {boolean} Whether the submitted choice is valid.
 */
export function isValidChoice<ChoiceType>(choices: ReadonlyArray<RadioQuestionOptions<ChoiceType>>, value: unknown): value is ChoiceType {
  return  choices.some((choice) => choice.value === value);
}