import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "mocha";
import sinon from "sinon";
import type { NextFunction, Response } from "express";
import "#utils/axiosSetup.js";
import {
  uploadEvidenceFile,
  uploadEvidenceFileForLineItem,
} from "#src/controllers/claims/ajaxFileUploadController.js";
import type { MulterRequest } from "#src/types/requests.js";
import { uploadService } from "#src/services/uploadService.js";
import type { TFunction } from "#node_modules/i18next/index.js";

describe("ajaxFileUploadController", () => {
  let res: Response;
  let next: NextFunction;

  const mockT: TFunction = ((key: string) => key) as TFunction;

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
          claimId: "1",
        },
        t: mockT,
      } as unknown as MulterRequest;

      uploadEvidenceStub = sinon.stub(uploadService, "uploadEvidence");
    });

    it("returns 400 when no file is selected", async () => {
      req.file = undefined;

      await uploadEvidenceFile(req, res, next);

      expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
      expect((res.json as sinon.SinonStub).firstCall.args[0]).to.deep.equal({
        error: {
          message: "multiFileUpload.errors.noFileSelected",
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
        error: {
          message: "multiFileUpload.errors.emptyFile",
        },
      });
      expect(uploadEvidenceStub.called).to.equal(false);
      expect((next as sinon.SinonStub).called).to.equal(false);
    });

    it("uploads POA evidence successfully", async () => {
      const mockApiResponse = {
        status: "success",
        body: {
          success: {
            messageText: "evidence.pdf uploaded",
            messageHtml: "<span>Uploaded</span>",
          },
          file: {
            filename: "1",
            originalname: "evidence.pdf",
          },
        },
      };

      uploadEvidenceStub.resolves(mockApiResponse);

      req.file = {
        filename: "abc123",
        originalname: "evidence.pdf",
        size: 12345,
        mimetype: "application/pdf",
        buffer: Buffer.from("fake pdf content"),
      } as Express.Multer.File;

      await uploadEvidenceFile(req, res, next);

      expect(uploadEvidenceStub.calledOnce).to.equal(true);
      expect(uploadEvidenceStub.calledWith(req.axiosMiddleware)).to.equal(true);
      expect(uploadEvidenceStub.firstCall.args[1]).to.equal(1);
      expect(uploadEvidenceStub.firstCall.args[2]).to.equal(req.file);

      expect((res.json as sinon.SinonStub).calledOnce).to.equal(true);
      expect((res.json as sinon.SinonStub).firstCall.args[0]).to.deep.equal(
        mockApiResponse.body,
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
          claimId: "1",
          lineItemId: "2",
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
        error: {
          message: "multiFileUpload.errors.emptyFile",
        },
      });
      expect(uploadLineItemEvidenceStub.called).to.equal(false);
      expect((next as sinon.SinonStub).called).to.equal(false);
    });

    it("uploads line item evidence successfully", async () => {
      const mockApiResponse = {
        status: "success",
        body: {
          success: {
            messageText: "evidence.pdf uploaded",
            messageHtml: "<span>Uploaded</span>",
          },
          file: {
            filename: "1",
            originalname: "evidence.pdf",
          },
        },
      };

      uploadLineItemEvidenceStub.resolves(mockApiResponse);

      req.file = {
        filename: "abc123",
        originalname: "evidence.pdf",
        size: 12345,
        mimetype: "application/pdf",
        buffer: Buffer.from("fake pdf content"),
      } as Express.Multer.File;

      await uploadEvidenceFileForLineItem(req, res, next);

      expect(uploadLineItemEvidenceStub.calledOnce).to.equal(true);
      expect(uploadLineItemEvidenceStub.calledWith(req.axiosMiddleware)).to.equal(
        true,
      );
      expect(uploadLineItemEvidenceStub.firstCall.args[1]).to.equal(1);
      expect(uploadLineItemEvidenceStub.firstCall.args[2]).to.equal(2);
      expect(uploadLineItemEvidenceStub.firstCall.args[3]).to.equal(req.file);

      expect((res.json as sinon.SinonStub).calledOnce).to.equal(true);
      expect((res.json as sinon.SinonStub).firstCall.args[0]).to.deep.equal(
        mockApiResponse.body,
      );

      expect((res.status as sinon.SinonStub).called).to.equal(false);
      expect((next as sinon.SinonStub).called).to.equal(false);
    });
  });
});