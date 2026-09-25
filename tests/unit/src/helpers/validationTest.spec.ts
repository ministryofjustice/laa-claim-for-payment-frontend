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
  UploadField,
} from "#src/helpers/fields.js";
import { Category, Claim, CostType } from "#src/types/Claim.js";
import { V7Generator } from "uuidv7";
import { LocalDate } from "#src/types/date.js";

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
    const input = "foo";
    field.validate(input);
    const result = field.validation;

    expectSuccess(result);

    expect(field.getValue()).to.equal("foo");
  });

  it("returns failure with array of errors for empty input", () => {
    const input = "";
    field.validate(input);
    const result = field.validation;

    const failure = expectFailure(result);
    const errors = failure.errors;

    expect(field.getValue()).to.equal(input);
    expect(errors).to.have.length(1);
    expect(errors[0].href).to.equal("#id");
    expect(errors[0].text.key).to.equal("prefix.errors.empty");
    expect(errors[0].fields).to.be.undefined;
  });

  it("returns failure with array of errors for input that fails against regex", () => {
    const input = "§§§";
    field.validate(input);
    const result = field.validation;

    const failure = expectFailure(result);
    const errors = failure.errors;

    expect(field.getValue()).to.equal(input);
    expect(errors).to.have.length(1);
    expect(errors[0].href).to.equal("#id");
    expect(errors[0].text.key).to.equal("prefix.errors.invalid");
    expect(errors[0].fields).to.be.undefined;
  });

  it("returns failure with array of errors for input that is too long", () => {
    const input = "a".repeat(maxLength + 1);
    field.validate(input);
    const result = field.validation;

    const failure = expectFailure(result);
    const errors = failure.errors;

    expect(field.getValue()).to.equal(input);
    expect(errors).to.have.length(1);
    expect(errors[0].href).to.equal("#id");
    expect(errors[0].text.key).to.equal("prefix.errors.length");
    expect(errors[0].text.args).to.deep.equal({ length: 10 });
    expect(errors[0].fields).to.be.undefined;
  });

  it("returns success for input that is appropriate length after trim", () => {
    const input = "a".repeat(maxLength);
    field.validate(`${input} `);
    const result = field.validation;

    expectSuccess(result);

    expect(field.getValue()).to.equal(input);
  });
});

describe("validateBooleanInput", () => {
  const field: BooleanField = new BooleanField("prefix", "fieldName", "id");

  it("returns success for valid yes input", () => {
    field.validate("yes");

    expect(field.getValue()).to.equal(true);
  });

  it("returns success for valid no input", () => {
    field.validate("no");

    expect(field.getValue()).to.equal(false);
  });

  it("returns failure with array of errors for empty input", () => {
    const input = "";
    field.validate(input);
    const result = field.validation;

    const failure = expectFailure(result);
    const errors = failure.errors;

    expect(field.getValue()).to.equal(input);
    expect(errors).to.have.length(1);
    expect(errors[0].href).to.equal("#id");
    expect(errors[0].text.key).to.equal("prefix.errors.empty");
    expect(errors[0].fields).to.be.undefined;
  });

  it("returns failure with array of errors for invalid input", () => {
    const input = "maybe";
    field.validate(input);
    const result = field.validation;

    const failure = expectFailure(result);
    const errors = failure.errors;

    expect(field.getValue()).to.equal(input);
    expect(errors).to.have.length(1);
    expect(errors[0].href).to.equal("#id");
    expect(errors[0].text.key).to.equal("prefix.errors.empty");
    expect(errors[0].fields).to.be.undefined;
  });
});

describe("validateMoneyInput", () => {
  const accepted: Array<[string, number]> = [
    ["10", 10],
    ["10.5", 10.5],
    ["10.50", 10.5],
    ["0", 0],
    ["0.00", 0],
    ["0.01", 0.01],
    ["£1,234.50", 1234.5],
    ["  £ 1 234.50  ", 1234.5],
    ["1\u00a0234.50", 1234.5],
    ["1\u202f234.50", 1234.5],
    ["24999.99", 24999.99],
    ["25000", 25000],
    ["25000.0", 25000],
    ["£25,000.00", 25000],
  ];

  for (const [input, expected] of accepted) {
    it(`accepts ${JSON.stringify(input)} as ${expected}`, () => {
      const field = new MoneyField("prefix", "fieldName", "id");

      field.validate(input);

      expect(expectSuccess(field.validation).value).to.equal(expected);
    });
  }

  const rejected: Array<[unknown, string]> = [
    ["", "empty"],
    ["   ", "empty"],
    [undefined, "empty"],
    ["abc", "invalid"],
    ["£", "invalid"],
    ["££10", "invalid"],
    ["10£5", "invalid"],
    ["1,23.50", "invalid"],
    ["1,,234", "invalid"],
    ["1.2.3", "invalid"],
    ["1e3", "invalid"],
    ["Infinity", "invalid"],
    ["NaN", "invalid"],
    ["-10", "negative"],
    ["-10.50", "negative"],
    ["-0.5", "negative"],
    ["£-10", "negative"],
    ["-£10", "negative"],
    ["10.", "tooFewDecimals"],
    ["£1,234.", "tooFewDecimals"],
    ["10.123", "tooManyDecimals"],
    ["£1,234.567", "tooManyDecimals"],
    ["10.000", "tooManyDecimals"],
    ["  -£1,234.50  ", "negative"],
    ["9".repeat(400), "invalid"],
  ];

  for (const [input, reason] of rejected) {
    it(`rejects ${JSON.stringify(input)} with ${reason}`, () => {
      const field = new MoneyField("prefix", "fieldName", "id");

      field.validate(input);

      const failure = expectFailure(field.validation);

      expect(failure.errors).to.have.length(1);
      expect(failure.errors[0].href).to.equal("#id");
      expect(failure.errors[0].text.key).to.equal(
        `prefix.errors.${reason}`,
      );
      expect(field.getValue()).to.equal(input);
    });
  }

  for (const input of [
    "25000.01",
    " £25,000.01 ",
    "25001",
    "100000",
  ]) {
    it(`rejects ${JSON.stringify(input)} above the £25,000 maximum`, () => {
      const field = new MoneyField("prefix", "fieldName", "id");

      field.validate(input);

      const failure = expectFailure(field.validation);

      expect(failure.errors).to.have.length(1);
      expect(failure.errors[0].href).to.equal("#id");
      expect(failure.errors[0].text).to.deep.equal({
        key: "prefix.errors.maximum",
        args: { maximum: "£25,000.00" },
      });
      expect(field.getValue()).to.equal(input);
    });
  }

  it("enforces the £25,000 maximum on every validation and clears previous errors", () => {
    const field = new MoneyField("prefix", "fieldName", "id");

    field.validate("25000.00");

    expect(expectSuccess(field.validation).value).to.equal(25000);
    expect(field.getError()).to.be.undefined;

    field.validate("25000.01");

    const failure = expectFailure(field.validation);

    expect(failure.errors).to.have.length(1);
    expect(failure.errors[0].text).to.deep.equal({
      key: "prefix.errors.maximum",
      args: { maximum: "£25,000.00" },
    });
    expect(field.getValue()).to.equal("25000.01");

    field.validate("24999.99");

    expect(expectSuccess(field.validation).value).to.equal(24999.99);
    expect(field.getError()).to.be.undefined;
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
    expectSuccess(result);

    const date = field.getValue();

    expect(date!.year).to.equal(2000);
    expect(date!.month).to.equal(1);
    expect(date!.day).to.equal(1);
  });

  it("returns failure with array of errors for empty day", () => {
    const input = {
      day: "",
      month: "1",
      year: "2000",
    };
    field.validate(input);
    const result = field.validation;

    const failure = expectFailure(result);
    const errors = failure.errors;

    expect(field.getValue()).to.equal(input);
    expect(errors).to.have.length(1);
    expect(errors[0].href).to.equal("#id-day");
    expect(errors[0].text.key).to.equal("prefix.errors.incomplete.day");
    expect(errors[0].fields).to.deep.equal(["day"]);
  });

  it("returns failure with array of errors for empty month", () => {
    const input = {
      day: "1",
      month: "",
      year: "2000",
    };
    field.validate(input);
    const result = field.validation;

    const failure = expectFailure(result);
    const errors = failure.errors;

    expect(field.getValue()).to.equal(input);
    expect(errors).to.have.length(1);
    expect(errors[0].href).to.equal("#id-month");
    expect(errors[0].text.key).to.equal("prefix.errors.incomplete.month");
    expect(errors[0].fields).to.deep.equal(["month"]);
  });

  it("returns failure with array of errors for empty year", () => {
    const input = {
      day: "1",
      month: "1",
      year: "",
    };
    field.validate(input);
    const result = field.validation;

    const failure = expectFailure(result);
    const errors = failure.errors;

    expect(field.getValue()).to.equal(input);
    expect(errors).to.have.length(1);
    expect(errors[0].href).to.equal("#id-year");
    expect(errors[0].text.key).to.equal("prefix.errors.incomplete.year");
    expect(errors[0].fields).to.deep.equal(["year"]);
  });

  it("returns failure with array of errors for empty day and month", () => {
    const input = {
      day: "",
      month: "",
      year: "2000",
    };
    field.validate(input);
    const result = field.validation;

    const failure = expectFailure(result);
    const errors = failure.errors;

    expect(field.getValue()).to.equal(input);
    expect(errors).to.have.length(1);
    expect(errors[0].href).to.equal("#id-day");
    expect(errors[0].text.key).to.equal("prefix.errors.incomplete.dayAndMonth");
    expect(errors[0].fields).to.deep.equal(["day", "month"]);
  });

  it("returns failure with array of errors for empty day and year", () => {
    const input = {
      day: "",
      month: "1",
      year: "",
    };
    field.validate(input);
    const result = field.validation;

    const failure = expectFailure(result);
    const errors = failure.errors;

    expect(field.getValue()).to.equal(input);
    expect(errors).to.have.length(1);
    expect(errors[0].href).to.equal("#id-day");
    expect(errors[0].text.key).to.equal("prefix.errors.incomplete.dayAndYear");
    expect(errors[0].fields).to.deep.equal(["day", "year"]);
  });

  it("returns failure with array of errors for empty month and year", () => {
    const input = {
      day: "1",
      month: "",
      year: "",
    };
    field.validate(input);
    const result = field.validation;

    const failure = expectFailure(result);
    const errors = failure.errors;

    expect(field.getValue()).to.equal(input);
    expect(errors).to.have.length(1);
    expect(errors[0].href).to.equal("#id-month");
    expect(errors[0].text.key).to.equal(
      "prefix.errors.incomplete.monthAndYear",
    );
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
      },
    ];

    inputs.forEach((input) => {
      field.validate(input);
      const result = field.validation;

      const failure = expectFailure(result);
      const errors = failure.errors;

      expect(field.getValue()).to.equal(input);
      expect(errors).to.have.length(1);
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
      },
    ];

    inputs.forEach((input) => {
      field.validate(input);
      const result = field.validation;

      const failure = expectFailure(result);
      const errors = failure.errors;

      expect(field.getValue()).to.equal(input);
      expect(errors).to.have.length(1);
      expect(errors[0].href).to.equal("#id-day");
      expect(errors[0].text.key).to.equal("prefix.errors.invalid");
      expect(errors[0].fields).to.deep.equal(["day", "month", "year"]);
    });
  });

  it("returns failure with array of errors for future date", () => {
    const today = new Date();

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const input = {
      day: tomorrow.getDate().toString(),
      month: (tomorrow.getMonth() + 1).toString(),
      year: tomorrow.getFullYear().toString(),
    };

    field.validate(input);
    const result = field.validation;

    const failure = expectFailure(result);
    const errors = failure.errors;

    expect(field.getValue()).to.equal(input);
    expect(errors).to.have.length(1);
    expect(errors[0].href).to.equal("#id-day");
    expect(errors[0].text.key).to.equal("prefix.errors.future");
    expect(errors[0].fields).to.deep.equal(["day", "month", "year"]);
  });
});

describe("validateUpload", () => {
  const claimId = new V7Generator().generate();
  const lineItemId = new V7Generator().generate();
  const evidenceId = new V7Generator().generate();

  const field: UploadField = new UploadField(
    "prefix",
    "fieldName",
    "id",
  );

  it("returns success for claim with no line items", () => {
    const input = new Claim({
      id: claimId.toString(),
    });
    field.validate(input);
    const result = field.validation;

    expectSuccess(result);

    expect(field.getValue()).to.deep.equal([]);
  });

  it("returns success for claim with line items that require evidence and have evidence", () => {
    const input = new Claim({
      id: claimId.toString(),
      costType: CostType.EXPERT_COST,
      lineItems: [
        {
          id: lineItemId.toString(),
          title: "Line item >= threshold",
          category: Category.DISBURSEMENT,
          date: new LocalDate(29, 7, 2026),
          actualNetValue: 20,
          vatApplicable: false,
          feeEarnerName: "John Smith",
          evidenceItems: [],
        },
      ],
      evidence: [
        {
          id: evidenceId.toString(),
          fileKey: "sample.pdf",
          fileSize: 1024,
          submittedOn: "2026-06-17T10:20:05Z",
        },
      ],
    });
    field.validate(input);
    const result = field.validation;

    expectSuccess(result);

    expect(field.getValue()).to.deep.equal(input.evidence);
  });

  it("returns failure with array of errors for claim that requires evidence but has none", () => {
    const input = new Claim({
      id: claimId.toString(),
      costType: CostType.EXPERT_COST,
      lineItems: [
        {
          id: lineItemId.toString(),
          title: "Line item >= threshold",
          category: Category.DISBURSEMENT,
          date: new LocalDate(29, 7, 2026),
          actualNetValue: 20,
          vatApplicable: false,
          feeEarnerName: "John Smith",
          evidenceItems: [],
        },
      ],
    });
    field.validate(input);
    const result = field.validation;

    const failure = expectFailure(result);
    const errors = failure.errors;

    expect(field.getValue()).to.equal(input);
    expect(errors).to.have.length(1);
    expect(errors[0].href).to.equal("#id");
    expect(errors[0].text.key).to.equal("prefix.errors.empty");
    expect(errors[0].fields).to.be.undefined;
  });
});
