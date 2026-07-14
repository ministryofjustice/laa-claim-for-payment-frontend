import { afterEach, beforeEach, describe, it } from "mocha";
import { expect } from "chai";
import * as sinon from "sinon";
import type { Request, Response } from "express";
import "#utils/axiosSetup.js";
import { poaSubmissionSuccessfulPage } from "#src/controllers/poa/submissionSuccessfulController.js";
import { V7Generator } from "uuidv7";

describe("Submission Successful Controller", () => {
  let req: Partial<Request>;
  let res: any;
  let next: any;
  let renderStub: sinon.SinonStub;

  const claimId = new V7Generator().generate();

  beforeEach(() => {
    req = {
      axiosMiddleware: {} as any,
      path: `/claims/${claimId}/poa-submitted`,
      params: { claimId: claimId.toString() },
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
