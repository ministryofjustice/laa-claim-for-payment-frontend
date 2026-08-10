import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import {
  getFileRow,
  uploadEvidenceFile,
  uploadEvidenceFileForLineItem,
} from "#src/controllers/claims/ajaxFileUploadController.js";
import type { MulterRequest } from "#src/types/requests.js";
import { uploadService } from "#src/services/uploadService.js";
import type { TFunction } from "#node_modules/i18next/index.js";
import { V7Generator } from "uuidv7";
import { AjaxUploadResponse } from "#src/types/api-types.js";
import { ClaimStatus } from "#src/types/Claim.js";

describe("ajaxFileUploadController", () => {
  let res: Response;
  let next: NextFunction;

  const mockT: TFunction = ((key: string) => key) as TFunction;

  const claimId = new V7Generator().generate();
  const lineItemId = new V7Generator().generate();
  const evidenceId = new V7Generator().generate();

  beforeEach(() => {
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    } as unknown as Response;

    next = sinon.stub() as unknown as NextFunction;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("uploadEvidenceFile", () => {
    let req: MulterRequest;
    let uploadEvidenceStub: sinon.SinonStub;

    beforeEach(() => {
      req = {
        params: {
          claimId: claimId.toString(),
        },
        query: {
          claimStatus: ClaimStatus.DRAFT,
        },
        t: mockT,
        file: {
          filename: "abc123",
          originalname: "evidence.pdf",
          size: 12345,
          mimetype: "application/pdf",
          buffer: Buffer.from("fake pdf content"),
        } as Express.Multer.File,
      } as unknown as MulterRequest;

      uploadEvidenceStub = sinon.stub(uploadService, "uploadEvidence");
    });

    it("returns 400 when no file is selected", async () => {
      req.file = undefined;

      await uploadEvidenceFile(req, res, next);

      expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
      expect((res.json as sinon.SinonStub).firstCall.args[0]).to.deep.equal({
        status: "error",
        error: {
          message: "multiFileUpload.errors.noFileSelected",
        },
      });
      expect(uploadEvidenceStub.called).to.equal(false);
      expect((next as sinon.SinonStub).called).to.equal(false);
    });

    it("returns 400 when claim status is undefined", async () => {
      req.query = {};

      await uploadEvidenceFile(req, res, next);

      expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
      expect((res.json as sinon.SinonStub).firstCall.args[0]).to.deep.equal({
        status: "error",
        error: {
          message: "multiFileUpload.errors.invalidClaimStatus",
        },
      });
      expect(uploadEvidenceStub.called).to.equal(false);
      expect((next as sinon.SinonStub).called).to.equal(false);
    });

    it("returns 400 when claim status is invalid", async () => {
      req.query = { claimStatus: "foo" };

      await uploadEvidenceFile(req, res, next);

      expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
      expect((res.json as sinon.SinonStub).firstCall.args[0]).to.deep.equal({
        status: "error",
        error: {
          message: "multiFileUpload.errors.invalidClaimStatus",
        },
      });
      expect(uploadEvidenceStub.called).to.equal(false);
      expect((next as sinon.SinonStub).called).to.equal(false);
    });

    it("returns 400 when selected file is empty", async () => {
      req.file = {
        originalname: "empty.pdf",
        size: 0,
        mimetype: "application/pdf",
        buffer: Buffer.from(""),
      } as Express.Multer.File;

      await uploadEvidenceFile(req, res, next);

      expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
      expect((res.json as sinon.SinonStub).firstCall.args[0]).to.deep.equal({
        status: "error",
        error: {
          message: "multiFileUpload.errors.emptyFile",
        },
      });
      expect(uploadEvidenceStub.called).to.equal(false);
      expect((next as sinon.SinonStub).called).to.equal(false);
    });

    it("uploads POA evidence successfully", async () => {
      const mockApiResponse: AjaxUploadResponse = {
        status: "success",
        success: {
          messageText: "evidence.pdf uploaded",
          messageHtml: "<span>Uploaded</span>",
        },
        file: {
          id: "019fcb9c-2556-747c-a515-9d67143d5fd9",
          filename: evidenceId.toString(),
          originalname: "evidence.pdf",
          size: "123KB",
        },
      };

      uploadEvidenceStub.resolves(mockApiResponse);

      await uploadEvidenceFile(req, res, next);

      expect(uploadEvidenceStub.calledOnce).to.equal(true);
      expect(uploadEvidenceStub.calledWith(req.axiosMiddleware)).to.equal(true);
      expect(uploadEvidenceStub.firstCall.args[1]).to.deep.equal(claimId);
      expect(uploadEvidenceStub.firstCall.args[2]).to.equal(req.file);

      expect((res.json as sinon.SinonStub).calledOnce).to.equal(true);
      expect((res.json as sinon.SinonStub).firstCall.args[0]).to.deep.equal(
        mockApiResponse,
      );

      expect((res.status as sinon.SinonStub).called).to.equal(false);
      expect((next as sinon.SinonStub).called).to.equal(false);
    });
  });

  describe("uploadEvidenceFileForLineItem", () => {
    let req: MulterRequest;
    let uploadLineItemEvidenceStub: sinon.SinonStub;

    beforeEach(() => {
      req = {
        params: {
          claimId: claimId.toString(),
          lineItemId: lineItemId.toString(),
        },
        t: mockT,
      } as unknown as MulterRequest;

      uploadLineItemEvidenceStub = sinon.stub(
        uploadService,
        "uploadLineItemEvidence",
      );
    });

    it("returns 400 when no file is selected", async () => {
      req.file = undefined;

      await uploadEvidenceFileForLineItem(req, res, next);

      expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
      expect((res.json as sinon.SinonStub).firstCall.args[0]).to.deep.equal({
        status: "error",
        error: {
          message: "multiFileUpload.errors.noFileSelected",
        },
      });
      expect(uploadLineItemEvidenceStub.called).to.equal(false);
      expect((next as sinon.SinonStub).called).to.equal(false);
    });

    it("returns 400 when selected file is empty", async () => {
      req.file = {
        originalname: "empty.pdf",
        size: 0,
        mimetype: "application/pdf",
        buffer: Buffer.from(""),
      } as Express.Multer.File;

      await uploadEvidenceFileForLineItem(req, res, next);

      expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
      expect((res.json as sinon.SinonStub).firstCall.args[0]).to.deep.equal({
        status: "error",
        error: {
          message: "multiFileUpload.errors.emptyFile",
        },
      });
      expect(uploadLineItemEvidenceStub.called).to.equal(false);
      expect((next as sinon.SinonStub).called).to.equal(false);
    });

    it("uploads line item evidence successfully", async () => {
      const mockApiResponse: AjaxUploadResponse = {
        status: "success",
        success: {
          messageText: "evidence.pdf uploaded",
          messageHtml: "<span>Uploaded</span>",
        },
        file: {
          id: "019fcb9c-2556-747c-a515-9d67143d5fd9",
          filename: evidenceId.toString(),
          originalname: "evidence.pdf",
          size: "123KB",
        },
      };

      uploadLineItemEvidenceStub.resolves(mockApiResponse);

      req.file = {
        filename: evidenceId.toString(),
        originalname: "evidence.pdf",
        size: 12345,
        mimetype: "application/pdf",
        buffer: Buffer.from("fake pdf content"),
      } as Express.Multer.File;

      await uploadEvidenceFileForLineItem(req, res, next);

      expect(uploadLineItemEvidenceStub.calledOnce).to.equal(true);
      expect(
        uploadLineItemEvidenceStub.calledWith(req.axiosMiddleware),
      ).to.equal(true);
      expect(uploadLineItemEvidenceStub.firstCall.args[1]).to.deep.equal(
        claimId,
      );
      expect(uploadLineItemEvidenceStub.firstCall.args[2]).to.deep.equal(
        lineItemId,
      );
      expect(uploadLineItemEvidenceStub.firstCall.args[3]).to.equal(req.file);

      expect((res.json as sinon.SinonStub).calledOnce).to.equal(true);
      expect((res.json as sinon.SinonStub).firstCall.args[0]).to.deep.equal(
        mockApiResponse,
      );

      expect((res.status as sinon.SinonStub).called).to.equal(false);
      expect((next as sinon.SinonStub).called).to.equal(false);
    });
  });

  describe("getFileRow", () => {
    let req: Partial<Request>;
    let uploadEvidenceStub: sinon.SinonStub;

    describe("uploaded", () => {
      beforeEach(() => {
        uploadEvidenceStub = sinon.stub(uploadService, "getUploadedFileRow");
      });

      it("gets an uploaded row", () => {
        req = {
          query: {
            status: "success",
            fileName: "evidence.pdf",
            fileId: "019fcb9c-2556-747c-a515-9d67143d5fd9",
            fileSize: "123KB",
          },
        };

        const dummyHtml = "<div>Something</div>"

        uploadEvidenceStub.returns(dummyHtml);

        getFileRow(req as Request, res, next);

        expect((res.json as sinon.SinonStub).firstCall.args[0]).to.deep.equal({
          body: dummyHtml,
        });
      });

      it("fails to get an uploaded row when query params missing", () => {
        req = {
          query: {
            status: "success",
          },
        };

        const dummyHtml = "<div>Something</div>"

        uploadEvidenceStub.returns(dummyHtml);

        getFileRow(req as Request, res, next);

        expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
      });
    });

    describe("uploading", () => {
      beforeEach(() => {
        uploadEvidenceStub = sinon.stub(uploadService, "getUploadingFileRow");
      });

      it("gets an uploading row", () => {
        req = {
          query: {
            status: "pending",
            fileName: "evidence.pdf",
          },
        };

        const dummyHtml = "<div>Something</div>"

        uploadEvidenceStub.returns(dummyHtml);

        getFileRow(req as Request, res, next);

        expect((res.json as sinon.SinonStub).firstCall.args[0]).to.deep.equal({
          body: dummyHtml,
        });
      });

      it("fails to get an uploading row when query params missing", () => {
        req = {
          query: {
            status: "pending",
          },
        };

        const dummyHtml = "<div>Something</div>"

        uploadEvidenceStub.returns(dummyHtml);

        getFileRow(req as Request, res, next);

        expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
      });
    });

    describe("failed", () => {
      beforeEach(() => {
        uploadEvidenceStub = sinon.stub(uploadService, "getFailedFileRow");
      });

      it("gets a failed row", () => {
        req = {
          query: {
            status: "failed",
            fileName: "evidence.pdf",
            message: "Upload failed",
          },
        };

        const dummyHtml = "<div>Something</div>"

        uploadEvidenceStub.returns(dummyHtml);

        getFileRow(req as Request, res, next);

        expect(uploadEvidenceStub.firstCall.args[1]).to.deep.equal({
          name: "evidence.pdf",
          message: "Upload failed",
        });

        expect((res.json as sinon.SinonStub).firstCall.args[0]).to.deep.equal({
          body: dummyHtml,
        });
      });

      it("gets a failed row with default message", () => {
        req = {
          query: {
            status: "failed",
            fileName: "evidence.pdf",
          },
          t: mockT,
        };

        const dummyHtml = "<div>Something</div>"

        uploadEvidenceStub.returns(dummyHtml);

        getFileRow(req as Request, res, next);

        expect(uploadEvidenceStub.firstCall.args[1]).to.deep.equal({
          name: "evidence.pdf",
          message: "multiFileUpload.errors.uploadFailed",
        });

        expect((res.json as sinon.SinonStub).firstCall.args[0]).to.deep.equal({
          body: dummyHtml,
        });
      });

      it("fails to get a failed row when query params missing", () => {
        req = {
          query: {
            status: "failed",
          },
        };

        const dummyHtml = "<div>Something</div>"

        uploadEvidenceStub.returns(dummyHtml);

        getFileRow(req as Request, res, next);

        expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
      });
    });

    it("fails to get a row when the status is invalid", () => {
      req = {
        query: {
          status: "foo",
        },
      };

      getFileRow(req as Request, res, next);

      expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
    });
  });
});
