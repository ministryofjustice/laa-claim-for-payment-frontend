import type { Message } from "#src/viewmodels/components/message.js";
import type {
  ErrorSummary,
  ErrorSummaryError,
} from "#src/viewmodels/components/errorSummary.js";
import type { RadioQuestionOptions } from "#src/viewmodels/radioQuestionViewModel.js";
import { BooleanChoice, booleanChoices } from "#src/models/booleanChoice.js";
import { LocalDate } from "#src/types/date.js";

export interface Field {
  messagePrefix: string;
  name: string;
  id: string;
}

export interface FieldValidationError {
  fieldName: string;
  href: string;
  text: Message;
  fields?: string[];
}

export interface ValidationSuccess<T> {
  isValid: true;
  value: T;
}

export interface ValidationFailure {
  isValid: false;
  errors: FieldValidationError[];
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

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
 * @param {Field} field field
 * @param {RegExp} regex regex to validate input against
 * @returns {FieldValidationError[]} field validation errors
 */
export function validateStringInput(
  value: unknown,
  field: Field,
  regex: RegExp,
): ValidationResult<string> {
  const stringValue = getStringValue(value);

  if (stringValue === "") {
    return {
      isValid: false,
      errors: [
        {
          fieldName: field.name,
          href: `#${field.id}`,
          text: {
            key: `${field.messagePrefix}.errors.empty`,
          },
        },
      ],
    };
  }

  if (!regex.test(stringValue)) {
    return {
      isValid: false,
      errors: [
        {
          fieldName: field.name,
          href: `#${field.id}`,
          text: {
            key: `${field.messagePrefix}.errors.invalid`,
          },
        },
      ],
    };
  }

  // TODO - length check

  return {
    isValid: true,
    value: stringValue,
  };
}

/**
 * Validate boolean input.
 * @param {unknown} value value to validate as boolean
 * @param {Field} field field
 * @returns {FieldValidationError[]} field validation errors
 */
export function validateBooleanInput(
  value: unknown,
  field: Field,
): ValidationResult<boolean> {
  const selection: RadioQuestionOptions<BooleanChoice> | undefined = booleanChoices.find(
    (choice) => choice.value === value,
  );

  if (selection == null) {
    return {
      isValid: false,
      errors: [
        {
          fieldName: field.name,
          href: `#${field.id}`,
          text: {
            key: `${field.messagePrefix}.errors.empty`,
          },
        },
      ],
    };
  }

  return {
    isValid: true,
    value: selection.value === BooleanChoice.Yes,
  };
}

/**
 * Validate radio input.
 * @param {ReadonlyArray<RadioQuestionOptions>} choices available radio options
 * @param {unknown} value value to validate as radio option
 * @param {Field} field field
 * @returns {FieldValidationError[]} field validation errors
 */
export function validateRadioInput<T>(
  choices: ReadonlyArray<RadioQuestionOptions<T>>,
  value: unknown,
  field: Field,
): ValidationResult<T> {
  const selection: RadioQuestionOptions<T> | undefined = choices.find(
    (choice) => choice.value === value,
  );

  if (selection == null) {
    return {
      isValid: false,
      errors: [
        {
          fieldName: field.name,
          href: `#${field.id}`,
          text: {
            key: `${field.messagePrefix}.errors.empty`,
          },
        },
      ],
    };
  }

  return {
    isValid: true,
    value: selection.value,
  };
}

/**
 * Validate monetary value input.
 * @param {unknown} value value to validate as monetary value
 * @param {Field} field field
 * @returns {FieldValidationError[]} field validation errors
 */
export function validateMoneyInput(
  value: unknown,
  field: Field
): ValidationResult<number> {
  const stringValue = getStringValue(value);

  if (stringValue === "") {
    return {
      isValid: false,
      errors: [
        {
          fieldName: field.name,
          href: `#${field.id}`,
          text: {
            key: `${field.messagePrefix}.errors.empty`,
          },
        },
      ],
    };
  }

  if (!/^[\d.]+$/.test(stringValue)) {
    return {
      isValid: false,
      errors: [
        {
          fieldName: field.name,
          href: `#${field.id}`,
          text: {
            key: `${field.messagePrefix}.errors.invalid`,
          },
        },
      ],
    };
  }

  const MONEY_REGEX = /^\d+(\.\d{1,2})?$/;

  if (!MONEY_REGEX.test(stringValue)) {
    return {
      isValid: false,
      errors: [
        {
          fieldName: field.name,
          href: `#${field.id}`,
          text: {
            key: `${field.messagePrefix}.errors.pence`,
          },
        },
      ],
    };
  }

  return {
    isValid: true,
    value: Number(stringValue),
  };
}

/**
 * Validate date input.
 * @param {object} value value to validate as date
 * @param {unknown} value.day day value
 * @param {unknown} value.month month value
 * @param {unknown} value.year year value
 * @param {Field} field field
 * @returns {FieldValidationError[]} field validation errors
 */
export function validateDateInput(
  value: {
    day: unknown;
    month: unknown;
    year: unknown;
  },
  field: Field,
): ValidationResult<LocalDate> {
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
      return {
        isValid: false,
        errors: [
          {
            fieldName: field.name,
            href: `#${field.id}-day`,
            text: {
              key: `${field.messagePrefix}.errors.empty`,
            },
            fields: ["day", "month", "year"],
          },
        ],
      };
    }

    const errorKey = buildMissingDateKey(missing);

    return {
      isValid: false,
      errors: [
        {
          fieldName: field.name,
          href: `#${field.id}-${missing[0]}`,
          text: {
            key: `${field.messagePrefix}.errors.incomplete.${errorKey}`,
          },
          fields: missing,
        },
      ],
    };
  }

  const NUMBERS_ONLY_REGEX = /^\d+$/;

  if (
    !NUMBERS_ONLY_REGEX.test(day) ||
    !NUMBERS_ONLY_REGEX.test(month) ||
    !NUMBERS_ONLY_REGEX.test(year)
  ) {
    return {
      isValid: false,
      errors: [
        {
          fieldName: field.name,
          href: `#${field.id}-day`,
          text: {
            key: `${field.messagePrefix}.errors.invalid`,
          },
          fields: ["day", "month", "year"],
        },
      ],
    };
  }

  try {
    const date: LocalDate = LocalDate.of(Number(day), Number(month), Number(year));

    if (date.isFutureDate()) {
      return {
        isValid: false,
        errors: [
          {
            fieldName: field.name,
            href: `#${field.id}-day`,
            text: {
              key: `${field.messagePrefix}.errors.future`,
            },
            fields: ["day", "month", "year"],
          },
        ],
      };
    }

    return {
      isValid: true,
      value: date,
    };
  } catch {
    return {
      isValid: false,
      errors: [
        {
          fieldName: field.name,
          href: `#${field.id}-day`,
          text: {
            key: `${field.messagePrefix}.errors.invalid`,
          },
          fields: ["day", "month", "year"],
        },
      ],
    };
  }
}

function buildMissingDateKey(parts: string[]): string {
  return parts
    .map((p, i) =>
      i === 0 ? p : `And${p.charAt(0).toUpperCase()}${p.slice(1)}`,
    )
    .join("");
}

/**
 * Find the field validation error for a given field name.
 * @param {FieldValidationError[]} errors field validation errors
 * @param {Field} field field
 * @returns {FieldValidationError} field validation error
 */
export function getError(
  errors: FieldValidationError[],
  field: Field,
): FieldValidationError | undefined {
  return errors.find((item) => item.fieldName === field.name);
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

/**
 * Combines multiple field-level validation results into a single result object.
 *
 * @param {object} results - An object mapping each key of T to its ValidationResult.
 * @returns {ValidationResult} A combined ValidationResult representing the full object.
 */
export function combine<T>(results: {
  [K in keyof T]: ValidationResult<T[K]>;
}): ValidationResult<T> {
  const value: Partial<T> = {};
  const errors: FieldValidationError[] = [];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- ignore
  for (const key of Object.keys(results) as Array<keyof T>) {
    // eslint-disable-next-line @typescript-eslint/prefer-destructuring -- ignore
    const result = results[key];

    if (result.isValid) {
      // eslint-disable-next-line @typescript-eslint/prefer-destructuring -- ignore
      value[key] = result.value;
    } else {
      errors.push(...result.errors);
    }
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- ignore
  return { isValid: true, value: value as T };
}
