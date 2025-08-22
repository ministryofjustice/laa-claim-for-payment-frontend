import sinon from "sinon";
import { expect } from "chai";
import { isClaim } from "#src/helpers/typeChecks.js";

describe("isClaim", () => {
  it("should return true for a valid Claim object", () => {
    // Arrange - set up the mock data
    const mockValidClaim = {
      id: "validId",
      client: "validClient",
      category: "validCategory",
      concluded: "validConcluded",
      feeType: "validFeeType",
      claimed: "validClaimed",
      submissionId: "validSubmissionId",
    };

    // Assert & Act - check the data
    expect(isClaim(mockValidClaim)).to.be.true;
  });

  it("should return false for null", () => {
    expect(isClaim(null)).to.be.false;
  });

  it("should return false for non-objects", () => {
    expect(isClaim("just a string")).to.be.false;
    expect(isClaim(1998)).to.be.false;
    expect(isClaim(false)).to.be.false;
  });

  it("should return false when values are missing", () => {
    const notAClaim = {
      id: "validId",
      claimed: "validClaimed",
      submissionId: "validSubmissionId",
    };

    // Assert & Act - check the data
    expect(isClaim(notAClaim)).to.be.false;
  });
});
