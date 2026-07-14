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
import { V7Generator } from "uuidv7";
import { DeleteFileRequest } from "#src/types/requests.js";
import { TFunction } from "#node_modules/i18next/index.js";
import { deleteEvidenceFileFromClaim } from "#src/controllers/claims/ajaxFileUploadController.js";
import { uploadService } from "#src/services/uploadService.js";

describe("poaEvidenceUploadController", () => {
  let res: any;
  let next: any;

  let renderStub: sinon.SinonStub;
  let getClaimStub: sinon.SinonStub;
  let deleteEvidenceFromClaimStub: sinon.SinonStub;

  const claimId = new V7Generator().generate();
  const evidenceId = new V7Generator().generate();

  const mockT: TFunction = ((key: string) => key) as TFunction;

  beforeEach(() => {
    renderStub = sinon.stub();

    res = {
      render: renderStub,
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
      redirect: sinon.spy(),
      locals: {
        csrfToken: "test-csrf-token",
      },
    };

    next = sinon.stub();

    getClaimStub = sinon.stub(claimService, "getClaim");
    deleteEvidenceFromClaimStub = sinon.stub(
      uploadService,
      "deleteEvidenceFromClaim",
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("poaEvidenceUploadPage", () => {
    let req: Partial<Request>;

    beforeEach(() => {
      req = {
        axiosMiddleware: {} as any,
        params: {
          claimId: claimId.toString(),
        },
      };
    });

    it("renders the POA evidence upload page", async () => {
      getClaimStub.resolves({
        status: "success",
        body: {
          id: claimId,
          evidence: [],
        },
      });

      await poaEvidenceUploadPage(req as Request, res, next);

      expect(renderStub.calledOnce).to.equal(true);
      expect(renderStub.firstCall.args[0]).to.equal(
        "main/poa/poaEvidenceUploadView.njk",
      );

      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.csrfToken).to.equal("test-csrf-token");
      expect(renderArgs.vm.title).to.equal("pages.poaEvidenceUpload.title");
      expect(renderArgs.vm.uploadUrl).to.equal(
        buildRoute(ROUTES.AJAX_UPLOAD_POA_EVIDENCE, { claimId: claimId }),
      );
      expect(renderArgs.vm.deleteUrl).to.equal(
        buildRoute(ROUTES.AJAX_DELETE_POA_EVIDENCE, { claimId: claimId }),
      );
      expect(renderArgs.vm.saveAndContinueHref).to.equal(
        buildRoute(ROUTES.POA_CHECK_YOUR_DETAILS, { claimId: claimId }),
      );
      expect(renderArgs.vm.saveAndComeBackLaterHref).to.equal("#");
    });
  });

  describe("uploadEvidenceFile", () => {
    let req: Partial<Request>;

    beforeEach(() => {
      req = {
        axiosMiddleware: {} as any,
        params: {
          claimId: claimId.toString(),
        },
      };
    });

    it("redirects to check your details on submit", async () => {
      getClaimStub.resolves({
        status: "success",
        body: {
          id: claimId,
          evidence: [
            {
              id: evidenceId,
              fileKey: "sample.pdf",
              fileSize: 1024,
              submittedOn: new Date(),
            },
          ],
        },
      } as any);

      await submitPoaEvidenceUpload(req as Request, res, next);

      expect(
        (res.redirect as sinon.SinonStub).calledWith(
          buildRoute(ROUTES.POA_CHECK_YOUR_DETAILS, {
            claimId: claimId,
          }),
        ),
      ).to.equal(true);
    });

    it("renders with an error when no evidence has been uploaded", async () => {
      getClaimStub.resolves({
        status: "success",
        body: {
          id: claimId,
          evidence: [],
        },
      } as any);

      (res.status as unknown) = sinon.stub().returns(res);

      await submitPoaEvidenceUpload(req as Request, res, next);

      expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
      expect(renderStub.calledOnce).to.equal(true);

      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.vm.errorSummary.errorList).to.have.length(1);
      expect(renderArgs.vm.errorSummary.errorList[0].text.key).to.equal(
        "multiFileUpload.errors.noFileSelected",
      );
    });
  });

  describe("deleteEvidenceFile", () => {
    let req: DeleteFileRequest;

    beforeEach(() => {
      req = {
        params: {
          claimId: claimId.toString(),
        },
        t: mockT,
      } as unknown as DeleteFileRequest;
    });

    it("deletes an uploaded file", async () => {
      const mockApiResponse = {
        status: "success",
        body: null,
      };

      deleteEvidenceFromClaimStub.resolves(mockApiResponse);

      req.body = {
        delete: evidenceId.toString(),
        name: "file.pdf",
      };

      const status = sinon.stub().returnsThis();
      const json = sinon.stub();

      const res = {
        status,
        json,
      } as unknown as Response;

      const next = sinon.stub();

      await deleteEvidenceFileFromClaim(
        req,
        res,
        next as unknown as NextFunction,
      );

      expect(deleteEvidenceFromClaimStub.calledOnce).to.equal(true);

      expect(json.calledOnce).to.equal(true);

      const responseBody = json.firstCall.args[0];

      expect(responseBody).to.deep.equal(mockApiResponse);

      expect(status.called).to.equal(false);

      expect(next.called).to.equal(false);
    });

    it("returns 400 for an empty file ID", async () => {
      req.body = {
        delete: "",
        name: "file.pdf",
      };

      const status = sinon.stub().returnsThis();
      const json = sinon.stub();

      const res = {
        status,
        json,
      } as unknown as Response;

      const next = sinon.stub();

      await deleteEvidenceFileFromClaim(
        req,
        res,
        next as unknown as NextFunction,
      );

      expect(status.calledWith(400)).to.equal(true);
      expect(json.firstCall.args[0]).to.deep.equal({
        error: {
          message: "multiFileUpload.errors.missingFileId",
        },
      });
      expect(next.called).to.equal(false);
    });
  });
});
