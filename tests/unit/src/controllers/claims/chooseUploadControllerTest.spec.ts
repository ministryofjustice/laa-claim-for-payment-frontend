import { afterEach, beforeEach, describe, it } from "mocha";
import { expect } from "chai";
import * as sinon from "sinon";
import type { Request, Response } from "express";
import {
  chooseFileUpload,
  submitChooseFileUpload,
} from "#src/controllers/claims/chooseUploadController.js";
import { V7Generator } from "uuidv7";

describe("Choose Upload Controller", () => {
  let req: Partial<Request>;
  let res: any;
  let next: any;
  let renderStub: sinon.SinonStub;
  let statusStub: sinon.SinonStub;
  let redirectStub: sinon.SinonStub;

  const claimId = new V7Generator().generate();

  beforeEach(() => {
    req = {
      body: {},
      path: "/claims/1/choose-upload",
      params: { claimId: claimId.toString() },
    };

    renderStub = sinon.stub();
    statusStub = sinon.stub().returns({ render: renderStub });
    redirectStub = sinon.stub();

    res = {
      locals: {
        csrfToken: "csrf-token",
      },
      render: renderStub,
      status: statusStub,
      redirect: redirectStub,
    };

    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("Choose file upload controller test", () => {
    it("should render the choose upload page with the correct template", async () => {
      await chooseFileUpload(req as Request, res as Response, next);

      expect(renderStub.calledOnce).to.be.true;
      expect(renderStub.calledWith("main/radioQuestionPage.njk")).to.be.true;

      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.csrfToken).to.equal("csrf-token");
      expect(renderArgs.vm.radios.name).to.equal("fileUploadChoice");
      expect(renderArgs.vm.radios.items).to.have.length(2);
    });

    it("should render the choose upload page with an error when no option is selected", async () => {
      await submitChooseFileUpload(req as Request, res as Response, next);

      expect(statusStub.calledOnceWith(400)).to.be.true;
      expect(renderStub.calledOnce).to.be.true;
      expect(renderStub.calledWith("main/radioQuestionPage.njk")).to.be.true;

      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.csrfToken).to.equal("csrf-token");
      expect(renderArgs.vm.radios.errorMessage.text.key).to.equal(
        "pages.chooseUpload.errors.empty",
      );
    });

    it("should render the choose upload page with an error when an invalid option is selected", async () => {
      req.body = {
        fileUploadChoice: "invalid",
      };

      await submitChooseFileUpload(req as Request, res as Response, next);

      expect(statusStub.calledOnceWith(400)).to.be.true;
      expect(renderStub.calledOnce).to.be.true;
      expect(renderStub.calledWith("main/radioQuestionPage.njk")).to.be.true;

      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.vm.radios.errorMessage.text.key).to.equal(
        "pages.chooseUpload.errors.empty",
      );
    });

    it("should redirect to the all at once upload page when all-at-once is selected", async () => {
      req.body = {
        fileUploadChoice: "all-at-once",
      };

      await submitChooseFileUpload(req as Request, res as Response, next);

      expect(redirectStub.calledOnceWith("/all-at-once-file-upload")).to.be
        .true;
      expect(renderStub.called).to.be.false;
      expect(statusStub.called).to.be.false;
    });

    it("should redirect to the assoicated file upload page when associated-to-line-items is selected", async () => {
      req.body = {
        fileUploadChoice: "associated-to-line-items",
      };

      await submitChooseFileUpload(req as Request, res as Response, next);

      expect(
        redirectStub.calledOnceWith(`/claims/${claimId.toString()}/upload-evidence-individually`),
      ).to.be.true;
      expect(renderStub.called).to.be.false;
      expect(statusStub.called).to.be.false;
    });

    it("should delegate errors to Express error handling middleware on GET", async () => {
      renderStub.throws(new Error("Render Error"));

      await chooseFileUpload(req as Request, res as Response, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.include("Render Error");
    });

    it("should delegate errors to Express error handling middleware on POST", async () => {
      redirectStub.throws(new Error("Redirect Error"));

      req.body = {
        fileUploadChoice: "all-at-once",
      };

      await submitChooseFileUpload(req as Request, res as Response, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.include("Redirect Error");
    });
  });
});