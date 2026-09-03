import { expect } from "chai";
import { describe, it } from "mocha";
import {
  getStringValue,
  ValidationFailure,
  ValidationResult,
  ValidationSuccess,
} from "#src/helpers/validation.js";
import {
  BooleanField,
  DateField,
  MoneyField,
  StringField,
} from "#src/helpers/fields.js";

export function expectSuccess<S, T>(
  result: ValidationResult<S, T> | undefined,
): ValidationSuccess<T> {
  expect(result).to.not.equal(undefined);

  if (result === undefined) {
    throw new Error("Expected success but got undefined");
  }

  expect(result.isValid).to.equal(true);

  if (!result.isValid) {
    throw new Error("Expected success but got failure");
  }

  return result;
}

export function expectFailure<S, T>(
  result: ValidationResult<S, T> | undefined,
): ValidationFailure<S> {
  expect(result).to.not.equal(undefined);

  if (result === undefined) {
    throw new Error("Expected success but got undefined");
  }

  expect(result.isValid).to.equal(false);

  if (result.isValid) {
    throw new Error("Expected failure but got success");
  }

  return result;
}

describe("getStringValue", () => {
  it("returns string", () => {
    const result = getStringValue("foo");

    expect(result).to.equal("foo");
  });

  it("returns trimmed string", () => {
    const result = getStringValue("foo ");

    expect(result).to.equal("foo");
  });

  it("returns empty string for non-string", () => {
    const inputs = [null, undefined, true, {}, [], 1];
    inputs.forEach((input) => {
      const result = getStringValue(input);

      expect(result).to.equal("");
    });
  });
});

describe("validateStringInput", () => {
  const maxLength = 10;

  const field: StringField = new StringField(
    "prefix",
    "fieldName",
    "id",
    /^[A-Za-z]+$/,
    maxLength,
  );

  it("returns success for valid input", () => {
    field.validate("foo");
    const result = field.validation;

    const success = expectSuccess(result);

    expect(success.value).to.equal("foo");
  });

  it("returns failure with array of errors for empty input", () => {
    const value = "";
    field.validate(value);
    const result = field.validation;
    const failure = expectFailure(result);
    const errors = failure.errors;

    expect(errors).to.have.length(1);
    expect(errors[0].href).to.equal("#id");
    expect(errors[0].text.key).to.equal("prefix.errors.empty");
    expect(errors[0].fields).to.be.undefined;
    expect(failure.value).to.equal(value);
  });

  it("returns failure with array of errors for input that fails against regex", () => {
    const value = "§§§";
    field.validate(value);
    const result = field.validation;
    const failure = expectFailure(result);
    const errors = failure.errors;

    expect(errors).to.have.length(1);
    expect(errors[0].href).to.equal("#id");
    expect(errors[0].text.key).to.equal("prefix.errors.invalid");
    expect(errors[0].fields).to.be.undefined;
    expect(failure.value).to.equal(value);
  });

  it("returns failure with array of errors for input that is too long", () => {
    const value = "a".repeat(maxLength + 1);
    field.validate(value);
    const result = field.validation;
    const failure = expectFailure(result);
    const errors = failure.errors;

    expect(errors).to.have.length(1);
    expect(errors[0].href).to.equal("#id");
    expect(errors[0].text.key).to.equal("prefix.errors.length");
    expect(errors[0].text.args).to.deep.equal({ length: 10 });
    expect(errors[0].fields).to.be.undefined;
    expect(failure.value).to.equal(value);
  });

  it("returns success for input that is appropriate length after trim", () => {
    const value = "a".repeat(maxLength);
    field.validate(`${value} `);
    const result = field.validation;

    const success = expectSuccess(result);

    expect(success.value).to.equal(value);
  });
});

describe("validateBooleanInput", () => {
  const field: BooleanField = new BooleanField("prefix", "fieldName", "id");

  it("returns success for valid yes input", () => {
    field.validate("yes");
    const result = field.validation;

    const success = expectSuccess(result);

    expect(success.value).to.equal(true);
  });

  it("returns success for valid no input", () => {
    field.validate("no");
    const result = field.validation;

    const success = expectSuccess(result);

    expect(success.value).to.equal(false);
  });

  it("returns failure with array of errors for empty input", () => {
    const value = "";
    field.validate(value);
    const result = field.validation;
    const failure = expectFailure(result);
    const errors = failure.errors;

    expect(errors).to.have.length(1);
    expect(errors[0].href).to.equal("#id");
    expect(errors[0].text.key).to.equal("prefix.errors.empty");
    expect(errors[0].fields).to.be.undefined;
    expect(failure.value).to.equal(value);
  });
});

describe("validateMoneyInput", () => {
  const field: MoneyField = new MoneyField("prefix", "fieldName", "id");

  it("returns success for valid input", () => {
    field.validate("1.23");
    const result = field.validation;

    const success = expectSuccess(result);

    expect(success.value).to.equal(1.23);
  });

  it("returns failure with array of errors for empty input", () => {
    const value = "";
    field.validate(value);
    const result = field.validation;
    const failure = expectFailure(result);
    const errors = failure.errors;

    expect(errors).to.have.length(1);
    expect(errors[0].href).to.equal("#id");
    expect(errors[0].text.key).to.equal("prefix.errors.empty");
    expect(errors[0].fields).to.be.undefined;
    expect(failure.value).to.equal(value);
  });

  it("returns failure with array of errors for non-numeric input", () => {
    const value = "foo";
    field.validate(value);
    const result = field.validation;
    const failure = expectFailure(result);
    const errors = failure.errors;

    expect(errors).to.have.length(1);
    expect(errors[0].href).to.equal("#id");
    expect(errors[0].text.key).to.equal("prefix.errors.invalid");
    expect(errors[0].fields).to.be.undefined;
    expect(failure.value).to.equal(value);
  });

  it("returns failure with array of errors for numeric input with too many decimal places", () => {
    const value = "1.123";
    field.validate(value);
    const result = field.validation;
    const failure = expectFailure(result);
    const errors = failure.errors;

    expect(errors).to.have.length(1);
    expect(errors[0].href).to.equal("#id");
    expect(errors[0].text.key).to.equal("prefix.errors.pence");
    expect(errors[0].fields).to.be.undefined;
    expect(failure.value).to.equal(value);
  });
});

describe("validateDateInput", () => {
  const field: DateField = new DateField("prefix", "fieldName", "id");

  it("returns success for valid input", () => {
    field.validate({
      day: "1",
      month: "1",
      year: "2000",
    });
    const result = field.validation;

    const success = expectSuccess(result);
    const date = success.value;

    expect(date.year).to.equal(2000);
    expect(date.month).to.equal(1);
    expect(date.day).to.equal(1);
  });

  it("returns failure with array of errors for empty day", () => {
    const value = {
      day: "",
      month: "1",
      year: "2000",
    };
    field.validate(value);
    const result = field.validation;
    const failure = expectFailure(result);
    const errors = failure.errors;

    expect(errors).to.have.length(1);
    expect(errors[0].href).to.equal("#id-day");
    expect(errors[0].text.key).to.equal("prefix.errors.incomplete.day");
    expect(errors[0].fields).to.deep.equal(["day"]);
    expect(failure.value).to.equal(value);
  });

  it("returns failure with array of errors for empty month", () => {
    const value = {
      day: "1",
      month: "",
      year: "2000",
    };
    field.validate(value);
    const result = field.validation;
    const failure = expectFailure(result);
    const errors = failure.errors;

    expect(errors).to.have.length(1);
    expect(errors[0].href).to.equal("#id-month");
    expect(errors[0].text.key).to.equal("prefix.errors.incomplete.month");
    expect(errors[0].fields).to.deep.equal(["month"]);
    expect(failure.value).to.equal(value);
  });

  it("returns failure with array of errors for empty year", () => {
    const value = {
      day: "1",
      month: "1",
      year: "",
    };
    field.validate(value);
    const result = field.validation;
    const failure = expectFailure(result);
    const errors = failure.errors;

    expect(errors).to.have.length(1);
    expect(errors[0].href).to.equal("#id-year");
    expect(errors[0].text.key).to.equal("prefix.errors.incomplete.year");
    expect(errors[0].fields).to.deep.equal(["year"]);
    expect(failure.value).to.equal(value);
  });

  it("returns failure with array of errors for empty day and month", () => {
    const value = {
      day: "",
      month: "",
      year: "2000",
    };
    field.validate(value);
    const result = field.validation;
    const failure = expectFailure(result);
    const errors = failure.errors;

    expect(errors).to.have.length(1);
    expect(errors[0].href).to.equal("#id-day");
    expect(errors[0].text.key).to.equal("prefix.errors.incomplete.dayAndMonth");
    expect(errors[0].fields).to.deep.equal(["day", "month"]);
    expect(failure.value).to.equal(value);
  });

  it("returns failure with array of errors for empty day and year", () => {
    const value = {
      day: "",
      month: "1",
      year: "",
    };
    field.validate(value);
    const result = field.validation;
    const failure = expectFailure(result);
    const errors = failure.errors;

    expect(errors).to.have.length(1);
    expect(errors[0].href).to.equal("#id-day");
    expect(errors[0].text.key).to.equal("prefix.errors.incomplete.dayAndYear");
    expect(errors[0].fields).to.deep.equal(["day", "year"]);
    expect(failure.value).to.equal(value);
  });

  it("returns failure with array of errors for empty month and year", () => {
    const value = {
      day: "1",
      month: "",
      year: "",
    };
    field.validate(value);
    const result = field.validation;
    const failure = expectFailure(result);
    const errors = failure.errors;

    expect(errors).to.have.length(1);
    expect(errors[0].href).to.equal("#id-month");
    expect(errors[0].text.key).to.equal(
      "prefix.errors.incomplete.monthAndYear",
    );
    expect(errors[0].fields).to.deep.equal(["month", "year"]);
    expect(failure.value).to.equal(value);
  });

  it("returns failure with array of errors for non-numeric inputs", () => {
    const inputs = [
      {
        day: "foo",
        month: "1",
        year: "2000",
      },
      {
        day: "1",
        month: "foo",
        year: "2000",
      },
      {
        day: "1",
        month: "1",
        year: "foo",
      },
    ];

    inputs.forEach((input) => {
      field.validate(input);
      const result = field.validation;
      const failure = expectFailure(result);
      const errors = failure.errors;

      expect(errors).to.have.length(1);
      expect(errors[0].href).to.equal("#id-day");
      expect(errors[0].text.key).to.equal("prefix.errors.invalid");
      expect(errors[0].fields).to.deep.equal(["day", "month", "year"]);
      expect(failure.value).to.equal(input);
    });
  });

  it("returns failure with array of errors for invalid date", () => {
    const inputs = [
      {
        day: "29",
        month: "2",
        year: "2025",
      },
      {
        day: "32",
        month: "1",
        year: "2000",
      },
      {
        day: "1",
        month: "13",
        year: "2000",
      },
    ];

    inputs.forEach((input) => {
      field.validate(input);
      const result = field.validation;
      const failure = expectFailure(result);
      const errors = failure.errors;

      expect(errors).to.have.length(1);
      expect(errors[0].href).to.equal("#id-day");
      expect(errors[0].text.key).to.equal("prefix.errors.invalid");
      expect(errors[0].fields).to.deep.equal(["day", "month", "year"]);
      expect(failure.value).to.equal(input);
    });
  });

  it("returns failure with array of errors for future date", () => {
    const today = new Date();

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const value = {
      day: tomorrow.getDate().toString(),
      month: (tomorrow.getMonth() + 1).toString(),
      year: tomorrow.getFullYear().toString(),
    };

    field.validate(value);
    const result = field.validation;
    const failure = expectFailure(result);
    const errors = failure.errors;

    expect(errors).to.have.length(1);
    expect(errors[0].href).to.equal("#id-day");
    expect(errors[0].text.key).to.equal("prefix.errors.future");
    expect(errors[0].fields).to.deep.equal(["day", "month", "year"]);
    expect(failure.value).to.equal(value);
  });
});
