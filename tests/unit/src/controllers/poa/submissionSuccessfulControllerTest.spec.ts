import { afterEach, beforeEach, describe, it } from "mocha";
import { expect } from "chai";
import * as sinon from "sinon";
import type { Request, Response } from "express";
import "#utils/axiosSetup.js";
import { poaSubmissionSuccessfulPage } from "#src/controllers/poa/submissionSuccessfulController.js";

describe("View Claim Controller", () => {
  let req: Partial<Request>;
  let res: any;
  let next: any;
  let renderStub: sinon.SinonStub;

  beforeEach(() => {
    req = {
      axiosMiddleware: {} as any,
      path: "/claims/1/poa-submitted",
      params: { claimId: "1" },
    };

    renderStub = sinon.stub();

    res = {
      render: renderStub,
      redirect: sinon.spy(),
    };

    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("POA successful submission controller test", () => {
    it("should render the page with correct template", async () => {
      poaSubmissionSuccessfulPage(req as Request, res as Response, next);

      expect(renderStub.calledWith("main/poa/submissionSuccessfulView.njk")).to.be.true;
    });
  });
});
