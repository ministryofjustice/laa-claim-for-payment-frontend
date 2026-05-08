import { afterEach, beforeEach, describe, it } from "mocha";
import { expect } from "chai";
import * as sinon from "sinon";
import type { Request, Response } from "express";
import "#utils/axiosSetup.js";
import { viewUploadEvidenceIndividuallyPage } from "#src/controllers/claims/uploadEvidenceIndividuallyController.js";

describe("View Claim Controller", () => {
  let req: Partial<Request>;
  let res: any;
  let next: any;
  let renderStub: sinon.SinonStub;
  let statusStub: sinon.SinonStub;

  beforeEach(() => {
    req = {
      axiosMiddleware: {} as any,
      path: "/claims/1/upload-evidence-individually",
      params: { claimId: "1" },
    };

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

  describe("Upload Evidence Individually controller test", () => {
    it("should render the view with data and correct template", async () => {
      await viewUploadEvidenceIndividuallyPage(
        req as Request,
        res as Response,
        next,
      );

      expect(
        renderStub.calledWith("main/claims/uploadEvidenceIndividually.njk"),
      ).to.be.true;
    });
  });
});
