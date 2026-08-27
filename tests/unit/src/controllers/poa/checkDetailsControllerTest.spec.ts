import { afterEach, beforeEach, describe, it } from "mocha";
import { expect } from "chai";
import * as sinon from "sinon";
import type { Request, Response } from "express";
import "#utils/axiosSetup.js";
import { Claim } from "#src/types/Claim.js";
import {
  checkYourDetailsPage,
  submitYourDetails,
} from "#src/controllers/poa/checkDetailsController.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { V7Generator } from "uuidv7";
import { claim9 } from "#tests/assets/claim.js";

describe("Check Details Controller", () => {
  let req: Partial<Request>;
  let res: any;
  let next: any;
  let renderStub: sinon.SinonStub;
  let statusStub: sinon.SinonStub;

  const claimId = new V7Generator().generate();

  beforeEach(() => {
    renderStub = sinon.stub();
    statusStub = sinon.stub().returns({ render: renderStub });

    res = {
      render: renderStub,
      status: statusStub,
      redirect: sinon.spy(),
    };

    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("Check Details controller test", () => {
    it("should render the page with data and correct template", () => {
      req = {
        claim: new Claim({ ...claim9 }),
      };

      checkYourDetailsPage(req as Request, res as Response, next);

      expect(renderStub.calledWith("main/poa/checkDetailsView.njk")).to.be.true;
    });

    it("should redirect when cost type missing from claim", () => {
      req = {
        claim: new Claim({
          id: claimId.toString(),
        }),
      };

      checkYourDetailsPage(req as Request, res as Response, next);

      expect(
        (res.redirect as sinon.SinonStub).calledWith(
          buildRoute(ROUTES.POA.CLAIM_TYPE, {
            claimId: claimId,
          }),
        ),
      ).to.be.true;
    });

    it("should redirect to appropriate page when no claim is returned", () => {
      req = {};

      checkYourDetailsPage(req as Request, res as Response, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.equal("Draft claim not loaded");
    });

    it("should redirect to success page with claimId", () => {
      req = {
        claim: new Claim({
          id: claimId.toString(),
        }),
      };

      submitYourDetails(req as Request, res as Response, next);

      const expectedRoute = `/claims/${claimId.toString()}/poa-submitted`;

      expect(res.redirect.calledOnce).to.be.true;
      expect(res.redirect.calledWith(expectedRoute)).to.be.true;
      expect(next.notCalled).to.be.true;
    });
  });
});
