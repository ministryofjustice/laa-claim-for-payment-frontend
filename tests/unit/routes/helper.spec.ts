import { buildRoute } from "#routes/helper.js";
import { expect } from "chai";

describe("helper", () => {
  describe("buildRoute", () => {
    it("constructs a route with no parameters", () => {
      const route = "/foo";
      const result = buildRoute(route, {});
      expect(result).to.equal("/foo");
    });

    it("constructs a route with parameters", () => {
      const route = "/foo/:param";
      const result = buildRoute(route, { param: "bar" });
      expect(result).to.equal("/foo/bar");
    });

    it("constructs a route with multiple parameters", () => {
      const route = "/foo/:param1/:param2";
      const result = buildRoute(route, { param1: "bar", param2: "baz" });
      expect(result).to.equal("/foo/bar/baz");
    });

    it("does not substitute in mislabelled parameters", () => {
      const route = "/foo/:param1";
      const result = buildRoute(route, { param2: "bar" });
      expect(result).to.equal("/foo/:param1");
    });

    it("constructs a route with query parameters", () => {
      const route = "/foo";
      const result = buildRoute(route, {}, { key: "value" });
      expect(result).to.equal("/foo?key=value");
    });

    it("constructs a route with multiple query parameters", () => {
      const route = "/foo";
      const result = buildRoute(
        route,
        {},
        { key1: "value1", key2: "value2", key3: "value3" },
      );
      expect(result).to.equal("/foo?key1=value1&key2=value2&key3=value3");
    });

    it("constructs a route with parameters and query parameters", () => {
      const route = "/foo/:param";
      const result = buildRoute(route, { param: "bar" }, { key: "value" });
      expect(result).to.equal("/foo/bar?key=value");
    });
  });
});
