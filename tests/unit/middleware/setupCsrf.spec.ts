import { expect } from "chai";
import sinon from "sinon";

import { setupCsrf } from "#middleware/setupCsrf.js";

describe("setupCsrf helpers", () => {
  afterEach(() => {
    sinon.restore();
  });
  
describe("setupCsrf", () => {
    let getTokenFromRequest: any;

    beforeEach(() => {
      const fakeFactory = (config: any) => {
        getTokenFromRequest = config.getTokenFromRequest;
        return {
          csrfSynchronisedProtection: () => {},
        };
      };

      setupCsrf({ use: () => {} } as any, fakeFactory as any);
    });

    it("returns token from body when valid string", () => {
      const req = { body: { _csrf: "body-token" }, session: {} };
      expect(getTokenFromRequest(req)).to.equal("body-token");
    });

    it("falls back to session token", () => {
      const req = { body: {}, session: { csrfToken: "session-token" } };
      expect(getTokenFromRequest(req)).to.equal("session-token");
    });

    it("returns undefined if none found", () => {
      const req = { body: {}, session: {} };
      expect(getTokenFromRequest(req)).to.be.undefined;
    });
  });

  it("adds csrfToken to res.locals when available", () => {
    const useSpy = sinon.spy();

    const fakeFactory = () => ({
      csrfSynchronisedProtection: () => {},
    });

    setupCsrf({ use: useSpy } as any, fakeFactory as any);

    const middleware = useSpy.getCall(1).args[0];

    const req = {
      csrfToken: () => "generated-token",
    };

    const res = { locals: {} as any };
    const next = sinon.spy();

    middleware(req, res, next);

    expect(res.locals.csrfToken).to.equal("generated-token");
    expect(next.calledOnce).to.be.true;
  });
});