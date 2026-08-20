import type { Message } from "#src/viewmodels/components/message.js";
import type { DateField } from "#src/helpers/fields.js";

export interface DateInput {
  id: string;
  fieldset: {
    legend: {
      text: Message;
      classes: string;
    }
  },
  hint: {
    text: Message
  },
  errorMessage?: {
    text: Message;
  };
  items: DateInputItem[]
}

interface DateInputItem {
  id: string;
  name: string;
  value: unknown;
  classes: string;
  label: Message;
}

/**
 * Builds a date input.
 * @param {DateField} field the underlying form field
 * @returns {DateInput} a date input
 */
export function buildDateInput(field: DateField): DateInput {
  return {
    id: field.id,
    fieldset: {
      legend: {
        text: {
          key: `${field.messagePrefix}.title`
        },
        classes: "govuk-fieldset__legend--m",
      }
    },
    hint: {
      text: {
        key: `${field.messagePrefix}.hint`
      }
    },
    errorMessage: field.getErrorMessage(),
    items: [
      {
        id: `${field.id}-day`,
        name: `${field.name}Day`,
        value: field.getValue()?.day,
        classes: field.hasError("day") ? "govuk-input--width-2 govuk-input--error" : "govuk-input--width-2",
        label: {
          key: `${field.messagePrefix}.day`
        }
      },
      {
        id: `${field.id}-month`,
        name: `${field.name}Month`,
        value: field.getValue()?.month,
        classes: field.hasError("month") ? "govuk-input--width-2 govuk-input--error" : "govuk-input--width-2",
        label: {
          key: `${field.messagePrefix}.month`
        }
      },
      {
        id: `${field.id}-year`,
        name: `${field.name}Year`,
        value: field.getValue()?.year,
        classes: field.hasError("year") ? "govuk-input--width-4 govuk-input--error" : "govuk-input--width-4",
        label: {
          key: `${field.messagePrefix}.year`
        }
      }
    ]
  }
}