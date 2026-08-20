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
 * Builds a radios input.
 * @param {RadioField} field the underlying form field
 * @param {Message} legend legend text
 * @param {boolean} isLegendPageHeading whether the legend should be the page heading
 * @returns {Radios} a radios input
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
