import { expect } from "chai";
import { describe, it } from "mocha";
import {
  getStringValue,
  validateBooleanInput,
  validateDateInput,
  validateMoneyInput,
  validateStringInput,
} from "#src/helpers/validation.js";

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
  it("returns empty array of errors for valid input", () => {
    const result = validateStringInput(
      "foo",
      "fieldName",
      "id",
      "prefix",
      /^[A-Za-z]+$/,
    );

    expect(result).to.be.empty;
  });

  it("returns array of errors for empty input", () => {
    const result = validateStringInput(
      "",
      "fieldName",
      "id",
      "prefix",
      /^[A-Za-z]+$/,
    );

    expect(result).to.have.length(1);
    expect(result[0].fieldName).to.equal("fieldName");
    expect(result[0].href).to.equal("#id");
    expect(result[0].text.key).to.equal("prefix.errors.empty");
    expect(result[0].fields).to.be.undefined;
  });

  it("returns array of errors for input that fails against regex", () => {
    const result = validateStringInput(
      "§§§",
      "fieldName",
      "id",
      "prefix",
      /^[A-Za-z]+$/,
    );

    expect(result).to.have.length(1);
    expect(result[0].fieldName).to.equal("fieldName");
    expect(result[0].href).to.equal("#id");
    expect(result[0].text.key).to.equal("prefix.errors.invalid");
    expect(result[0].fields).to.be.undefined;
  });
});

describe("validateBooleanInput", () => {
  it("returns empty array of errors for valid input", () => {
    const inputs = ["yes", "no"];

    inputs.forEach((input) => {
      const result = validateBooleanInput(input, "fieldName", "id", "prefix");

      expect(result).to.be.empty;
    });
  });

  it("returns array of errors for empty input", () => {
    const result = validateBooleanInput("", "fieldName", "id", "prefix");

    expect(result).to.have.length(1);
    expect(result[0].fieldName).to.equal("fieldName");
    expect(result[0].href).to.equal("#id");
    expect(result[0].text.key).to.equal("prefix.errors.empty");
    expect(result[0].fields).to.be.undefined;
  });
});

describe("validateMoneyInput", () => {
  it("returns empty array of errors for valid input", () => {
    const inputs = ["1", "1.0", "1.00", "1.23"];

    inputs.forEach((input) => {
      const result = validateMoneyInput(input, "fieldName", "id", "prefix");

      expect(result).to.be.empty;
    });
  });

  it("returns array of errors for empty input", () => {
    const result = validateMoneyInput("", "fieldName", "id", "prefix");

    expect(result).to.have.length(1);
    expect(result[0].fieldName).to.equal("fieldName");
    expect(result[0].href).to.equal("#id");
    expect(result[0].text.key).to.equal("prefix.errors.empty");
    expect(result[0].fields).to.be.undefined;
  });

  it("returns array of errors for non-numeric input", () => {
    const result = validateMoneyInput("foo", "fieldName", "id", "prefix");

    expect(result).to.have.length(1);
    expect(result[0].fieldName).to.equal("fieldName");
    expect(result[0].href).to.equal("#id");
    expect(result[0].text.key).to.equal("prefix.errors.invalid");
    expect(result[0].fields).to.be.undefined;
  });

  it("returns array of errors for numeric input with too many decimal places", () => {
    const result = validateMoneyInput("1.123", "fieldName", "id", "prefix");

    expect(result).to.have.length(1);
    expect(result[0].fieldName).to.equal("fieldName");
    expect(result[0].href).to.equal("#id");
    expect(result[0].text.key).to.equal("prefix.errors.pence");
    expect(result[0].fields).to.be.undefined;
  });
});

describe("validateDateInput", () => {
  it("returns empty array of errors for valid input", () => {
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

    expect(result).to.be.empty;
  });

  it("returns array of errors for empty day", () => {
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

    expect(result).to.have.length(1);
    expect(result[0].fieldName).to.equal("fieldName");
    expect(result[0].href).to.equal("#id-day");
    expect(result[0].text.key).to.equal("prefix.errors.incomplete.day");
    expect(result[0].fields).to.deep.equal(["day"]);
  });

  it("returns array of errors for empty month", () => {
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

    expect(result).to.have.length(1);
    expect(result[0].fieldName).to.equal("fieldName");
    expect(result[0].href).to.equal("#id-month");
    expect(result[0].text.key).to.equal("prefix.errors.incomplete.month");
    expect(result[0].fields).to.deep.equal(["month"]);
  });

  it("returns array of errors for empty year", () => {
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

    expect(result).to.have.length(1);
    expect(result[0].fieldName).to.equal("fieldName");
    expect(result[0].href).to.equal("#id-year");
    expect(result[0].text.key).to.equal("prefix.errors.incomplete.year");
    expect(result[0].fields).to.deep.equal(["year"]);
  });

  it("returns array of errors for empty day and month", () => {
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

    expect(result).to.have.length(1);
    expect(result[0].fieldName).to.equal("fieldName");
    expect(result[0].href).to.equal("#id-day");
    expect(result[0].text.key).to.equal("prefix.errors.incomplete.dayAndMonth");
    expect(result[0].fields).to.deep.equal(["day", "month"]);
  });

  it("returns array of errors for empty day and year", () => {
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

    expect(result).to.have.length(1);
    expect(result[0].fieldName).to.equal("fieldName");
    expect(result[0].href).to.equal("#id-day");
    expect(result[0].text.key).to.equal("prefix.errors.incomplete.dayAndYear");
    expect(result[0].fields).to.deep.equal(["day", "year"]);
  });

  it("returns array of errors for empty month and year", () => {
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

    expect(result).to.have.length(1);
    expect(result[0].fieldName).to.equal("fieldName");
    expect(result[0].href).to.equal("#id-month");
    expect(result[0].text.key).to.equal("prefix.errors.incomplete.monthAndYear");
    expect(result[0].fields).to.deep.equal(["month", "year"]);
  });

  it("returns array of errors for non-numeric inputs", () => {
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

      expect(result).to.have.length(1);
      expect(result[0].fieldName).to.equal("fieldName");
      expect(result[0].href).to.equal("#id-day");
      expect(result[0].text.key).to.equal("prefix.errors.invalid");
      expect(result[0].fields).to.deep.equal(["day", "month", "year"]);
    });
  });

  it("returns array of errors for invalid date", () => {
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

      expect(result).to.have.length(1);
      expect(result[0].fieldName).to.equal("fieldName");
      expect(result[0].href).to.equal("#id-day");
      expect(result[0].text.key).to.equal("prefix.errors.invalid");
      expect(result[0].fields).to.deep.equal(["day", "month", "year"]);
    });
  });

  it("returns array of errors for future date", () => {
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

    expect(result).to.have.length(1);
    expect(result[0].fieldName).to.equal("fieldName");
    expect(result[0].href).to.equal("#id-day");
    expect(result[0].text.key).to.equal("prefix.errors.future");
    expect(result[0].fields).to.deep.equal(["day", "month", "year"]);
  });
});
