import { expect } from "chai";
import { describe, it } from "mocha";
import { validateProfitCostBillLine } from "#src/helpers/profitCostBillLineValidation.js";

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

    expect(result.isValid).to.equal(true);
    expect(result.errors).to.deep.equal([]);
  });

  it("returns error when activity date is empty", () => {
    const result = validateProfitCostBillLine({
      ...validBody,
      activityDateDay: "",
      activityDateMonth: "",
      activityDateYear: "",
    });

    expect(result.isValid).to.equal(false);
    expect(result.errors[0].text.key).to.equal(
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

    expect(result.isValid).to.equal(false);
    expect(result.errors[0].text.key).to.equal(
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

    expect(result.isValid).to.equal(false);
    expect(result.errors[0].text.key).to.equal(
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

    expect(result.isValid).to.equal(false);
    expect(result.errors[0].text.key).to.equal(
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

    expect(result.isValid).to.equal(false);
    expect(result.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.activityDate.errors.future",
    );
  });

  it("returns error when profit cost is empty", () => {
    const result = validateProfitCostBillLine({
      ...validBody,
      actualNetProfitCostExcludingAdvocacy: "",
    });

    expect(result.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.actualNetProfitCostExcludingAdvocacy.errors.empty",
    );
  });

  it("returns error when profit cost is not a number", () => {
    const result = validateProfitCostBillLine({
      ...validBody,
      actualNetProfitCostExcludingAdvocacy: "abc",
    });

    expect(result.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.actualNetProfitCostExcludingAdvocacy.errors.invalid",
    );
  });

  it("returns error when advocacy cost is empty", () => {
    const result = validateProfitCostBillLine({
      ...validBody,
      actualNetAdvocacyCosts: "",
    });

    expect(result.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.actualNetAdvocacyCosts.errors.empty",
    );
  });

  it("returns error when advocacy cost is not a number", () => {
    const result = validateProfitCostBillLine({
      ...validBody,
      actualNetAdvocacyCosts: "abc",
    });

    expect(result.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.actualNetAdvocacyCosts.errors.invalid",
    );
  });

  it("returns error when VAT is not selected", () => {
    const result = validateProfitCostBillLine({
      ...validBody,
      vatApplies: undefined,
    });

    expect(result.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.vatApplies.errors.empty",
    );
  });

  it("returns error when fee earner name is empty", () => {
    const result = validateProfitCostBillLine({
      ...validBody,
      feeEarnerName: "",
    });

    expect(result.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.feeEarnerName.errors.empty",
    );
  });

  it("returns error when fee earner name contains invalid characters", () => {
    const result = validateProfitCostBillLine({
      ...validBody,
      feeEarnerName: "John Smith 123",
    });

    expect(result.errors[0].text.key).to.equal(
      "pages.profitCostBillLine.feeEarnerName.errors.invalid",
    );
  });
});