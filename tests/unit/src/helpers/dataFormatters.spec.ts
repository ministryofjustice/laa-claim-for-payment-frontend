/**
 * @description Tests for the utility functions in dataFormatters work as expected
 */

import {
  formatBoolean,
  formatBooleanChoice,
  formatClaimed,
  formatClaimId,
  formatDate,
  formatDateReadable,
  formatOptionalString,
} from "#src/helpers/dataFormatters.js";
import { expect } from "chai";
import { LocalDate } from "#src/types/date.js";

describe("Data Transformation Helpers", () => {
  describe("formatDate()", () => {
    it("formats a valid ISO date correctly", () => {
      expect(formatDate(new LocalDate(6, 1, 1986))).to.equal("06/01/1986");
      expect(formatDate(new LocalDate(28, 7, 2023))).to.equal("28/07/2023");
      expect(formatDate(new LocalDate(28, 11, 2023))).to.equal("28/11/2023");
    });
  });

  describe("formatDateReadable", () => {
    describe("english", () => {
      const language = "en";

      const months: Record<string, string> = {
        "01": "January",
        "02": "February",
        "03": "March",
        "04": "April",
        "05": "May",
        "06": "June",
        "07": "July",
        "08": "August",
        "09": "September",
        "10": "October",
        "11": "November",
        "12": "December",
      };

      Object.entries(months).forEach(([month, expected]) => {
        it(`formats month ${month} as ${expected} when single digit day`, () => {
          const date = new Date(`2026-${month}-01T00:00:00Z`);

          expect(formatDateReadable(date)(language)).to.equal(`1 ${expected} 2026`);
        });

        it(`formats month ${month} as ${expected} when double digit day`, () => {
          const date = new Date(`2026-${month}-10T00:00:00Z`);

          expect(formatDateReadable(date)(language)).to.equal(`10 ${expected} 2026`);
        });
      });
    });

    describe("welsh", () => {
      const language = "cy";

      const months: Record<string, string> = {
        "01": "Ionawr",
        "02": "Chwefror",
        "03": "Mawrth",
        "04": "Ebrill",
        "05": "Mai",
        "06": "Mehefin",
        "07": "Gorffennaf",
        "08": "Awst",
        "09": "Medi",
        "10": "Hydref",
        "11": "Tachwedd",
        "12": "Rhagfyr",
      };

      Object.entries(months).forEach(([month, expected]) => {
        it(`formats month ${month} as ${expected} when single digit day`, () => {
          const date = new Date(`2026-${month}-01T00:00:00Z`);

          expect(formatDateReadable(date)(language)).to.equal(`1 ${expected} 2026`);
        });

        it(`formats month ${month} as ${expected} when double digit day`, () => {
          const date = new Date(`2026-${month}-10T00:00:00Z`);

          expect(formatDateReadable(date)(language)).to.equal(`10 ${expected} 2026`);
        });
      });
    });
  });

  describe("formatClaimId", () => {
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
      expect(formatClaimed(0.1)).to.equal("£0.10");
    });

    it("should format 1.10 -> £1.10", async () => {
      expect(formatClaimed(1.1)).to.equal("£1.10");
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

  describe("formatBooleanChoice", () => {
    it("should format undefined as undefined", async () => {
      expect(formatBooleanChoice(undefined)).to.be.undefined;
    });

    it("should format null as undefined", async () => {
      expect(formatBooleanChoice(null)).to.be.undefined;
    });

    it("should format true as yes", async () => {
      expect(formatBooleanChoice(true)).to.equal("yes");
    });

    it("should format false as no", async () => {
      expect(formatBooleanChoice(false)).to.equal("no");
    });
  });

  describe("formatBoolean", () => {
    it("should format true as yes key", async () => {
      expect(formatBoolean(true)).to.equal("common.yes");
    });

    it("should format false as no key", async () => {
      expect(formatBoolean(false)).to.equal("common.no");
    });
  });
});
