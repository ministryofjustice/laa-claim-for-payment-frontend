import type { Message } from "#src/viewmodels/components/message.js";
import type {
  ErrorSummary,
  ErrorSummaryError,
} from "#src/viewmodels/components/errorSummary.js";
import type { Field } from "#src/helpers/fields.js";

/**
 * Abstracted form.
 */
export abstract class Form<TFields, TRaw, TValid> {
  public validation?: ValidationResult<TRaw, TValid>;

  /**
   * Creates a form.
   * @param {object} fields form fields.
   * @param {string} messagePrefix message prefix for the field
   */
  constructor(
    public readonly fields: TFields,
    public readonly messagePrefix: string,
  ) {}

  abstract fill(value: TValid): void;

  abstract validate(value: TRaw): void;

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
    validation: ValidationFailure<TRaw>;
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

export interface ValidationSuccess<TValid> {
  isValid: true;
  value: TValid;
}

export interface ValidationFailure<TRaw> {
  isValid: false;
  errors: FieldValidationError[];
  value: TRaw;
}

export type ValidationResult<TRaw, TValid> = ValidationSuccess<TValid> | ValidationFailure<TRaw>;

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

type FieldValues<TFields> = {
  [K in keyof TFields]: TFields[K] extends Field<unknown, infer TValidated>
    ? TValidated
    : never;
};

/**
 * Combines the validation results of all fields into a single form validation result.
 *
 * @param {object} value - The raw value.
 * @param {object} fields - An object containing the fields to combine.
 * @returns {ValidationResult} A combined validation result containing either all field values or errors.
 */
export function combine<TRaw, TFields>(
  value: TRaw,
  fields: TFields & {
    [K in keyof TFields]: TFields[K] extends Field<infer _Raw, infer TValidated>
      ? Field<_Raw, TValidated>
      : never;
  },
): ValidationResult<TRaw, FieldValues<TFields>> {
  const values: Record<PropertyKey, unknown> = {};
  const errors: FieldValidationError[] = [];

  for (const key of Object.keys(fields)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Object.keys loses the keyof TFields relationship.
    const { [key as keyof TFields]: field } = fields;

    const result = field.getResult();

    if (result.isValid) {
      // eslint-disable-next-line @typescript-eslint/prefer-destructuring -- ignore
      values[key] = result.value;
    } else {
      errors.push(...result.errors);
    }
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      value,
    };
  }

  return {
    isValid: true,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- All fields have been validated successfully, so the collected values match FieldValues<TFields>.
    value: values as FieldValues<TFields>,
  };
}
