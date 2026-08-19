import type { Message } from "#src/viewmodels/components/message.js";
import type { MoneyField, StringField } from "#src/helpers/fields.js";

export interface Input {
  id: string;
  name: string;
  value: unknown;
  classes?: string;
  label: {
    text: Message;
    classes: string;
  };
  errorMessage?: {
    text: Message;
  };
  prefix?: {
    text: string;
  };
  inputmode?: string;
}

/**
 *
 * @param field
 */
export function buildMonetaryInput(field: MoneyField): Input {
  return {
    id: field.id,
    name: field.name,
    value: field.getValue(),
    classes: "govuk-input--width-5",
    label: {
      text: {
        key: `${field.messagePrefix}.title`,
      },
      classes: "govuk-label--m",
    },
    errorMessage: field.getErrorMessage(),
    prefix: {
      text: "£",
    },
    inputmode: "decimal",
  };
}

/**
 *
 * @param field
 */
export function buildInput(field: StringField): Input {
  return {
    id: field.id,
    name: field.name,
    value: field.getValue(),
    label: {
      text: {
        key: `${field.messagePrefix}.title`,
      },
      classes: "govuk-label--m",
    },
    errorMessage: field.getErrorMessage(),
  };
}
