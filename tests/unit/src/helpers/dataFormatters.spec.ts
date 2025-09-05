/**
 * @description Tests for the utility functions in dataFormatters work as expected
 */

import { formatClaimed, formatClaimId, formatDate, formatOptionalString } from '#src/helpers/dataFormatters.js';
import { expect } from 'chai';


describe('formatDate()', () => {
  it('formats a valid ISO date string correctly', () => {
    expect(formatDate(new Date('1986-01-06T00:00:00Z'))).to.equal('06/01/1986');
    expect(formatDate(new Date('2023-07-28'))).to.equal('28/07/2023');
    expect(formatDate(new Date('2023/07/28'))).to.equal('28/07/2023');

  });

  it('formats dates with single-digit days with a leading zero', () => {
    expect(formatDate(new Date('2023-2-5'))).to.equal('05/02/2023');
    expect(formatDate(new Date('2023/2/5'))).to.equal('05/02/2023')
  });

    it('handles undefined date strings by returning an empty string', () => {
    expect(formatDate(undefined)).to.equal('');
  });
});

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

  describe("formatOptionalString", () => {
    it("should format undefined string as empty string", async () => {
      expect(formatOptionalString(undefined)).to.equal("");
    });

    it("should format defined string as itself", async () => {
      expect(formatOptionalString("foo")).to.equal("foo");
    });
  });
});
