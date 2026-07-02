import { expect } from "chai";
import sinon from "sinon";
import { ApiError } from "#src/types/api-types.js";
import { uploadService } from "#src/services/uploadService.js";

describe("Upload Service", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("uploadEvidence", () => {
    it("returns success", async () => {
      const mockApiResponse = {
        data: {
          type: 'success',
          evidenceId: 3,
          file: {
            filename: 'evidence.pdf',
            originalname: 'evidence.pdf',
            filesize: 12345,
          },
          message: "File uploaded with ID: 3",
        }
      };

      const deps = {
        createClient: sinon.stub().returns({}),
        uploadClaimEvidence: sinon.stub().resolves(mockApiResponse),
      };

      const file = {
        originalname: 'evidence.pdf',
        mimetype: 'application/pdf',
        size: 12345,
        buffer: Buffer.from('fake pdf content'),
      } as Express.Multer.File;

      const translations = {
        uploaded: 'Uploaded',
        uploadedMessage: 'evidence.pdf uploaded',
      };

      const result = await uploadService.uploadEvidence(
        { axiosInstance: {} } as any,
        1,
        file,
        translations,
        deps as any
      );

      expect(result.status).to.equal("success");
      expect(result.body?.file).to.deep.equal({
        filename: '3',
        originalname: 'evidence.pdf',
      });
      expect(result.body?.success.messageText).to.equal('evidence.pdf uploaded');
      expect(result.body?.success.messageHtml).to.include('evidence.pdf');
      expect(result.body?.success.messageHtml).to.include('12KB');
      expect(result.body?.success.messageHtml).to.include('Uploaded');
    });

    it('escapes file names in the success HTML', async () => {
      const mockApiResponse = {
        data: {
          type: 'success',
          evidenceId: 3,
          file: {
            filename: '<script>.pdf',
            originalname: '<script>.pdf',
            filesize: 12345,
          },
          message: "File uploaded with ID: 3 and linked to line item: 2",
        }
      };

      const deps = {
        createClient: sinon.stub().returns({}),
        uploadClaimEvidence: sinon.stub().resolves(mockApiResponse),
      };

      const file = {
        originalname: '<script>.pdf',
        mimetype: 'application/pdf',
        size: 12345,
        buffer: Buffer.from('fake pdf content'),
      } as Express.Multer.File;

      const translations = {
        uploaded: 'Uploaded',
        uploadedMessage: '<script>.pdf uploaded',
      };

      const result = await uploadService.uploadEvidence(
        { axiosInstance: {} } as any,
        1,
        file,
        translations,
        deps as any
      );

      expect(result.body?.success.messageHtml).to.include('&lt;script&gt;.pdf');
    });

    it("returns error for a non-200 response", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        uploadClaimEvidence: sinon.stub().rejects({
          isAxiosError: true,
          response: {
            status: 404,
            data: {
              detail: "Resource not found",
              instance: "/api/v1/claims/1/upload-evidence",
              status: 404,
              title: "Not found",
              correlationId: "b7d7c91f-950a-43f6-a8de-ffb37f1001c1",
              errorCode: "NOT_FOUND",
            },
          },
        }),
      };

      const file = {
        originalname: 'evidence.pdf',
        mimetype: 'application/pdf',
        size: 12345,
        buffer: Buffer.from('fake pdf content'),
      } as Express.Multer.File;

      const translations = {
        uploaded: 'Uploaded',
        uploadedMessage: 'evidence.pdf uploaded',
      };

      const result = await uploadService.uploadEvidence(
        { axiosInstance: {} } as any,
        1,
        file,
        translations,
        deps as any
      ) as ApiError;

      expect(result.status).to.equal("error");
      expect(result.statusCode).to.equal(404);
      expect(result.message).to.equal("Resource not found");
    });

    it("returns error shape when the API call fails", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        uploadClaimEvidence: sinon.stub().rejects(new Error("boom")),
      };

      const file = {
        originalname: 'evidence.pdf',
        mimetype: 'application/pdf',
        size: 12345,
        buffer: Buffer.from('fake pdf content'),
      } as Express.Multer.File;

      const translations = {
        uploaded: 'Uploaded',
        uploadedMessage: 'evidence.pdf uploaded',
      };

      const result = await uploadService.uploadEvidence(
        { axiosInstance: {} } as any,
        1,
        file,
        translations,
        deps as any
      );

      expect(result.status).to.equal("error");
      expect(result.message).to.be.a("string").and.not.empty;
      expect(result).to.not.have.property("body");
    });
  });

  describe("linkEvidenceToLineItem", () => {
    it("returns success", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        getClaims: sinon.stub(),
        getClaim: sinon.stub(),
        linkEvidenceToLineItem: sinon.stub().resolves(null),
      };

      const result = await uploadService.linkEvidenceToLineItem(
        { axiosInstance: {} } as any,
        1,
        2,
        [3, 4, 5],
        deps as any
      );

      expect(result.status).to.equal("success");
      expect(result.body).to.be.null;
    });

    it("returns error for a non-200 response", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        getClaims: sinon.stub(),
        getClaim: sinon.stub(),
        linkEvidenceToLineItem: sinon.stub().rejects({
          isAxiosError: true,
          response: {
            status: 404,
            data: {
              detail: "Resource not found",
              instance: "/api/v1/claims/1/line-items/2/evidence",
              status: 404,
              title: "Not found",
              correlationId: "b7d7c91f-950a-43f6-a8de-ffb37f1001c1",
              errorCode: "NOT_FOUND",
            },
          },
        }),
      };

      const result = await uploadService.linkEvidenceToLineItem(
        { axiosInstance: {} } as any,
        1,
        2,
        [3, 4, 5],
        deps as any
      ) as ApiError;

      expect(result.status).to.equal("error");
      expect(result.statusCode).to.equal(404);
      expect(result.message).to.equal("Resource not found");
    });

    it("returns error shape when the API call fails", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        getClaims: sinon.stub(),
        getClaim: sinon.stub(),
        linkEvidenceToLineItem: sinon.stub().rejects(new Error("boom")),
      };

      const result = await uploadService.linkEvidenceToLineItem(
        { axiosInstance: {} } as any,
        1,
        2,
        [3, 4, 5],
        deps as any
      );

      expect(result.status).to.equal("error");
      expect(result.message).to.be.a("string").and.not.empty;
      expect(result).to.not.have.property("body");
    });
  });

  describe("uploadLineItemEvidence", () => {
    it("returns success", async () => {
      const mockApiResponse = {
        data: {
          type: 'success',
          evidenceId: 3,
          file: {
            filename: 'evidence.pdf',
            originalname: 'evidence.pdf',
            filesize: 12345,
          },
          message: "File uploaded with ID: 3 and linked to line item: 2",
        }
      };

      const deps = {
        createClient: sinon.stub().returns({}),
        getClaims: sinon.stub(),
        getClaim: sinon.stub(),
        linkEvidenceToLineItem: sinon.stub(),
        uploadLineItemEvidence: sinon.stub().resolves(mockApiResponse),
      };

      const file = {
        originalname: 'evidence.pdf',
        mimetype: 'application/pdf',
        size: 12345,
        buffer: Buffer.from('fake pdf content'),
      } as Express.Multer.File;

      const translations = {
        uploaded: 'Uploaded',
        uploadedMessage: 'evidence.pdf uploaded',
      };

      const result = await uploadService.uploadLineItemEvidence(
        { axiosInstance: {} } as any,
        1,
        2,
        file,
        translations,
        deps as any
      );

      expect(result.status).to.equal("success");
      expect(result.body?.file).to.deep.equal({
        filename: '3',
        originalname: 'evidence.pdf',
      });
      expect(result.body?.success.messageText).to.equal('evidence.pdf uploaded');
      expect(result.body?.success.messageHtml).to.include('evidence.pdf');
      expect(result.body?.success.messageHtml).to.include('12KB');
      expect(result.body?.success.messageHtml).to.include('Uploaded');
    });

    it('escapes file names in the success HTML', async () => {
      const mockApiResponse = {
        data: {
          type: 'success',
          evidenceId: 3,
          file: {
            filename: '<script>.pdf',
            originalname: '<script>.pdf',
            filesize: 12345,
          },
          message: "File uploaded with ID: 3 and linked to line item: 2",
        }
      };

      const deps = {
        createClient: sinon.stub().returns({}),
        getClaims: sinon.stub(),
        getClaim: sinon.stub(),
        linkEvidenceToLineItem: sinon.stub(),
        uploadLineItemEvidence: sinon.stub().resolves(mockApiResponse),
      };

      const file = {
        originalname: '<script>.pdf',
        mimetype: 'application/pdf',
        size: 12345,
        buffer: Buffer.from('fake pdf content'),
      } as Express.Multer.File;

      const translations = {
        uploaded: 'Uploaded',
        uploadedMessage: '<script>.pdf uploaded',
      };

      const result = await uploadService.uploadLineItemEvidence(
        { axiosInstance: {} } as any,
        1,
        2,
        file,
        translations,
        deps as any
      );

      expect(result.body?.success.messageHtml).to.include('&lt;script&gt;.pdf');
    });

    it("returns error for a non-200 response", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        getClaims: sinon.stub(),
        getClaim: sinon.stub(),
        linkEvidenceToLineItem: sinon.stub(),
        uploadLineItemEvidence: sinon.stub().rejects({
          isAxiosError: true,
          response: {
            status: 404,
            data: {
              detail: "Resource not found",
              instance: "/api/v1/claims/1/line-items/2/upload-evidence",
              status: 404,
              title: "Not found",
              correlationId: "b7d7c91f-950a-43f6-a8de-ffb37f1001c1",
              errorCode: "NOT_FOUND",
            },
          },
        }),
      };

      const file = {
        originalname: 'evidence.pdf',
        mimetype: 'application/pdf',
        size: 12345,
        buffer: Buffer.from('fake pdf content'),
      } as Express.Multer.File;

      const translations = {
        uploaded: 'Uploaded',
        uploadedMessage: 'evidence.pdf uploaded',
      };

      const result = await uploadService.uploadLineItemEvidence(
        { axiosInstance: {} } as any,
        1,
        2,
        file,
        translations,
        deps as any
      ) as ApiError;

      expect(result.status).to.equal("error");
      expect(result.statusCode).to.equal(404);
      expect(result.message).to.equal("Resource not found");
    });

    it("returns error shape when the API call fails", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        getClaims: sinon.stub(),
        getClaim: sinon.stub(),
        linkEvidenceToLineItem: sinon.stub(),
        uploadLineItemEvidence: sinon.stub().rejects(new Error("boom")),
      };

      const file = {
        originalname: 'evidence.pdf',
        mimetype: 'application/pdf',
        size: 12345,
        buffer: Buffer.from('fake pdf content'),
      } as Express.Multer.File;

      const translations = {
        uploaded: 'Uploaded',
        uploadedMessage: 'evidence.pdf uploaded',
      };

      const result = await uploadService.uploadLineItemEvidence(
        { axiosInstance: {} } as any,
        1,
        2,
        file,
        translations,
        deps as any
      );

      expect(result.status).to.equal("error");
      expect(result.message).to.be.a("string").and.not.empty;
      expect(result).to.not.have.property("body");
    });
  });
});