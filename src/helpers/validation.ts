import type { Message } from "#src/viewmodels/components/message.js";
import type {
  ErrorSummary,
  ErrorSummaryError,
} from "#src/viewmodels/components/errorSummary.js";
import type { Field } from "#src/helpers/fields.js";

/**
 *
 */
export class Form<TFields, TValue> {
  /**
   *
   * @param fields
   * @param validation
   */
  constructor(
    public readonly fields: TFields,
    public readonly validation?: ValidationResult<TValue>,
  ) {}

  /**
   *
   */
  getErrors(): FieldValidationError[] {
    if (this.isNotValid()) {
      return this.validation.errors;
    }

    return [];
  }

  /**
   *
   */
  getErrorSummary(): ErrorSummary | undefined {
    const errors = this.getErrors();
    if (errors.length > 0) {
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
    return undefined;
  }

  /**
   *
   */
  isValid(): this is this & {
    validation: ValidationSuccess<TValue>;
  } {
    return this.validation?.isValid === true;
  }

  /**
   *
   */
  isNotValid(): this is this & {
    validation: ValidationFailure;
  } {
    return this.validation?.isValid === false;
  }

  /**
   *
   */
  getValue(): TValue {
    if (!this.isValid()) {
      throw new Error("Cannot get value from an invalid form");
    }

    return this.validation.value;
  }
}

export interface FieldValidationError {
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
 * Get request body.
 *
 * @param {any} body Request body.
 * @returns {object} Form object.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- ignore
export function getRequestBody(body: any): object {
  if (typeof body !== "object" || body === null) {
    return {};
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- ignore
  return body;
}

type Fields<T> = {
  [K in keyof T]: Field<unknown, unknown>;
};

type FieldValues<TFields> = {
  [K in keyof TFields]: TFields[K] extends Field<unknown, infer TValue>
    ? TValue
    : never;
};

/**
 * Combines multiple field-level validation results into a single result object.
 *
 * @param {object} fields - An object mapping each key of T to its ValidationResult.
 * @returns {ValidationResult} A combined ValidationResult representing the full object.
 */
export function combine<TFields>(
  fields: TFields & Fields<TFields>,
): ValidationResult<FieldValues<TFields>> {
  const value: Partial<FieldValues<TFields>> = {};
  const errors: FieldValidationError[] = [];

  for (const key of Object.keys(fields) as Array<keyof TFields>) {
    const result = fields[key].getResult();

    if (result.isValid) {
      value[key] = result.value as FieldValues<TFields>[typeof key];
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

  return {
    isValid: true,
    value: value as FieldValues<TFields>,
  };
}
