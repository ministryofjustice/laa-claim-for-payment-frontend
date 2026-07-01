import { expect } from "chai";
import { beforeEach, afterEach, describe, it } from "mocha";
import sinon from "sinon";
import type { NextFunction, Response } from "express";
import {
  uploadEvidenceFile,
  uploadEvidenceFileForLineItem,
} from "#src/controllers/claims/ajaxFileUploadController.js";
import type { MulterRequest } from "#src/types/requests.js";
import { uploadService } from "#src/services/uploadService.js";

describe("ajaxFileUploadController", () => {
  let res: Response;
  let next: NextFunction;

  const t = ((key: string) => key) as MulterRequest["t"];

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
    it("returns 400 when no file is selected", async () => {
      const req = {
        params: { claimId: "1" },
        file: undefined,
        t,
      } as unknown as MulterRequest;

      await uploadEvidenceFile(req, res, next);

      expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
      expect((res.json as sinon.SinonStub).calledWith({
        error: {
          message: "multiFileUpload.errors.noFileSelected",
        },
      })).to.equal(true);
    });

    it("returns 400 when selected file is empty", async () => {
      const req = {
        params: { claimId: "1" },
        file: {
          originalname: "empty.pdf",
          size: 0,
          mimetype: "application/pdf",
          buffer: Buffer.from(""),
        },
        t,
      } as unknown as MulterRequest;

      await uploadEvidenceFile(req, res, next);

      expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
      expect((res.json as sinon.SinonStub).calledWith({
        error: {
          message: "multiFileUpload.errors.emptyFile",
        },
      })).to.equal(true);
    });
  });

  describe("uploadEvidenceFileForLineItem", () => {
    it("returns 400 when no file is selected", async () => {
      const req = {
        params: { claimId: "1", lineItemId: "2" },
        file: undefined,
        t,
      } as unknown as MulterRequest;

      await uploadEvidenceFileForLineItem(req, res, next);

      expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
      expect((res.json as sinon.SinonStub).calledWith({
        error: {
          message: "multiFileUpload.errors.noFileSelected",
        },
      })).to.equal(true);
    });

    it("returns 400 when selected file is empty", async () => {
      const req = {
        params: { claimId: "1", lineItemId: "2" },
        file: {
          originalname: "empty.pdf",
          size: 0,
          mimetype: "application/pdf",
          buffer: Buffer.from(""),
        },
        t,
      } as unknown as MulterRequest;

      await uploadEvidenceFileForLineItem(req, res, next);

      expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
      expect((res.json as sinon.SinonStub).calledWith({
        error: {
          message: "multiFileUpload.errors.emptyFile",
        },
      })).to.equal(true);
    });

    it("uploads evidence successfully", async () => {
      const uploadStub = sinon.stub(uploadService, "uploadLineItemEvidence").resolves({
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
      } as any);

      const file = {
        originalname: "evidence.pdf",
        size: 12345,
        mimetype: "application/pdf",
        buffer: Buffer.from("fake pdf content"),
      } as Express.Multer.File;

      const req = {
        params: {
          claimId: "1",
          lineItemId: "2",
        },
        axiosMiddleware: {},
        file,
        t: ((key: string) => key) as any,
      } as unknown as MulterRequest;

      await uploadEvidenceFileForLineItem(req, res, next);

      expect(uploadStub.calledOnce).to.equal(true);

      expect(uploadStub.firstCall.args[1]).to.equal(1);
      expect(uploadStub.firstCall.args[2]).to.equal(2);
      expect(uploadStub.firstCall.args[3]).to.equal(file);

      expect((res.json as sinon.SinonStub).calledOnce).to.equal(true);
      expect((res.json as sinon.SinonStub).firstCall.args[0]).to.deep.equal({
        success: {
          messageText: "evidence.pdf uploaded",
          messageHtml: "<span>Uploaded</span>",
        },
        file: {
          filename: "1",
          originalname: "evidence.pdf",
        },
      });

      expect((res.status as sinon.SinonStub).called).to.equal(false);
      expect((next as sinon.SinonStub).called).to.equal(false);
    });
  });
});