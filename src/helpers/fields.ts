import { type FieldValidationError, getStringValue, type ValidationResult } from "#src/helpers/validation.js";
import { BooleanChoice, booleanChoices } from "#src/models/booleanChoice.js";
import type { RadioQuestionOptions } from "#src/viewmodels/radioQuestionViewModel.js";
import { LocalDate } from "#src/types/date.js";
import type { Message } from "#src/viewmodels/components/message.js";
import type { EvidenceItem } from "#src/types/Claim.js";

/**
 *
 */
export abstract class Field<RawType, ValidatedType> {
  public validation?: ValidationResult<ValidatedType>;

  /**
   *
   * @param messagePrefix
   * @param name
   * @param id
   */
  constructor(
    public readonly messagePrefix: string,
    public readonly name: string,
    public readonly id: string,
  ) {}

  abstract validate(value: RawType): void;

  /**
   *
   * @param value
   */
  valid(value: ValidatedType): void {
    this.validation = {
      isValid: true,
      value,
    };
  }

  /**
   *
   * @param error
   */
  error(error: FieldValidationError): void {
    this.validation = {
      isValid: false,
      errors: [error],
    };
  }

  /**
   *
   */
  getResult(): ValidationResult<ValidatedType> {
    if (this.validation === undefined) {
      throw new Error(`Field "${this.name}" has not been validated`);
    }

    return this.validation;
  }

  /**
   *
   */
  getValue(): ValidatedType | undefined {
    if (this.validation?.isValid !== true) {
      return undefined;
    }

    return this.validation.value;
  }

  /**
   *
   * @param value
   */
  setValue(value: ValidatedType | null | undefined): void {
    if (value != null) {
      this.validation = {
        isValid: true,
        value,
      };
    }
  }

  /**
   *
   */
  getError(): FieldValidationError | undefined {
    return this.validation?.isValid === false
      ? this.validation.errors[0]
      : undefined;
  }

  /**
   *
   */
  getErrorMessage(): undefined | { text: Message } {
    const error = this.getError();
    return error == null
      ? undefined
      : {
          text: error.text,
        };
  }
}

/**
 *
 */
export class UploadField extends Field<EvidenceItem[], EvidenceItem[]> {
  /**
   *
   * @param messagePrefix
   * @param name
   * @param id
   */
  constructor(messagePrefix: string, name: string, id: string) {
    super(messagePrefix, name, id);
  }

  /**
   *
   * @param value
   */
  validate(value: EvidenceItem[]): void {
    if (value.length > 0) {
      this.valid(value);
    } else {
      this.error({
        href: `#${this.id}`,
        text: {
          key: `${this.messagePrefix}.errors.noFileSelected`,
        },
      });
    }
  }
}

/**
 *
 */
export class StringField extends Field<unknown, string> {
  /**
   *
   * @param messagePrefix
   * @param name
   * @param id
   * @param regex
   */
  constructor(
    messagePrefix: string,
    name: string,
    id: string,
    private readonly regex: RegExp,
  ) {
    super(messagePrefix, name, id);
  }

  /**
   *
   * @param value
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
 *
 */
export class RadioField<TChoice, TValue> extends Field<unknown, TValue> {
  /**
   *
   * @param messagePrefix
   * @param name
   * @param id
   * @param choices
   * @param toValue
   */
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
   *
   * @param value
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
   *
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
 *
 */
export class BooleanField extends RadioField<BooleanChoice, boolean> {
  /**
   *
   * @param messagePrefix
   * @param name
   * @param id
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
 *
 */
export class MoneyField extends Field<unknown, number> {
  /**
   *
   * @param messagePrefix
   * @param name
   * @param id
   */
  constructor(messagePrefix: string, name: string, id: string) {
    super(messagePrefix, name, id);
  }

  /**
   *
   * @param value
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

    if (!/^[\d.]+$/.test(stringValue)) {
      this.error({
        href: `#${this.id}`,
        text: {
          key: `${this.messagePrefix}.errors.invalid`,
        },
      });

      return;
    }

    const MONEY_REGEX = /^\d+(\.\d{1,2})?$/;

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
 *
 */
export class DateField extends Field<RawDate, LocalDate> {
  /**
   *
   * @param messagePrefix
   * @param name
   * @param id
   */
  constructor(messagePrefix: string, name: string, id: string) {
    super(messagePrefix, name, id);
  }

  /**
   *
   * @param value
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

    const NUMBERS_ONLY_REGEX = /^\d+$/;

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
   *
   * @param fieldName
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
