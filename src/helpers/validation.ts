import type { Message } from "#src/viewmodels/components/message.js";
import type { ErrorSummary, ErrorSummaryError } from "#src/viewmodels/components/errorSummary.js";

/**
 * Abstracted form.
 */
export abstract class Form<TFields, TRequest, TValid> {
  public validation?: ValidationResult<TValid>;

  /**
   * Creates a form.
   * @param {object} fields form fields.
   */
  constructor(public readonly fields: TFields) {}

  abstract fill(value: TValid): void;

  abstract validate(value: TRequest): void;

  /**
   * Get errors for all fields.
   * @returns {FieldValidationError[]} the errors
   */
  getErrors(): FieldValidationError[] {
    return this.isNotValid() ? this.validation.errors : [];
  }

  /**
   * Get error summary for the form.
   * @returns {ErrorSummary} the error summary
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
   * Is form valid.
   * @returns {boolean} whether the form is valid
   */
  isValid(): this is this & {
    validation: ValidationSuccess<TValid>;
  } {
    return this.validation?.isValid === true;
  }

  /**
   * Is form not valid.
   * @returns {boolean} whether the form is not valid
   */
  isNotValid(): this is this & {
    validation: ValidationFailure;
  } {
    return this.validation?.isValid === false;
  }

  /**
   * Retrieves validated form value.
   * @returns {object} the validated form value
   */
  getValue(): TValid {
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
