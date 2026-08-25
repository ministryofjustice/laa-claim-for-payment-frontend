import { expect } from "chai";
import { describe, it } from "mocha";
import {
  expectFailure,
  expectSuccess,
} from "#tests/unit/src/helpers/validationTest.spec.js";
import { ProfitCostBillLineForm } from "#src/helpers/profitCostBillLineValidation.js";

describe("profitCostBillLineValidation", () => {
  const validBody = {
    activityDateDay: "27",
    activityDateMonth: "3",
    activityDateYear: "2007",
    actualNetProfitCostExcludingAdvocacy: "123.45",
    actualNetAdvocacyCosts: "156.00",
    vatApplies: "yes",
    feeEarnerName: "John Smith",
  };

  it("returns valid when all fields are valid", () => {
    const form = new ProfitCostBillLineForm();

    form.validate(validBody);

    const result = form.validation;

    const success = expectSuccess(result);
    expect(success.value.activityDate.day).to.equal(27);
    expect(success.value.activityDate.month).to.equal(3);
    expect(success.value.activityDate.year).to.equal(2007);
    expect(success.value.actualNetProfitCostExcludingAdvocacy).to.equal(123.45);
    expect(success.value.actualNetAdvocacyCosts).to.equal(156.0);
    expect(success.value.vatApplies).to.equal(true);
    expect(success.value.feeEarnerName).to.equal("John Smith");
  });

  it("returns error when activity date is empty", () => {
    const form = new ProfitCostBillLineForm();

    form.validate({
      ...validBody,
      activityDateDay: "",
      activityDateMonth: "",
      activityDateYear: "",
    });

    const result = form.validation;

    const failure = expectFailure(result);
    expect(failure.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.activityDate.errors.empty",
    );
  });

  it("returns error when activity date is incomplete", () => {
    const form = new ProfitCostBillLineForm();

    form.validate({
      ...validBody,
      activityDateDay: "27",
      activityDateMonth: "",
      activityDateYear: "2007",
    });

    const result = form.validation;

    const failure = expectFailure(result);
    expect(failure.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.activityDate.errors.incomplete.month",
    );
  });

  it("returns error when activity date is not a real date", () => {
    const form = new ProfitCostBillLineForm();

    form.validate({
      ...validBody,
      activityDateDay: "30",
      activityDateMonth: "2",
      activityDateYear: "2025",
    });

    const result = form.validation;

    const failure = expectFailure(result);
    expect(failure.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.activityDate.errors.invalid",
    );
  });

  it("allows 29 February in a leap year", () => {
    const form = new ProfitCostBillLineForm();

    form.validate({
      ...validBody,
      activityDateDay: "29",
      activityDateMonth: "2",
      activityDateYear: "2024",
    });

    const result = form.validation;

    const success = expectSuccess(result);
    expect(success.value.activityDate.day).to.equal(29);
    expect(success.value.activityDate.month).to.equal(2);
    expect(success.value.activityDate.year).to.equal(2024);
  });

  it("rejects 29 February in a non-leap year", () => {
    const form = new ProfitCostBillLineForm();

    form.validate({
      ...validBody,
      activityDateDay: "29",
      activityDateMonth: "2",
      activityDateYear: "2025",
    });

    const result = form.validation;

    const failure = expectFailure(result);
    expect(failure.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.activityDate.errors.invalid",
    );
  });

  it("returns error when activity date is in the future", () => {
    const nextYear = String(new Date().getFullYear() + 1);

    const form = new ProfitCostBillLineForm();

    form.validate({
      ...validBody,
      activityDateDay: "1",
      activityDateMonth: "1",
      activityDateYear: nextYear,
    });

    const result = form.validation;

    const failure = expectFailure(result);
    expect(failure.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.activityDate.errors.future",
    );
  });

  it("returns error when profit cost is empty", () => {
    const form = new ProfitCostBillLineForm();

    form.validate({
      ...validBody,
      actualNetProfitCostExcludingAdvocacy: "",
    });

    const result = form.validation;

    const failure = expectFailure(result);

    expect(failure.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.actualNetProfitCostExcludingAdvocacy.errors.empty",
    );
  });

  it("returns error when profit cost is not a number", () => {
    const form = new ProfitCostBillLineForm();

    form.validate({
      ...validBody,
      actualNetProfitCostExcludingAdvocacy: "abc",
    });

    const result = form.validation;

    const failure = expectFailure(result);

    expect(failure.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.actualNetProfitCostExcludingAdvocacy.errors.invalid",
    );
  });

  it("returns error when advocacy cost is empty", () => {
    const form = new ProfitCostBillLineForm();

    form.validate({
      ...validBody,
      actualNetAdvocacyCosts: "",
    });

    const result = form.validation;

    const failure = expectFailure(result);

    expect(failure.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.actualNetAdvocacyCosts.errors.empty",
    );
  });

  it("returns error when advocacy cost is not a number", () => {
    const form = new ProfitCostBillLineForm();

    form.validate({
      ...validBody,
      actualNetAdvocacyCosts: "abc",
    });

    const result = form.validation;

    const failure = expectFailure(result);

    expect(failure.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.actualNetAdvocacyCosts.errors.invalid",
    );
  });

  it("returns error when VAT is not selected", () => {
    const form = new ProfitCostBillLineForm();

    form.validate({
      ...validBody,
      vatApplies: undefined,
    });

    const result = form.validation;

    const failure = expectFailure(result);

    expect(failure.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.vatApplies.errors.empty",
    );
  });

  it("returns error when fee earner name is empty", () => {
    const form = new ProfitCostBillLineForm();

    form.validate({
      ...validBody,
      feeEarnerName: "",
    });

    const result = form.validation;

    const failure = expectFailure(result);

    expect(failure.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.feeEarnerName.errors.empty",
    );
  });

  it("returns error when fee earner name contains invalid characters", () => {
    const form = new ProfitCostBillLineForm();

    form.validate({
      ...validBody,
      feeEarnerName: "John Smith 123",
    });

    const result = form.validation;

    const failure = expectFailure(result);

    expect(failure.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.feeEarnerName.errors.invalid",
    );
  });
});
