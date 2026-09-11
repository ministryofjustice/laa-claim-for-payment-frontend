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

      expect(expectSuccess(form.validation).value[name]).to.equal(
        1234.5,
      );
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

    it(`accepts ${name} at the default £25,000 maximum`, () => {
      const form = new ProfitCostBillLineForm();

      form.validate({
        ...validBody,
        [name]: "25000.00",
      });

      expect(expectSuccess(form.validation).value[name]).to.equal(
        25000,
      );
    });

    it(`rejects ${name} above the default maximum`, () => {
      const form = new ProfitCostBillLineForm();

      form.validate({
        ...validBody,
        [name]: "25000.01",
      });

      const errors = expectFailure(form.validation).errors;

      expect(errors).to.have.length(1);
      expect(errors[0].href).to.equal(`#${name}`);
      expect(errors[0].text).to.deep.equal({
        key: `pages.profitCostBillLine.${name}.errors.maximum`,
        args: { maximum: "£25,000.00" },
      });
    });

    it(`passes an explicitly supplied maximum to ${name}`, () => {
      const form = new ProfitCostBillLineForm();

      form.validate(
        { ...validBody, [name]: "10.51" },
        { [name]: 10.5 },
      );

      const errors = expectFailure(form.validation).errors;

      expect(errors).to.have.length(1);
      expect(errors[0].href).to.equal(`#${name}`);
      expect(errors[0].text).to.deep.equal({
        key: `pages.profitCostBillLine.${name}.errors.maximum`,
        args: { maximum: "£10.50" },
      });
    });
  }

  it("applies the default maximum independently to both fields", () => {
    const form = new ProfitCostBillLineForm();

    form.validate({
      ...validBody,
      actualNetProfitCostExcludingAdvocacy: "25000.00",
      actualNetAdvocacyCosts: "25000.00",
    });

    expectSuccess(form.validation);
  });

  it("accepts both fields exactly at distinct supplied maxima", () => {
    const form = new ProfitCostBillLineForm();

    form.validate(validBody, {
      actualNetProfitCostExcludingAdvocacy: 123.45,
      actualNetAdvocacyCosts: 156,
    });

    expectSuccess(form.validation);
  });

  it("reports both fields when both exceed their supplied maxima", () => {
    const form = new ProfitCostBillLineForm();

    form.validate(validBody, {
      actualNetProfitCostExcludingAdvocacy: 123.44,
      actualNetAdvocacyCosts: 155.99,
    });

    const errors = expectFailure(form.validation).errors;

    expect(errors.map(error => error.href)).to.deep.equal(
      moneyFields.map(name => `#${name}`),
    );

    expect(errors.map(error => error.text.args?.maximum)).to.deep.equal([
      "£123.44",
      "£155.99",
    ]);
  });
});