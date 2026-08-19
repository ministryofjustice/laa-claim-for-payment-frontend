import type { Message } from "#src/viewmodels/components/message.js";
import type { RadioQuestionOptions } from "#src/viewmodels/radioQuestionViewModel.js";
import type { RadioField } from "#src/helpers/fields.js";

export interface Radios<T> {
  idPrefix: string;
  name: string;
  fieldset: {
    legend: {
      text: Message;
      isPageHeading: boolean;
      classes: string;
    };
  };
  errorMessage?: {
    text: Message;
  };
  items: ReadonlyArray<RadioQuestionOptions<T>>;
}

/**
 *
 * @param field
 * @param legend
 * @param isLegendPageHeading
 */
export function buildRadios<ChoiceType, ValueType>(
  field: RadioField<ChoiceType, ValueType>,
  legend: Message,
  isLegendPageHeading: boolean,
): Radios<ChoiceType> {
  return {
    idPrefix: field.id,
    name: field.name,
    fieldset: {
      legend: {
        text: legend,
        isPageHeading: isLegendPageHeading,
        classes: isLegendPageHeading
          ? "govuk-fieldset__legend--l"
          : "govuk-fieldset__legend--m",
      },
    },
    errorMessage: field.getErrorMessage(),
    items: field.getOptions(),
  };
}
