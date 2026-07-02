import { expect } from "chai";
import { describe, it } from "mocha";
import { validateProfitCostBillLine } from "#src/helpers/profitCostBillLineValidation.js";
import {
  expectFailure,
  expectSuccess,
} from "#tests/unit/src/helpers/validationTest.spec.js";

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
    const result = validateProfitCostBillLine(validBody);

    const success = expectSuccess(result);
    expect(success.value.activityDate.getDate()).to.equal(27);
    expect(success.value.activityDate.getMonth()).to.equal(2);
    expect(success.value.activityDate.getFullYear()).to.equal(2007);
    expect(success.value.actualNetProfitCostExcludingAdvocacy).to.equal(123.45);
    expect(success.value.actualNetAdvocacyCosts).to.equal(156.0);
    expect(success.value.vatApplies).to.equal(true);
    expect(success.value.feeEarnerName).to.equal("John Smith");
  });

  it("returns error when activity date is empty", () => {
    const result = validateProfitCostBillLine({
      ...validBody,
      activityDateDay: "",
      activityDateMonth: "",
      activityDateYear: "",
    });

    const failure = expectFailure(result);
    expect(failure.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.activityDate.errors.empty",
    );
  });

  it("returns error when activity date is incomplete", () => {
    const result = validateProfitCostBillLine({
      ...validBody,
      activityDateDay: "27",
      activityDateMonth: "",
      activityDateYear: "2007",
    });

    const failure = expectFailure(result);
    expect(failure.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.activityDate.errors.incomplete.month",
    );
  });

  it("returns error when activity date is not a real date", () => {
    const result = validateProfitCostBillLine({
      ...validBody,
      activityDateDay: "30",
      activityDateMonth: "2",
      activityDateYear: "2025",
    });

    const failure = expectFailure(result);
    expect(failure.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.activityDate.errors.invalid",
    );
  });

  it("allows 29 February in a leap year", () => {
    const result = validateProfitCostBillLine({
      ...validBody,
      activityDateDay: "29",
      activityDateMonth: "2",
      activityDateYear: "2024",
    });

    expect(result.isValid).to.equal(true);
  });

  it("rejects 29 February in a non-leap year", () => {
    const result = validateProfitCostBillLine({
      ...validBody,
      activityDateDay: "29",
      activityDateMonth: "2",
      activityDateYear: "2025",
    });

    const failure = expectFailure(result);
    expect(failure.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.activityDate.errors.invalid",
    );
  });

  it("returns error when activity date is in the future", () => {
    const nextYear = String(new Date().getFullYear() + 1);

    const result = validateProfitCostBillLine({
      ...validBody,
      activityDateDay: "1",
      activityDateMonth: "1",
      activityDateYear: nextYear,
    });

    const failure = expectFailure(result);
    expect(failure.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.activityDate.errors.future",
    );
  });

  it("returns error when profit cost is empty", () => {
    const result = validateProfitCostBillLine({
      ...validBody,
      actualNetProfitCostExcludingAdvocacy: "",
    });

    const failure = expectFailure(result);

    expect(failure.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.actualNetProfitCostExcludingAdvocacy.errors.empty",
    );
  });

  it("returns error when profit cost is not a number", () => {
    const result = validateProfitCostBillLine({
      ...validBody,
      actualNetProfitCostExcludingAdvocacy: "abc",
    });

    const failure = expectFailure(result);

    expect(failure.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.actualNetProfitCostExcludingAdvocacy.errors.invalid",
    );
  });

  it("returns error when advocacy cost is empty", () => {
    const result = validateProfitCostBillLine({
      ...validBody,
      actualNetAdvocacyCosts: "",
    });

    const failure = expectFailure(result);

    expect(failure.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.actualNetAdvocacyCosts.errors.empty",
    );
  });

  it("returns error when advocacy cost is not a number", () => {
    const result = validateProfitCostBillLine({
      ...validBody,
      actualNetAdvocacyCosts: "abc",
    });

    const failure = expectFailure(result);

    expect(failure.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.actualNetAdvocacyCosts.errors.invalid",
    );
  });

  it("returns error when profit cost does not include pence", () => {
    const result = validateProfitCostBillLine({
      ...validBody,
      actualNetProfitCostExcludingAdvocacy: "123",
    });

    const failure = expectFailure(result);

    expect(failure.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.actualNetProfitCostExcludingAdvocacy.errors.pence",
    );
  });

  it("returns error when advocacy cost does not include pence", () => {
    const result = validateProfitCostBillLine({
      ...validBody,
      actualNetAdvocacyCosts: "156",
    });

    const failure = expectFailure(result);

    expect(failure.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.actualNetAdvocacyCosts.errors.pence",
    );
  });

  it("returns error when profit cost only has one decimal place", () => {
    const result = validateProfitCostBillLine({
      ...validBody,
      actualNetProfitCostExcludingAdvocacy: "123.4",
    });

    const failure = expectFailure(result);

    expect(failure.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.actualNetProfitCostExcludingAdvocacy.errors.pence",
    );
  });

  it("returns error when VAT is not selected", () => {
    const result = validateProfitCostBillLine({
      ...validBody,
      vatApplies: undefined,
    });

    const failure = expectFailure(result);

    expect(failure.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.vatApplies.errors.empty",
    );
  });

  it("returns error when fee earner name is empty", () => {
    const result = validateProfitCostBillLine({
      ...validBody,
      feeEarnerName: "",
    });

    const failure = expectFailure(result);

    expect(failure.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.feeEarnerName.errors.empty",
    );
  });

  it("returns error when fee earner name contains invalid characters", () => {
    const result = validateProfitCostBillLine({
      ...validBody,
      feeEarnerName: "John Smith 123",
    });

    const failure = expectFailure(result);

    expect(failure.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.feeEarnerName.errors.invalid",
    );
  });
});