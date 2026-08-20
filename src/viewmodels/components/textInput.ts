import type { Message } from "#src/viewmodels/components/message.js";
import type { MoneyField, StringField } from "#src/helpers/fields.js";

export interface TextInput {
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
 * Builds a monetary text input.
 * @param {MoneyField} field the underlying form field
 * @returns {TextInput} a monetary text input
 */
export function buildMonetaryInput(field: MoneyField): TextInput {
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
 * Builds a regular text input.
 * @param {StringField} field the underlying form field
 * @returns {TextInput} a regular text input
 */
export function buildTextInput(field: StringField): TextInput {
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
