import type { Message } from "#src/viewmodels/components/message.js";
import type {
  ErrorSummary,
  ErrorSummaryError,
} from "#src/viewmodels/components/errorSummary.js";
import type { RadioQuestionOptions } from "#src/viewmodels/radioQuestionViewModel.js";

export interface FieldValidationError {
  fieldName: string;
  href: string;
  text: Message;
  fields?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: FieldValidationError[];
}

/**
 * Get a validation result from a list of validation errors.
 * @param {FieldValidationError[]} errors field validation errors
 * @returns {ValidationResult} a validation result
 */
export function validationResult(
  errors: FieldValidationError[],
): ValidationResult {
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get string value.
 * @param {unknown} value value to get string value from
 * @returns {string} trimmed string value or an empty string for non-strings
 */
export function getStringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Validate string input.
 * @param {unknown} value value to validate as string
 * @param {string} fieldName field name
 * @param {string} id ID of input
 * @param {string} messagePrefix message prefix for error messages
 * @param {RegExp} regex regex to validate input against
 * @returns {FieldValidationError[]} field validation errors
 */
// eslint-disable-next-line @typescript-eslint/max-params -- ignore
export function validateStringInput(
  value: unknown,
  fieldName: string,
  id: string,
  messagePrefix: string,
  regex: RegExp,
): FieldValidationError[] {
  const stringValue = getStringValue(value);

  if (stringValue === "") {
    return [
      {
        fieldName,
        href: `#${id}`,
        text: {
          key: `${messagePrefix}.errors.empty`,
        },
      },
    ];
  }

  if (!regex.test(stringValue)) {
    return [
      {
        fieldName,
        href: `#${id}`,
        text: {
          key: `${messagePrefix}.errors.invalid`,
        },
      },
    ];
  }

  // TODO - length check

  return [];
}

/**
 * Validate boolean input.
 * @param {unknown} value value to validate as boolean
 * @param {string} fieldName field name
 * @param {string} id ID of input
 * @param {string} messagePrefix message prefix for error messages
 * @returns {FieldValidationError[]} field validation errors
 */
export function validateBooleanInput(
  value: unknown,
  fieldName: string,
  id: string,
  messagePrefix: string,
): FieldValidationError[] {
  const stringValue = getStringValue(value);

  if (stringValue !== "yes" && stringValue !== "no") {
    return [
      {
        fieldName,
        href: `#${id}`,
        text: {
          key: `${messagePrefix}.errors.empty`,
        },
      },
    ];
  }

  return [];
}

/**
 * Validate radio input.
 * @param {ReadonlyArray<RadioQuestionOptions>} choices available radio options
 * @param {unknown} value value to validate as radio option
 * @param {string} fieldName field name
 * @param {string} id ID of input
 * @param {string} messagePrefix message prefix for error messages
 * @returns {FieldValidationError[]} field validation errors
 */
// eslint-disable-next-line @typescript-eslint/max-params -- ignore
export function validateRadioInput<T>(
  choices: ReadonlyArray<RadioQuestionOptions<T>>,
  value: unknown,
  fieldName: string,
  id: string,
  messagePrefix: string,
): FieldValidationError[] {
  if (!choices.some((choice) => choice.value === value)) {
    return [
      {
        fieldName,
        href: `#${id}`,
        text: {
          key: `${messagePrefix}.errors.empty`,
        },
      },
    ];
  }

  return [];
}

/**
 * Validate monetary value input.
 * @param {unknown} value value to validate as monetary value
 * @param {string} fieldName field name
 * @param {string} id ID of input
 * @param {string} messagePrefix message prefix for error messages
 * @returns {FieldValidationError[]} field validation errors
 */
export function validateMoneyInput(
  value: unknown,
  fieldName: string,
  id: string,
  messagePrefix: string,
): FieldValidationError[] {
  const stringValue = getStringValue(value);

  if (stringValue === "") {
    return [
      {
        fieldName,
        href: `#${id}`,
        text: {
          key: `${messagePrefix}.errors.empty`,
        },
      },
    ];
  }

  if (!/^[\d.]+$/.test(stringValue)) {
    return [
      {
        fieldName,
        href: `#${id}`,
        text: {
          key: `${messagePrefix}.errors.invalid`,
        },
      },
    ];
  }

  const MONEY_REGEX = /^\d+(\.\d{1,2})?$/;

  if (!MONEY_REGEX.test(stringValue)) {
    return [
      {
        fieldName,
        href: `#${id}`,
        text: {
          key: `${messagePrefix}.errors.pence`,
        },
      },
    ];
  }

  return [];
}

/**
 * Validate date input.
 * @param {object} value value to validate as date
 * @param {unknown} value.day day value
 * @param {unknown} value.month month value
 * @param {unknown} value.year year value
 * @param {string} fieldName field name
 * @param {string} id ID of input
 * @param {string} messagePrefix message prefix for error messages
 * @returns {FieldValidationError[]} field validation errors
 */
export function validateDateInput(
  value: {
    day: unknown;
    month: unknown;
    year: unknown;
  },
  fieldName: string,
  id: string,
  messagePrefix: string,
): FieldValidationError[] {
  const day = getStringValue(value.day);
  const month = getStringValue(value.month);
  const year = getStringValue(value.year);

  const parts = {
    day,
    month,
    year,
  };

  const missing = Object.entries(parts)
    .filter(([, v]) => v === "")
    .map(([k]) => k);

  if (missing.length > 0) {
    if (missing.length === 3) {
      return [
        {
          fieldName,
          href: `#${id}-day`,
          text: {
            key: `${messagePrefix}.errors.empty`,
          },
          fields: ["day", "month", "year"],
        },
      ];
    }

    const errorKey = buildMissingDateKey(missing);

    return [
      {
        fieldName,
        href: `#${id}-${missing[0]}`,
        text: {
          key: `${messagePrefix}.errors.incomplete.${errorKey}`,
        },
        fields: missing,
      },
    ];
  }

  const NUMBERS_ONLY_REGEX = /^\d+$/;

  if (
    !NUMBERS_ONLY_REGEX.test(day) ||
    !NUMBERS_ONLY_REGEX.test(month) ||
    !NUMBERS_ONLY_REGEX.test(year)
  ) {
    return [
      {
        fieldName,
        href: `#${id}-day`,
        text: {
          key: `${messagePrefix}.errors.invalid`,
        },
        fields: ["day", "month", "year"],
      },
    ];
  }

  const dayNumber = Number(day);
  const monthNumber = Number(month);
  const yearNumber = Number(year);

  if (!isRealDate(dayNumber, monthNumber, yearNumber)) {
    return [
      {
        fieldName,
        href: `#${id}-day`,
        text: {
          key: `${messagePrefix}.errors.invalid`,
        },
        fields: ["day", "month", "year"],
      },
    ];
  }

  if (isFutureDate(dayNumber, monthNumber, yearNumber)) {
    return [
      {
        fieldName,
        href: `#${id}-day`,
        text: {
          key: `${messagePrefix}.errors.future`,
        },
        fields: ["day", "month", "year"],
      },
    ];
  }

  return [];
}

function buildMissingDateKey(parts: string[]): string {
  return parts
    .map((p, i) =>
      i === 0 ? p : `And${p.charAt(0).toUpperCase()}${p.slice(1)}`,
    )
    .join("");
}

function isRealDate(day: number, month: number, year: number): boolean {
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function isFutureDate(day: number, month: number, year: number): boolean {
  const inputDate = new Date(year, month - 1, day);
  const today = new Date();

  inputDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return inputDate > today;
}

/**
 * Find the field validation error for a given field name.
 * @param {FieldValidationError[]} errors field validation errors
 * @param {string} fieldName field name
 * @returns {FieldValidationError} field validation error
 */
export function getError(
  errors: FieldValidationError[],
  fieldName: string,
): FieldValidationError | undefined {
  return errors.find((item) => item.fieldName === fieldName);
}

/**
 * Creates GOV.UK error summary from field validation errors.
 * @param {FieldValidationError[]} errors field validation errors
 * @returns {ErrorSummary} error summary
 */
export function getErrorSummary(errors: FieldValidationError[]): ErrorSummary {
  return {
    titleText: {
      key: "common.errorSummaryTitle",
    },
    errorList: errors.map(
      (error: FieldValidationError): ErrorSummaryError => ({
        text: error.text,
        href: error.href,
      }),
    ),
  };
}

/**
 * Create form from request body.
 *
 * @param {any} body Request body.
 * @returns {object} Form object.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- ignore
export function getForm(body: any): object {
  if (typeof body !== "object" || body === null) {
    return {};
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- ignore
  return body;
}
