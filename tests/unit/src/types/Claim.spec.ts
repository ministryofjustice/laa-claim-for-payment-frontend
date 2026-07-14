import { expect } from "chai";
import { ClaimResponseSchema, EvidenceItemSchema } from "#src/types/Claim.js";
import { UUID, V7Generator } from "uuidv7";
import { ZodError } from 'zod';

describe("ClaimResponseSchema", () => {

  const id = new V7Generator().generate();

  describe("id", () => {
    it("parses a valid uuid7", () => {
      const result = ClaimResponseSchema.parse({
        id: id.toString(),
        escaped: true,
      });

      expect(result.id).to.deep.equal(id);
    });

    it("fails to parse a uuid4 ", () => {
      const uuid4 = UUID.parse("a8daf4c7-776a-41a4-9247-b6f3d2a13daf");
      const result = () => ClaimResponseSchema.parse({
        id: uuid4.toString(),
        escaped: true,
      });

      expect(result).to.throw(ZodError);
    });
  });

  describe("ufn", () => {
    it("parses a valid string", () => {
      const result = ClaimResponseSchema.parse({
        id: id.toString(),
        ufn: "UFN_123",
      });

      expect(result.ufn).to.equal("UFN_123");
    });

    it("parses undefined as undefined", () => {
      const result = ClaimResponseSchema.parse({
        id: id.toString(),
        ufn: undefined,
      });

      expect(result.ufn).to.be.undefined;
    });

    it("parses null as null", () => {
      const result = ClaimResponseSchema.parse({
        id: id.toString(),
        ufn: null,
      });

      expect(result.ufn).to.be.null;
    });

    it("parses missing field as undefined", () => {
      const result = ClaimResponseSchema.parse({
        id: id.toString(),
      });

      expect(result.ufn).to.be.undefined;
    });
  });

  describe("concluded", () => {
    it("parses a valid date string", () => {
      const result = ClaimResponseSchema.parse({
        id: id.toString(),
        concluded: "2026-05-07T10:00:00.000Z",
      });

      expect(result.concluded).to.be.instanceof(Date);
      expect(result.concluded?.toISOString()).to.equal(
        "2026-05-07T10:00:00.000Z",
      );
    });

    it("parses undefined as undefined", () => {
      const result = ClaimResponseSchema.parse({
        id: id.toString(),
        concluded: undefined,
      });

      expect(result.concluded).to.be.undefined;
    });

    it("parses null as null", () => {
      const result = ClaimResponseSchema.parse({
        id: id.toString(),
        concluded: null,
      });

      expect(result.concluded).to.be.null;
    });

    it("parses missing field as undefined", () => {
      const result = ClaimResponseSchema.parse({
        id: id.toString(),
      });

      expect(result.concluded).to.be.undefined;
    });
  });

  describe("EvidenceItemSchema", () => {

    it("parses a valid evidence item", () => {
      const result = EvidenceItemSchema.parse({
        id: id.toString(),
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
          id: id.toString(),
          fileKey: "test.pdf",
          fileSize: 123456,
          submittedOn: undefined,
        })
      ).to.throw();
    });

    it("fails to parse when mandatory field is null", () => {
      expect(() =>
        EvidenceItemSchema.parse({
          id: id.toString(),
          fileKey: "test.pdf",
          fileSize: 123456,
          submittedOn: null,
        })
      ).to.throw();
    });

    it("fails to parse when mandatory field is missing", () => {
      expect(() =>
        EvidenceItemSchema.parse({
          id: id.toString(),
          fileKey: "test.pdf",
          fileSize: 123456,
        })
      ).to.throw();
    });
  });
});