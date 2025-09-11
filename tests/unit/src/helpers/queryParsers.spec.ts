/**
 * @description Tests for the utility functions in queryParsers work as expected
 */

import { parseNumberQueryParam } from "#src/helpers/queryParsers.js";
import { expect } from "chai";

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
