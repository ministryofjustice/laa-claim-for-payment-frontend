import type { Message } from "#src/viewmodels/components/message.js";
import type { BooleanChoice } from "#src/models/booleanChoice.js";
import { buildRadios, type Radios } from "#src/viewmodels/components/radios.js";
import type { ErrorSummary } from "#src/viewmodels/components/errorSummary.js";
import type { RadioQuestionForm } from "#src/helpers/radioQuestionValidation.js";

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
    this.radios = buildRadios(
      form.fields.field,
      this.title,
      isLegendPageHeading,
    );
    this.errorSummary = form.getErrorSummary();
  }
}

export type YesNoQuestionViewModel = RadioQuestionViewModel<
  BooleanChoice,
  boolean
>;
