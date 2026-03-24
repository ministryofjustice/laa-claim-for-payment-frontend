import fs from "node:fs";
import sinon from "sinon";
import { expect } from "chai";
import { getBuildNumber, getLatestBuildFile } from "#utils/buildHelper.js";

describe("buildHelper:", () => {
  describe("getBuildNumber", () => {
    let randomStub: sinon.SinonStub;

    afterEach(() => {
      sinon.restore();
    });

    it("returns a string build number", () => {
      randomStub = sinon.stub(Math, "random").returns(0.1234);

      const result = getBuildNumber();

      expect(result).to.equal("1234");
      expect(result).to.be.a("string");
    });

    it("returns 0 when Math.random returns 0", () => {
      randomStub = sinon.stub(Math, "random").returns(0);

      const result = getBuildNumber();

      expect(result).to.equal("0");
    });

    it("returns 9999 when Math.random is near 1", () => {
      randomStub = sinon.stub(Math, "random").returns(0.9999);

      const result = getBuildNumber();

      expect(result).to.equal("9999");
    });
  });

  describe("getLatestBuildFile", () => {
    let readdirSyncStub: sinon.SinonStub;
    let statSyncStub: sinon.SinonStub;

    beforeEach(() => {
      readdirSyncStub = sinon.stub(fs, "readdirSync");
      statSyncStub = sinon.stub(fs, "statSync");
    });

    afterEach(() => {
      sinon.restore();
    });

    it("returns the most recently modified matching build file", () => {
      readdirSyncStub.returns([
        "build.123.js",
        "build.456.js",
        "ignore.txt",
      ] as any);

      statSyncStub.callsFake((path: any) => {
        if (path === "/tmp/build.123.js") {
          return { mtime: new Date(1000) } as any;
        }

        if (path === "/tmp/build.456.js") {
          return { mtime: new Date(2000) } as any;
        }

        return { mtime: new Date(0) } as any;
      });

      const result = getLatestBuildFile("/tmp", "build", "js");

      expect(result).to.equal("build.456.js");
    });

    it("returns an empty string when there are no matching files", () => {
      readdirSyncStub.returns(["foo.txt", "bar.css"] as any);

      const result = getLatestBuildFile("/tmp", "build", "js");

      expect(result).to.equal("");
      sinon.assert.notCalled(statSyncStub);
    });

    it("ignores files that do not match the expected pattern", () => {
      readdirSyncStub.returns([
        "build.js",
        "build.abc.js",
        "other.123.js",
        "build.123.css",
      ] as any);

      const result = getLatestBuildFile("/tmp", "build", "js");

      expect(result).to.equal("");
      sinon.assert.notCalled(statSyncStub);
    });

    it("returns the latest file when multiple matching files exist", () => {
      readdirSyncStub.returns([
        "bundle.1.js",
        "bundle.2.js",
        "bundle.3.js",
      ] as any);

      statSyncStub.callsFake((path: any) => {
        const mtimes: Record<string, number> = {
          "/tmp/bundle.1.js": 1000,
          "/tmp/bundle.2.js": 3000,
          "/tmp/bundle.3.js": 2000,
        };

        return { mtime: new Date(mtimes[path] ?? 0) } as any;
      });

      const result = getLatestBuildFile("/tmp", "bundle", "js");

      expect(result).to.equal("bundle.2.js");
    });
  });
});