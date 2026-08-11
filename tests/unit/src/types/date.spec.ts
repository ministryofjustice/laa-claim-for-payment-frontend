import { LocalDate } from "#src/types/date.js";
import { expect } from "chai";
import sinon from "sinon";

describe("LocalDate", () => {
  describe("from", () => {
    it("creates a LocalDate from a valid ISO string", () => {
      const result = LocalDate.from("2026-08-07");
      expect(result.day).to.equal(7);
      expect(result.month).to.equal(8);
      expect(result.year).to.equal(2026);
    });

    it("fails to create a LocalDate from an invalid ISO string", () => {
      const result = () => LocalDate.from("2026-08-32");
      expect(result).to.throw(Error);
    });
  });

  describe("of", () => {
    it("creates a LocalDate from valid values", () => {
      const result = LocalDate.of(7, 8, 2026);
      expect(result.day).to.equal(7);
      expect(result.month).to.equal(8);
      expect(result.year).to.equal(2026);
    });

    it("fails to create a LocalDate from invalid values", () => {
      const result = () => LocalDate.of(32, 8, 2026);
      expect(result).to.throw(Error);
    });
  });

  describe("toDayString", () => {
    it("returns string representation of single-digit day", () => {
      const date = new LocalDate(1, 1, 2026);
      expect(date.toDayString()).to.equal("01");
    });

    it("returns string representation of double-digit day", () => {
      const date = new LocalDate(10, 1, 2026);
      expect(date.toDayString()).to.equal("10");
    });
  });

  describe("toMonthString", () => {
    it("returns string representation of single-digit month", () => {
      const date = new LocalDate(1, 1, 2026);
      expect(date.toMonthString()).to.equal("01");
    });

    it("returns string representation of double-digit month", () => {
      const date = new LocalDate(1, 10, 2026);
      expect(date.toMonthString()).to.equal("10");
    });
  });

  describe("toYearString", () => {
    it("returns string representation of single-digit year", () => {
      const date = new LocalDate(1, 1, 6);
      expect(date.toYearString()).to.equal("0006");
    });

    it("returns string representation of double-digit year", () => {
      const date = new LocalDate(1, 1, 26);
      expect(date.toYearString()).to.equal("0026");
    });

    it("returns string representation of triple-digit year", () => {
      const date = new LocalDate(1, 1, 226);
      expect(date.toYearString()).to.equal("0226");
    });

    it("returns string representation of year", () => {
      const date = new LocalDate(1, 1, 2026);
      expect(date.toYearString()).to.equal("2026");
    });
  });

  describe("toDate", () => {
    it("creates a UTC Date from the LocalDate values", () => {
      const date = new LocalDate(17, 6, 2026);

      const result = date.toDate();

      expect(result.toISOString()).to.equal("2026-06-17T00:00:00.000Z");
    });
  });

  describe("toEpochMillis", () => {
    it("returns epoch milliseconds", () => {
      const date = new LocalDate(17, 6, 2026);

      const result = date.toEpochMillis();

      expect(result).to.equal(1781654400000);
    });

    it("returns a larger epoch value for a later date", () => {
      const earlier = new LocalDate(16, 6, 2026);
      const later = new LocalDate(17, 6, 2026);

      expect(later.toEpochMillis()).to.be.greaterThan(earlier.toEpochMillis());
    });

    it("returns a smaller epoch value for an earlier date", () => {
      const earlier = new LocalDate(16, 6, 2026);
      const later = new LocalDate(17, 6, 2026);

      expect(earlier.toEpochMillis()).to.be.lessThan(later.toEpochMillis());
    });
  });

  describe("toIsoString", () => {
    it("converts to ISO string for single-digit day and month values", () => {
      const date = new LocalDate(1, 2, 2026);
      expect(date.toIsoString()).to.equal("2026-02-01");
    });

    it("converts to ISO string for single-digit day and month values", () => {
      const date = new LocalDate(11, 12, 2026);
      expect(date.toIsoString()).to.equal("2026-12-11");
    });

    it("converts to ISO string for a year < 1000", () => {
      const date = new LocalDate(11, 12, 999);
      expect(date.toIsoString()).to.equal("0999-12-11");
    });
  });

  describe("isValid", () => {
    it("returns true for a valid date", () => {
      const date = new LocalDate(1, 1, 2020);
      expect(date.isValid()).to.be.true;
    });

    it("returns false for 29th of month with 28 days", () => {
      const date = new LocalDate(29, 2, 2025);
      expect(date.isValid()).to.be.false;
    });

    it("returns false for 30th of month with 29 days", () => {
      const date = new LocalDate(30, 2, 2024);
      expect(date.isValid()).to.be.false;
    });

    it("returns false for 31st of month with 30 days", () => {
      const date = new LocalDate(31, 9, 2025);
      expect(date.isValid()).to.be.false;
    });

    it("returns false for 32nd of month with 31 days", () => {
      const date = new LocalDate(32, 8, 2025);
      expect(date.isValid()).to.be.false;
    });

    it("returns false for day < 1", () => {
      const date = new LocalDate(0, 8, 2025);
      expect(date.isValid()).to.be.false;
    });

    it("returns false for month > 12", () => {
      const date = new LocalDate(1, 13, 2025);
      expect(date.isValid()).to.be.false;
    });
  });

  describe("isFutureDate", () => {
    let clock: sinon.SinonFakeTimers;

    beforeEach(() => {
      clock = sinon.useFakeTimers({
        now: new Date("2026-08-07T12:00:00Z"),
      });
    });

    afterEach(() => {
      clock.restore();
    });

    it("returns true when the date is after today", () => {
      const date = new LocalDate(8, 8, 2026);

      expect(date.isFutureDate()).to.be.true;
    });

    it("returns false when the date is today", () => {
      const date = new LocalDate(7, 8, 2026);

      expect(date.isFutureDate()).to.be.false;
    });

    it("returns false when the date is before today", () => {
      const date = new LocalDate(6, 8, 2026);

      expect(date.isFutureDate()).to.be.false;
    });
  });
});
