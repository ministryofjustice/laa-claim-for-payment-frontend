import { expect } from "chai";
import { ClaimResponseSchema, EvidenceItemSchema } from "#src/types/Claim.js";

describe("ClaimResponseSchema", () => {
  describe("ufn", () => {
    it("parses a valid string", () => {
      const result = ClaimResponseSchema.parse({
        id: 1,
        ufn: "UFN_123",
      });

      expect(result.ufn).to.equal("UFN_123");
    });

    it("parses undefined as undefined", () => {
      const result = ClaimResponseSchema.parse({
        id: 1,
        ufn: undefined,
      });

      expect(result.ufn).to.be.undefined;
    });

    it("parses null as null", () => {
      const result = ClaimResponseSchema.parse({
        id: 1,
        ufn: null,
      });

      expect(result.ufn).to.be.null;
    });

    it("parses missing field as undefined", () => {
      const result = ClaimResponseSchema.parse({
        id: 1,
      });

      expect(result.ufn).to.be.undefined;
    });
  });

  describe("concluded", () => {
    it("parses a valid date string", () => {
      const result = ClaimResponseSchema.parse({
        id: 1,
        concluded: "2026-05-07T10:00:00.000Z",
      });

      expect(result.concluded).to.be.instanceof(Date);
      expect(result.concluded?.toISOString()).to.equal(
        "2026-05-07T10:00:00.000Z",
      );
    });

    it("parses undefined as undefined", () => {
      const result = ClaimResponseSchema.parse({
        id: 1,
        concluded: undefined,
      });

      expect(result.concluded).to.be.undefined;
    });

    it("parses null as null", () => {
      const result = ClaimResponseSchema.parse({
        id: 1,
        concluded: null,
      });

      expect(result.concluded).to.be.null;
    });

    it("parses missing field as undefined", () => {
      const result = ClaimResponseSchema.parse({
        id: 1,
      });

      expect(result.concluded).to.be.undefined;
    });
  });

  describe("EvidenceItemSchema", () => {
    it("parses a valid evidence item", () => {
      const result = EvidenceItemSchema.parse({
        id: 1,
        fileKey: "test.pdf",
        fileSize: 123456,
        submittedOn: "2026-06-17T14:34:01.226855Z",
      });

      expect(result.submittedOn).to.be.instanceof(Date);
      expect(result.submittedOn?.toISOString()).to.equal(
        "2026-06-17T14:34:01.226Z",
      );
    });

    it("fails to parse when mandatory field is undefined", () => {
      expect(() =>
        EvidenceItemSchema.parse({
          id: 1,
          fileKey: "test.pdf",
          fileSize: 123456,
          submittedOn: undefined,
        })
      ).to.throw();
    });

    it("fails to parse when mandatory field is null", () => {
      expect(() =>
        EvidenceItemSchema.parse({
          id: 1,
          fileKey: "test.pdf",
          fileSize: 123456,
          submittedOn: null,
        })
      ).to.throw();
    });

    it("fails to parse when mandatory field is missing", () => {
      expect(() =>
        EvidenceItemSchema.parse({
          id: 1,
          fileKey: "test.pdf",
          fileSize: 123456,
        })
      ).to.throw();
    });
  });
});