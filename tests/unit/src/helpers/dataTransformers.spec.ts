/**
 * @description Tests for the utility functions in dataTransformers work as expected
 */

import {
  safeString,
  safeOptionalString,
  optionalDate,
  isRecord,
  safeStringFromRecord,
  hasProperty,
  formatClaimed,
  formatClaimId,
  transformClaim,
} from "#src/helpers/dataTransformers.js";
import { isClaim } from "#src/helpers/typeChecks.js";
import { expect } from "chai";

describe("Data Transformation Helpers", () => {
  describe("safeString()", () => {
    it("returns empty string for null or undefined", () => {
      expect(safeString(null)).to.equal("");
      expect(safeString(undefined)).to.equal("");
    });

    it("returns the string unchanged", () => {
      expect(safeString("hello")).to.equal("hello");
    });

    it("converts number and boolean to string", () => {
      expect(safeString(123)).to.equal("123");
      expect(safeString(true)).to.equal("true");
    });

    it("returns empty string for other types", () => {
      expect(safeString({})).to.equal("");
      expect(safeString([])).to.equal("");
      expect(safeString(() => {})).to.equal("");
    });
  });

  describe("optionalDate()", () => {
    it("returns undefined for null or undefined", () => {
      expect(optionalDate(null)).to.be.undefined;
      expect(optionalDate(undefined)).to.be.undefined;
    });

    it("returns undefined for invalid date", () => {
      expect(optionalDate("invalid-date")).to.be.undefined;
      expect(optionalDate("")).to.be.undefined;
    });

    it("converts valid dates to Dates", () => {
      expect(optionalDate("2025-03-18")).to.be.deep.equal(new Date("2025-03-18"));
    });
  });

  describe("safeOptionalString()", () => {
    it("returns undefined for null or undefined", () => {
      expect(safeOptionalString(null)).to.be.undefined;
      expect(safeOptionalString(undefined)).to.be.undefined;
    });

    it("returns string for string values", () => {
      expect(safeOptionalString("world")).to.equal("world");
    });

    it("converts number and boolean to string", () => {
      expect(safeOptionalString(0)).to.equal("0");
      expect(safeOptionalString(false)).to.equal("false");
    });

    it("returns undefined for other types", () => {
      expect(safeOptionalString({})).to.be.undefined;
      expect(safeOptionalString([])).to.be.undefined;
    });
  });

  describe("isRecord()", () => {
    it("returns true for plain objects", () => {
      expect(isRecord({ a: 1 })).to.be.true;
    });

    it("returns false for null, arrays, functions, and primitives", () => {
      expect(isRecord(null)).to.be.false;
      expect(isRecord([])).to.be.false;
      expect(isRecord(() => {})).to.be.false;
      expect(isRecord(123)).to.be.false;
      expect(isRecord("test")).to.be.false;
    });
  });

  describe("safeStringFromRecord()", () => {
    it("returns string value for valid key with non-empty string", () => {
      const obj = { name: "Alice" };
      expect(safeStringFromRecord(obj, "name")).to.equal("Alice");
    });

    it("returns null if key missing or value not a non-empty string", () => {
      const obj = { name: "" };
      expect(safeStringFromRecord(obj, "age")).to.be.null;
      expect(safeStringFromRecord(obj, "name")).to.be.null;
      expect(safeStringFromRecord(null, "name")).to.be.null;
    });
  });

  describe("hasProperty()", () => {
    it("returns true if object has property", () => {
      expect(hasProperty({ foo: 123 }, "foo")).to.be.true;
    });

    it("returns false if not a record or property missing", () => {
      expect(hasProperty(null, "foo")).to.be.false;
      expect(hasProperty({}, "foo")).to.be.false;
      expect(hasProperty([], "foo")).to.be.false;
    });
  });

  describe("formatClaimed", () => {
    it("should format 1 -> LAA-001", async () => {
      expect(formatClaimId("1")).to.equal("LAA-001");
    });

    it("should format 12 -> LAA-012", async () => {
      expect(formatClaimId("12")).to.equal("LAA-012");
    });

    it("should format 123 -> LAA-123", async () => {
      expect(formatClaimId("123")).to.equal("LAA-123");
    });
  });

  describe("formatClaimed", () => {
    it("should format 1 -> £1.00", async () => {
      expect(formatClaimed("1")).to.equal("£1.00");
    });

    it("should format 0.1 -> £0.10", async () => {
      expect(formatClaimed("0.1")).to.equal("£0.10");
    });

    it("should format 0.10 -> £0.10", async () => {
      expect(formatClaimed("0.10")).to.equal("£0.10");
    });

    it("should format 1.10 -> £1.10", async () => {
      expect(formatClaimed("1.10")).to.equal("£1.10");
    });

    it("should handle trailing whitespace", async () => {
      expect(formatClaimed("       1.10        ")).to.equal("£1.10");
    });

    it("should throw an error on non-numerical input", async () => {
      expect(() => formatClaimed("twelve")).to.throw();
    });

    it("should throw an error on empty input", async () => {
      expect(() => formatClaimed("")).to.throw();
    });

    it("should throw an error on symbol input", async () => {
      expect(() => formatClaimed("£$£")).to.throw();
    });
  });

  describe("transformClaim", () => {
    it("should transform a valid object into a submission type", () => {
      const mockDataInput = {
        id: "validId",
        client: "validClient",
        category: "validCategory",
        concluded: "2025-03-18",
        claimed: "validClaimed",
        submissionId: "validSubmissionId",
      };

      const result = transformClaim(mockDataInput);

      // Check the data structures

      // checks this is a valid object (Claim is interface - doesn't exist at runtime)
      expect(result).to.be.an("object");

      // checks the data conforms to the right structure
      expect(result).to.have.property("id", "validId");
      expect(result).to.have.property("client", "validClient");
      expect(result).to.have.property("category", "validCategory");
      expect(result).to.have.property("concluded").that.deep.equal(new Date("2025-03-18"));
      expect(result).to.have.property("claimed", "validClaimed");
      expect(result).to.have.property("submissionId", "validSubmissionId");
    });

    it("should throw an error when the transformer is used on null", () => {
      const mockDataInput = null;

      expect(() => transformClaim(mockDataInput)).to.throw("Invalid claim item: expected object");
    });
  });
});
