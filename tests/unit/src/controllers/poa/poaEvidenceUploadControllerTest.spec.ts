import { expect } from "chai";
import { beforeEach, describe, it } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import {
  poaEvidenceUploadPage,
  submitPoaEvidenceUpload,
} from "#src/controllers/poa/poaEvidenceUploadController.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { claimService } from "#src/services/claimService.js";

describe("poaEvidenceUploadController", () => {
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    res = {
      render: sinon.stub(),
      redirect: sinon.stub(),
      locals: {
        csrfToken: "test-csrf-token",
      },
    } as unknown as Response;

    next = sinon.stub() as unknown as NextFunction;
  });

  afterEach(() => {
    sinon.restore();
  });

it("renders the POA evidence upload page", async () => {
    sinon.stub(claimService, "getClaim").resolves({
      status: "success",
      body: {
        id: 1,
        evidence: [],
      },
    } as any);

    const req = {
      params: {
        claimId: "1",
      },
      axiosMiddleware: {},
    } as unknown as Request;

    await poaEvidenceUploadPage(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/poa/poaEvidenceUploadView.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");
    expect(renderArgs.vm.title).to.equal("pages.poaEvidenceUpload.title");
    expect(renderArgs.vm.uploadUrl).to.equal(
      buildRoute(ROUTES.AJAX_UPLOAD_POA_EVIDENCE, { claimId: 1 }),
    );
    expect(renderArgs.vm.deleteUrl).to.equal(
      buildRoute(ROUTES.AJAX_DELETE_POA_EVIDENCE, { claimId: 1 }),
    );
    expect(renderArgs.vm.saveAndContinueHref).to.equal(
      buildRoute(ROUTES.POA_CHECK_YOUR_DETAILS, { claimId: 1 }),
    );
    expect(renderArgs.vm.saveAndComeBackLaterHref).to.equal("#");
  });

  it("redirects to check your details on submit", async () => {
    sinon.stub(claimService, "getClaim").resolves({
      status: "success",
      body: {
        id: 1,
        evidence: [
          {
            id: 123,
            fileKey: "sample.pdf",
            fileSize: 1024,
            submittedOn: new Date(),
          },
        ],
      },
    } as any);

    const req = {
      params: {
        claimId: "1",
      },
      axiosMiddleware: {},
    } as unknown as Request;

    await submitPoaEvidenceUpload(req, res, next);

    expect(
      (res.redirect as sinon.SinonStub).calledWith(
        buildRoute(ROUTES.POA_CHECK_YOUR_DETAILS, {
          claimId: 1,
        }),
      ),
    ).to.equal(true);
  });

  it("renders with an error when no evidence has been uploaded", async () => {
    sinon.stub(claimService, "getClaim").resolves({
      status: "success",
      body: {
        id: 1,
        evidence: [],
      },
    } as any);

    (res.status as unknown) = sinon.stub().returns(res);

    const req = {
      params: {
        claimId: "1",
      },
      axiosMiddleware: {},
    } as unknown as Request;

    await submitPoaEvidenceUpload(req, res, next);

    expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.vm.errorSummary.errorList).to.have.length(1);
    expect(renderArgs.vm.errorSummary.errorList[0].text.key).to.equal(
      "multiFileUpload.errors.noFileSelected",
    );
  });
});