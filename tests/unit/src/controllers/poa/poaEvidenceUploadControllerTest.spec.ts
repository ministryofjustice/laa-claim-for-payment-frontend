import { expect } from "chai";
import { beforeEach, describe, it } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import {
  poaEvidenceUploadPage,
  submitPoaEvidenceUpload,
} from "#src/controllers/poa/poaEvidenceUploadController.js";
import { buildRoute, ROUTES } from "#routes/helper.js";

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

  it("renders the POA evidence upload page", () => {
    const req = {
      params: {
        claimId: "1",
      },
    } as unknown as Request;

    poaEvidenceUploadPage(req, res, next);

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

  it("redirects to check your details on submit", () => {
    const req = {
      params: {
        claimId: "1",
      },
    } as unknown as Request;

    submitPoaEvidenceUpload(req, res, next);

    expect(
      (res.redirect as sinon.SinonStub).calledWith(
        buildRoute(ROUTES.POA_CHECK_YOUR_DETAILS, {
          claimId: 1,
        }),
      ),
    ).to.equal(true);
  });
});