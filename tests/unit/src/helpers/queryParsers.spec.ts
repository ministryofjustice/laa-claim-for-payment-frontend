/**
 * @description Tests for the utility functions in queryParsers work as expected
 */

import { getMode, parseNumberQueryParam } from "#src/helpers/queryParsers.js";
import { expect } from "chai";
import type { Request } from "express";

describe("queryParsers", () => {
  describe("parseNumberQueryParam()", () => {
    it("parses the param when it is a number", () => {
      expect(parseNumberQueryParam("2", 1)).to.equal(2);
    });

    it("uses the default when the param is not a number", () => {
      expect(parseNumberQueryParam("foo", 1)).to.equal(1);
    });

    it("uses the default when the param is not a string", () => {
      expect(parseNumberQueryParam(true, 1)).to.equal(1);
    });
  });

  describe("getMode", () => {
    it("returns normal when mode is undefined", () => {
      const req = {
        query: {},
      } as unknown as Request;

      expect(getMode(req)).to.equal("normal");
    });

    it("returns normal when mode is normal", () => {
      const req = {
        query: {
          mode: "normal",
        },
      } as unknown as Request;

      expect(getMode(req)).to.equal("normal");
    });

    it("returns change when mode is change", () => {
      const req = {
        query: {
          mode: "change",
        },
      } as unknown as Request;

      expect(getMode(req)).to.equal("change");
    });

    it("returns normal when mode is something unexpected", () => {
      const req = {
        query: {
          mode: "foo",
        },
      } as unknown as Request;

      expect(getMode(req)).to.equal("normal");
    });
  });
});
