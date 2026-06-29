import { expect } from "chai";
import { describe, it } from "mocha";
import {
  getStringValue,
  validateBooleanInput,
  validateDateInput,
  validateMoneyInput,
  validateStringInput,
  ValidationFailure,
  ValidationResult,
  ValidationSuccess,
} from "#src/helpers/validation.js";

export function expectSuccess<T>(result: ValidationResult<T>): ValidationSuccess<T> {
  expect(result.isValid).to.equal(true);
  if (!result.isValid) {
    throw new Error("Expected success but got failure");
  }
  return result;
}

export function expectFailure<T>(result: ValidationResult<T>): ValidationFailure {
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
  it("returns success for valid input", () => {
    const result = validateStringInput(
      "foo",
      "fieldName",
      "id",
      "prefix",
      /^[A-Za-z]+$/,
    );

    const success = expectSuccess(result);

    expect(success.value).to.equal("foo");
  });

  it("returns failure with array of errors for empty input", () => {
    const result = validateStringInput(
      "",
      "fieldName",
      "id",
      "prefix",
      /^[A-Za-z]+$/,
    );

    const errors = expectFailure(result).errors;

    expect(errors).to.have.length(1);
    expect(errors[0].fieldName).to.equal("fieldName");
    expect(errors[0].href).to.equal("#id");
    expect(errors[0].text.key).to.equal("prefix.errors.empty");
    expect(errors[0].fields).to.be.undefined;
  });

  it("returns failure with array of errors for input that fails against regex", () => {
    const result = validateStringInput(
      "§§§",
      "fieldName",
      "id",
      "prefix",
      /^[A-Za-z]+$/,
    );

    const errors = expectFailure(result).errors;

    expect(errors).to.have.length(1);
    expect(errors[0].fieldName).to.equal("fieldName");
    expect(errors[0].href).to.equal("#id");
    expect(errors[0].text.key).to.equal("prefix.errors.invalid");
    expect(errors[0].fields).to.be.undefined;
  });
});

describe("validateBooleanInput", () => {
  it("returns success for valid yes input", () => {
    const result = validateBooleanInput("yes", "fieldName", "id", "prefix");

    const success = expectSuccess(result);

    expect(success.value).to.equal(true);
  });

  it("returns success for valid no input", () => {
    const result = validateBooleanInput("no", "fieldName", "id", "prefix");

    const success = expectSuccess(result);

    expect(success.value).to.equal(false);
  });

  it("returns failure with array of errors for empty input", () => {
    const result = validateBooleanInput("", "fieldName", "id", "prefix");

    const errors = expectFailure(result).errors;

    expect(errors).to.have.length(1);
    expect(errors[0].fieldName).to.equal("fieldName");
    expect(errors[0].href).to.equal("#id");
    expect(errors[0].text.key).to.equal("prefix.errors.empty");
    expect(errors[0].fields).to.be.undefined;
  });
});

describe("validateMoneyInput", () => {
  it("returns success for valid input", () => {
    const result = validateMoneyInput("1.23", "fieldName", "id", "prefix");

    const success = expectSuccess(result);

    expect(success.value).to.equal(1.23);
  });

  it("returns failure with array of errors for empty input", () => {
    const result = validateMoneyInput("", "fieldName", "id", "prefix");

    const errors = expectFailure(result).errors;

    expect(errors).to.have.length(1);
    expect(errors[0].fieldName).to.equal("fieldName");
    expect(errors[0].href).to.equal("#id");
    expect(errors[0].text.key).to.equal("prefix.errors.empty");
    expect(errors[0].fields).to.be.undefined;
  });

  it("returns failure with array of errors for non-numeric input", () => {
    const result = validateMoneyInput("foo", "fieldName", "id", "prefix");

    const errors = expectFailure(result).errors;

    expect(errors).to.have.length(1);
    expect(errors[0].fieldName).to.equal("fieldName");
    expect(errors[0].href).to.equal("#id");
    expect(errors[0].text.key).to.equal("prefix.errors.invalid");
    expect(errors[0].fields).to.be.undefined;
  });

  it("returns failure with array of errors for numeric input with too many decimal places", () => {
    const result = validateMoneyInput("1.123", "fieldName", "id", "prefix");

    const errors = expectFailure(result).errors;

    expect(errors).to.have.length(1);
    expect(errors[0].fieldName).to.equal("fieldName");
    expect(errors[0].href).to.equal("#id");
    expect(errors[0].text.key).to.equal("prefix.errors.pence");
    expect(errors[0].fields).to.be.undefined;
  });
});

describe("validateDateInput", () => {
  it("returns success for valid input", () => {
    const result = validateDateInput(
      {
        day: "1",
        month: "1",
        year: "2000",
      },
      "fieldName",
      "id",
      "prefix",
    );

    const success = expectSuccess(result);
    const date = success.value;

    expect(date.getFullYear()).to.equal(2000);
    expect(date.getMonth()).to.equal(0);
    expect(date.getDate()).to.equal(1);
  });

  it("returns failure with array of errors for empty day", () => {
    const result = validateDateInput(
      {
        day: "",
        month: "1",
        year: "2000",
      },
      "fieldName",
      "id",
      "prefix",
    );

    const errors = expectFailure(result).errors;

    expect(errors).to.have.length(1);
    expect(errors[0].fieldName).to.equal("fieldName");
    expect(errors[0].href).to.equal("#id-day");
    expect(errors[0].text.key).to.equal("prefix.errors.incomplete.day");
    expect(errors[0].fields).to.deep.equal(["day"]);
  });

  it("returns failure with array of errors for empty month", () => {
    const result = validateDateInput(
      {
        day: "1",
        month: "",
        year: "2000",
      },
      "fieldName",
      "id",
      "prefix",
    );

    const errors = expectFailure(result).errors;

    expect(errors).to.have.length(1);
    expect(errors[0].fieldName).to.equal("fieldName");
    expect(errors[0].href).to.equal("#id-month");
    expect(errors[0].text.key).to.equal("prefix.errors.incomplete.month");
    expect(errors[0].fields).to.deep.equal(["month"]);
  });

  it("returns failure with array of errors for empty year", () => {
    const result = validateDateInput(
      {
        day: "1",
        month: "1",
        year: "",
      },
      "fieldName",
      "id",
      "prefix",
    );

    const errors = expectFailure(result).errors;

    expect(errors).to.have.length(1);
    expect(errors[0].fieldName).to.equal("fieldName");
    expect(errors[0].href).to.equal("#id-year");
    expect(errors[0].text.key).to.equal("prefix.errors.incomplete.year");
    expect(errors[0].fields).to.deep.equal(["year"]);
  });

  it("returns failure with array of errors for empty day and month", () => {
    const result = validateDateInput(
      {
        day: "",
        month: "",
        year: "2000",
      },
      "fieldName",
      "id",
      "prefix",
    );

    const errors = expectFailure(result).errors;

    expect(errors).to.have.length(1);
    expect(errors[0].fieldName).to.equal("fieldName");
    expect(errors[0].href).to.equal("#id-day");
    expect(errors[0].text.key).to.equal("prefix.errors.incomplete.dayAndMonth");
    expect(errors[0].fields).to.deep.equal(["day", "month"]);
  });

  it("returns failure with array of errors for empty day and year", () => {
    const result = validateDateInput(
      {
        day: "",
        month: "1",
        year: "",
      },
      "fieldName",
      "id",
      "prefix",
    );

    const errors = expectFailure(result).errors;

    expect(errors).to.have.length(1);
    expect(errors[0].fieldName).to.equal("fieldName");
    expect(errors[0].href).to.equal("#id-day");
    expect(errors[0].text.key).to.equal("prefix.errors.incomplete.dayAndYear");
    expect(errors[0].fields).to.deep.equal(["day", "year"]);
  });

  it("returns failure with array of errors for empty month and year", () => {
    const result = validateDateInput(
      {
        day: "1",
        month: "",
        year: "",
      },
      "fieldName",
      "id",
      "prefix",
    );

    const errors = expectFailure(result).errors;

    expect(errors).to.have.length(1);
    expect(errors[0].fieldName).to.equal("fieldName");
    expect(errors[0].href).to.equal("#id-month");
    expect(errors[0].text.key).to.equal("prefix.errors.incomplete.monthAndYear");
    expect(errors[0].fields).to.deep.equal(["month", "year"]);
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
      }
    ];

    inputs.forEach((input) => {
      const result = validateDateInput(
        input,
        "fieldName",
        "id",
        "prefix",
      );

      const errors = expectFailure(result).errors;

      expect(errors).to.have.length(1);
      expect(errors[0].fieldName).to.equal("fieldName");
      expect(errors[0].href).to.equal("#id-day");
      expect(errors[0].text.key).to.equal("prefix.errors.invalid");
      expect(errors[0].fields).to.deep.equal(["day", "month", "year"]);
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
      }
    ];

    inputs.forEach((input) => {
      const result = validateDateInput(
        input,
        "fieldName",
        "id",
        "prefix",
      );

      const errors = expectFailure(result).errors;

      expect(errors).to.have.length(1);
      expect(errors[0].fieldName).to.equal("fieldName");
      expect(errors[0].href).to.equal("#id-day");
      expect(errors[0].text.key).to.equal("prefix.errors.invalid");
      expect(errors[0].fields).to.deep.equal(["day", "month", "year"]);
    });
  });

  it("returns failure with array of errors for future date", () => {
    const today = new Date();

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const result = validateDateInput(
      {
        day: tomorrow.getDate().toString(),
        month: (tomorrow.getMonth() + 1).toString(),
        year: tomorrow.getFullYear().toString(),
      },
      "fieldName",
      "id",
      "prefix",
    );

    const errors = expectFailure(result).errors;

    expect(errors).to.have.length(1);
    expect(errors[0].fieldName).to.equal("fieldName");
    expect(errors[0].href).to.equal("#id-day");
    expect(errors[0].text.key).to.equal("prefix.errors.future");
    expect(errors[0].fields).to.deep.equal(["day", "month", "year"]);
  });
});
