/**
 * @description Tests for the utility functions in dataTransformers work as expected
 */

import {
  formatClaimed,
  formatClaimId
} from "#src/helpers/dataTransformers.js";
import { expect } from "chai";

describe("Data Transformation Helpers", () => {
  describe("formatClaimed", () => {
    it("should format 1 -> LAA-001", async () => {
      expect(formatClaimId(1)).to.equal("LAA-001");
    });

    it("should format 12 -> LAA-012", async () => {
      expect(formatClaimId(12)).to.equal("LAA-012");
    });

    it("should format 123 -> LAA-123", async () => {
      expect(formatClaimId(123)).to.equal("LAA-123");
    });
  });

  describe("formatClaimed", () => {
    it("should format 1 -> £1.00", async () => {
      expect(formatClaimed(1)).to.equal("£1.00");
    });

    it("should format 0.1 -> £0.10", async () => {
      expect(formatClaimed(0.1)).to.equal("£0.10");
    });

    it("should format 0.10 -> £0.10", async () => {
      expect(formatClaimed(0.10)).to.equal("£0.10");
    });

    it("should format 1.10 -> £1.10", async () => {
      expect(formatClaimed(1.10)).to.equal("£1.10");
    });

    it("should return empty string on undefined input", async () => {
      expect(formatClaimed(undefined)).to.equal("");
    });
  });
});
