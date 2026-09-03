import {
  type FieldValidationError,
  getStringValue,
  type ValidationResult,
} from "#src/helpers/validation.js";
import { BooleanChoice, booleanChoices } from "#src/models/booleanChoice.js";
import type { RadioQuestionOptions } from "#src/viewmodels/radioQuestionViewModel.js";
import { LocalDate } from "#src/types/date.js";
import type { Message } from "#src/viewmodels/components/message.js";
import type { EvidenceItem } from "#src/types/Claim.js";

/**
 * Form field.
 */
export abstract class Field<RawType, ValidatedType> {
  public validation?: ValidationResult<ValidatedType>;

  /**
   * Creates a form field.
   * @param {string} messagePrefix message prefix for the field
   * @param {string} name field name
   * @param {string} id field ID
   */
  constructor(
    public readonly messagePrefix: string,
    public readonly name: string,
    public readonly id: string,
  ) {}

  abstract validate(value: RawType): void;

  /**
   * Marks the field as valid for the given validated value.
   * @param {object} value the validated value.
   */
  valid(value: ValidatedType): void {
    this.validation = {
      isValid: true,
      value,
    };
  }

  /**
   * Marks the field as invalid for the given validated value.
   * @param {FieldValidationError} error the validation error for the field
   */
  error(error: FieldValidationError): void {
    this.validation = {
      isValid: false,
      errors: [error],
    };
  }

  /**
   * Get the validation result for the field.
   * @returns {ValidationResult} the validation result
   * @throws if the field has not been validated
   */
  getResult(): ValidationResult<ValidatedType> {
    if (this.validation === undefined) {
      throw new Error(`Field "${this.name}" has not been validated`);
    }

    return this.validation;
  }

  /**
   * Gets the field value.
   * @returns {object | undefined} the field value
   */
  getValue(): ValidatedType | undefined {
    if (this.validation?.isValid !== true) {
      return undefined;
    }

    return this.validation.value;
  }

  /**
   * Sets the field value.
   * @param {object | null | undefined} value the field value
   */
  setValue(value: ValidatedType | null | undefined): void {
    if (value != null) {
      this.valid(value);
    }
  }

  /**
   * Gets the error associated with this field if there is one.
   * @returns {FieldValidationError | undefined} the error if there is one
   */
  getError(): FieldValidationError | undefined {
    return this.validation?.isValid === false
      ? this.validation.errors[0]
      : undefined;
  }

  /**
   * Gets the error message associated with this field if there is one.
   * @returns {_: Message | undefined} the error message if there is one
   */
  getErrorMessage(): { text: Message } | undefined {
    const error = this.getError();
    return error == null
      ? undefined
      : {
          text: error.text,
        };
  }
}

/**
 * Upload form field.
 */
export class UploadField extends Field<EvidenceItem[], EvidenceItem[]> {
  /**
   * Validate the field against the given value.
   * @param {EvidenceItem[]} value the uploads
   */
  validate(value: EvidenceItem[]): void {
    if (value.length > 0) {
      this.valid(value);
    } else {
      this.error({
        href: `#${this.id}`,
        text: {
          key: `${this.messagePrefix}.errors.empty`,
        },
      });
    }
  }
}

/**
 * String form field.
 */
export class StringField extends Field<unknown, string> {
  /**
   * Creates a string form field.
   * @param {string} messagePrefix message prefix for the field
   * @param {string} name field name
   * @param {string} id field ID
   * @param {RegExp} regex regex to validate against
   */
  constructor(
    messagePrefix: string,
    name: string,
    id: string,
    private readonly regex: RegExp,
    private readonly maxLength: number,
  ) {
    super(messagePrefix, name, id);
  }

  /**
   * Validate the field against the given value.
   * @param {unknown} value the entered value
   */
  validate(value: unknown): void {
    const stringValue = getStringValue(value);

    if (stringValue === "") {
      this.error({
        href: `#${this.id}`,
        text: {
          key: `${this.messagePrefix}.errors.empty`,
        },
      });
      return;
    }

    if (stringValue.length > this.maxLength) {
      this.error({
        href: `#${this.id}`,
        text: {
          key: `${this.messagePrefix}.errors.length`,
          args: { length: this.maxLength },
        },
      });
      return;
    }

    if (!this.regex.test(stringValue)) {
      this.error({
        href: `#${this.id}`,
        text: {
          key: `${this.messagePrefix}.errors.invalid`,
        },
      });
      return;
    }

    this.valid(stringValue);
  }
}

/**
 * Radio form field.
 */
export class RadioField<TChoice, TValue> extends Field<unknown, TValue> {
  /**
   * Creates a radio form field.
   * @param {string} messagePrefix message prefix for the field
   * @param {string} name field name
   * @param {string} id field ID
   * @param {ReadonlyArray<RadioQuestionOptions>} choices field radio options
   * @param {Function} toValue maps a TChoice to a TValue
   */
  // eslint-disable-next-line @typescript-eslint/max-params -- ignore
  constructor(
    messagePrefix: string,
    name: string,
    id: string,
    public readonly choices: ReadonlyArray<RadioQuestionOptions<TChoice>>,
    private readonly toValue: (choice: TChoice) => TValue,
  ) {
    super(messagePrefix, name, id);
  }

  /**
   * Validate the field against the given value.
   * @param {unknown} value the selected value
   */
  validate(value: unknown): void {
    const selection = this.choices.find((choice) => choice.value === value);

    if (selection === undefined) {
      this.error({
        href: `#${this.id}`,
        text: {
          key: `${this.messagePrefix}.errors.empty`,
        },
      });

      return;
    }

    this.valid(this.toValue(selection.value));
  }

  /**
   * Get the radio options for the radio form field with the appropriate checked status.
   * @returns {ReadonlyArray<RadioQuestionOptions>} the radio options
   */
  getOptions(): ReadonlyArray<RadioQuestionOptions<TChoice>> {
    const value = this.getValue();

    return this.choices.map((choice) => ({
      ...choice,
      checked: this.toValue(choice.value) === value,
    }));
  }
}

/**
 * Yes/No form field.
 */
export class BooleanField extends RadioField<BooleanChoice, boolean> {
  /**
   * Creates a yes/no form field.
   * @param {string} messagePrefix message prefix for the field
   * @param {string} name field name
   * @param {string} id field ID
   */
  constructor(messagePrefix: string, name: string, id: string) {
    super(
      messagePrefix,
      name,
      id,
      booleanChoices,
      (choice) => choice === BooleanChoice.Yes,
    );
  }
}

/**
 * Monetary form field.
 */
export class MoneyField extends Field<unknown, number> {
  /**
   * Validate the field against the given value.
   * @param {unknown} value the entered value
   */
  validate(value: unknown): void {
    const stringValue = getStringValue(value);

    if (stringValue === "") {
      this.error({
        href: `#${this.id}`,
        text: {
          key: `${this.messagePrefix}.errors.empty`,
        },
      });

      return;
    }

    if (!/^[\d.]+$/u.test(stringValue)) {
      this.error({
        href: `#${this.id}`,
        text: {
          key: `${this.messagePrefix}.errors.invalid`,
        },
      });

      return;
    }

    const MONEY_REGEX = /^\d+(\.\d{1,2})?$/u;

    if (!MONEY_REGEX.test(stringValue)) {
      this.error({
        href: `#${this.id}`,
        text: {
          key: `${this.messagePrefix}.errors.pence`,
        },
      });

      return;
    }

    this.valid(Number(stringValue));
  }
}

interface RawDate {
  day: unknown;
  month: unknown;
  year: unknown;
}

/**
 * Date form field.
 */
export class DateField extends Field<RawDate, LocalDate> {
  /**
   * Validate the field against the given values.
   * @param {RawDate} value the entered values
   */
  validate(value: RawDate): void {
    const day = getStringValue(value.day);
    const month = getStringValue(value.month);
    const year = getStringValue(value.year);

    const parts = {
      day,
      month,
      year,
    };

    const missing = Object.entries(parts)
      .filter(([, value]) => value === "")
      .map(([key]) => key);

    if (missing.length > 0) {
      if (missing.length === 3) {
        this.error({
          href: `#${this.id}-day`,
          text: {
            key: `${this.messagePrefix}.errors.empty`,
          },
          fields: ["day", "month", "year"],
        });

        return;
      }

      const errorKey = buildMissingDateKey(missing);

      this.error({
        href: `#${this.id}-${missing[0]}`,
        text: {
          key: `${this.messagePrefix}.errors.incomplete.${errorKey}`,
        },
        fields: missing,
      });

      return;
    }

    const NUMBERS_ONLY_REGEX = /^\d+$/u;

    if (
      !NUMBERS_ONLY_REGEX.test(day) ||
      !NUMBERS_ONLY_REGEX.test(month) ||
      !NUMBERS_ONLY_REGEX.test(year)
    ) {
      this.error({
        href: `#${this.id}-day`,
        text: {
          key: `${this.messagePrefix}.errors.invalid`,
        },
        fields: ["day", "month", "year"],
      });

      return;
    }

    try {
      const date = LocalDate.of(Number(day), Number(month), Number(year));

      if (date.isFutureDate()) {
        this.error({
          href: `#${this.id}-day`,
          text: {
            key: `${this.messagePrefix}.errors.future`,
          },
          fields: ["day", "month", "year"],
        });

        return;
      }

      this.valid(date);
    } catch {
      this.error({
        href: `#${this.id}-day`,
        text: {
          key: `${this.messagePrefix}.errors.invalid`,
        },
        fields: ["day", "month", "year"],
      });
    }
  }

  /**
   * Gets whether a certain field (day/month/year) has an error associated to it.
   * @param {string} fieldName the name of the field
   * @returns {boolean} whether the field has an error
   */
  hasError(fieldName: string): boolean {
    return this.getError()?.fields?.includes(fieldName) ?? false;
  }
}

function buildMissingDateKey(parts: string[]): string {
  return parts
    .map((part, index) =>
      index === 0 ? part : `And${part.charAt(0).toUpperCase()}${part.slice(1)}`,
    )
    .join("");
}
