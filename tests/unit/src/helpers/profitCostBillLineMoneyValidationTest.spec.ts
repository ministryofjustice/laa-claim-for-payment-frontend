import { expect } from "chai";
import { describe, it } from "mocha";
import { ProfitCostBillLineForm } from "#src/helpers/profitCostBillLineValidation.js";
import {
  expectFailure,
  expectSuccess,
} from "#tests/unit/src/helpers/validationTest.spec.js";

describe("ProfitCostBillLineForm monetary validation", () => {
  const validBody = {
    activityDateDay: "27",
    activityDateMonth: "3",
    activityDateYear: "2007",
    actualNetProfitCostExcludingAdvocacy: "123.45",
    actualNetAdvocacyCosts: "156.00",
    vatApplies: "yes",
    feeEarnerName: "John Smith",
  };

  const moneyFields = [
    "actualNetProfitCostExcludingAdvocacy",
    "actualNetAdvocacyCosts",
  ] as const;

  for (const name of moneyFields) {
    it(`normalises pasted currency in ${name}`, () => {
      const form = new ProfitCostBillLineForm();

      form.validate({
        ...validBody,
        [name]: "£1,234.5",
      });

      expect(expectSuccess(form.validation).value[name]).to.equal(1234.5);
    });

    for (const [input, reason] of [
      ["", "empty"],
      ["abc", "invalid"],
      ["-10", "negative"],
      ["10.123", "pence"],
    ]) {
      it(`reports ${reason} against ${name}`, () => {
        const form = new ProfitCostBillLineForm();

        form.validate({
          ...validBody,
          [name]: input,
        });

        const errors = expectFailure(form.validation).errors;

        expect(errors).to.have.length(1);
        expect(errors[0].href).to.equal(`#${name}`);
        expect(errors[0].text.key).to.equal(
          `pages.profitCostBillLine.${name}.errors.${reason}`,
        );
        expect(form.fields[name].getValue()).to.equal(input);
      });
    }

    const acceptedAmounts: Array<[string, number]> = [
      ["0.00", 0],
      ["0.01", 0.01],
      ["10", 10],
      ["10.5", 10.5],
      ["10.50", 10.5],
      ["24999.99", 24999.99],
      ["25000", 25000],
      ["£25,000.00", 25000],
    ];

    for (const [input, expected] of acceptedAmounts) {
      it(`accepts ${input} in ${name} within the £25,000 maximum`, () => {
        const form = new ProfitCostBillLineForm();

        form.validate({
          ...validBody,
          [name]: input,
        });

        expect(expectSuccess(form.validation).value[name]).to.equal(expected);
      });
    }

    for (const input of ["25000.01", " £25,000.01 ", "25001"]) {
      it(`rejects ${JSON.stringify(input)} in ${name} above £25,000`, () => {
        const form = new ProfitCostBillLineForm();

        form.validate({
          ...validBody,
          [name]: input,
        });

        const errors = expectFailure(form.validation).errors;

        expect(errors).to.have.length(1);
        expect(errors[0].href).to.equal(`#${name}`);
        expect(errors[0].text).to.deep.equal({
          key: `pages.profitCostBillLine.${name}.errors.maximum`,
          args: { maximum: "£25,000.00" },
        });
        expect(form.fields[name].getValue()).to.equal(input);

        expect(form.getErrorSummary()?.errorList).to.deep.equal([
          {
            href: errors[0].href,
            text: errors[0].text,
          },
        ]);
      });
    }
  }

  it("applies the £25,000 maximum independently to both fields", () => {
    const form = new ProfitCostBillLineForm();

    form.validate({
      ...validBody,
      actualNetProfitCostExcludingAdvocacy: "25000.00",
      actualNetAdvocacyCosts: "25000.00",
    });

    const result = expectSuccess(form.validation);

    expect(result.value.actualNetProfitCostExcludingAdvocacy).to.equal(25000);
    expect(result.value.actualNetAdvocacyCosts).to.equal(25000);
  });

  it("reports both fields when both exceed £25,000", () => {
    const form = new ProfitCostBillLineForm();

    form.validate({
      ...validBody,
      actualNetProfitCostExcludingAdvocacy: "25000.01",
      actualNetAdvocacyCosts: "25000.01",
    });

    const errors = expectFailure(form.validation).errors;

    expect(errors).to.have.length(2);

    expect(errors.map((error) => error.href)).to.have.members(
      moneyFields.map((name) => `#${name}`),
    );

    for (const name of moneyFields) {
      const error = errors.find((item) => item.href === `#${name}`);

      expect(error?.text).to.deep.equal({
        key: `pages.profitCostBillLine.${name}.errors.maximum`,
        args: { maximum: "£25,000.00" },
      });
      expect(form.fields[name].getValue()).to.equal("25000.01");
    }
  });
});