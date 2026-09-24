import { expect } from "chai";
import sinon from "sinon";
import {
  AjaxUploadError,
  AjaxUploadSuccess,
  ApiError, ApiResponse,
} from "#src/types/api-types.js";
import { uploadService } from "#src/services/uploadService.js";
import { V7Generator } from "uuidv7";
import { ClaimStatus } from "#src/types/Claim.js";
import { TFunction } from "#node_modules/i18next/index.js";
import { UploadSuccess } from "#src/generated/claim-api/index.js";

describe("Upload Service", () => {
  afterEach(() => {
    sinon.restore();
  });

  const claimId = new V7Generator().generate();
  const lineItemId = new V7Generator().generate();
  const evidence1Id = new V7Generator().generate();
  const evidence2Id = new V7Generator().generate();
  const evidence3Id = new V7Generator().generate();

  describe("uploadEvidence", () => {
    it("returns success", async () => {
      const mockApiResponse = {
        data: {
          type: "success",
          evidenceId: evidence1Id.toString(),
          file: {
            filename: "evidence.pdf",
            originalname: "evidence.pdf",
            filesize: 12345,
          },
          message: `File uploaded with ID: ${evidence1Id.toString()}`,
        },
      };

      const deps = {
        createClient: sinon.stub().returns({}),
        uploadClaimEvidence: sinon.stub().resolves(mockApiResponse),
      };

      const file = {
        originalname: "evidence.pdf",
        mimetype: "application/pdf",
        size: 12345,
        buffer: Buffer.from("fake pdf content"),
      } as Express.Multer.File;

      const result = (await uploadService.uploadEvidence(
        { axiosInstance: {} } as any,
        claimId,
        file,
        ClaimStatus.DRAFT,
        deps as any,
      )) as ApiResponse<UploadSuccess>;

      expect(result.status).to.equal("success");
      expect(result.body?.type).to.equal("success");
      expect(result.body?.evidenceId).to.equal(evidence1Id.toString());
      expect(result.body?.file.filename).to.equal("evidence.pdf",);
      expect(result.body?.file.originalname).to.equal("evidence.pdf",);
      expect(result.body?.file.filesize).to.equal(12345);
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
              instance: `/api/v1/claims/${claimId}/upload-evidence`,
              status: 404,
              title: "Not found",
              correlationId: "b7d7c91f-950a-43f6-a8de-ffb37f1001c1",
              errorCode: "NOT_FOUND",
            },
          },
        }),
      };

      const file = {
        originalname: "evidence.pdf",
        mimetype: "application/pdf",
        size: 12345,
        buffer: Buffer.from("fake pdf content"),
      } as Express.Multer.File;

      const result = (await uploadService.uploadEvidence(
        { axiosInstance: {} } as any,
        claimId,
        file,
        deps as any,
      )) as ApiResponse<UploadSuccess>;

      expect(result.status).to.equal("error");
    });

    it("returns error shape when the API call fails", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        uploadClaimEvidence: sinon.stub().rejects(new Error("boom")),
      };

      const file = {
        originalname: "evidence.pdf",
        mimetype: "application/pdf",
        size: 12345,
        buffer: Buffer.from("fake pdf content"),
      } as Express.Multer.File;

      const result = (await uploadService.uploadEvidence(
        { axiosInstance: {} } as any,
        claimId,
        file,
        deps as any,
      )) as ApiResponse<UploadSuccess>;

      expect(result.status).to.equal("error");
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
        claimId,
        lineItemId,
        [evidence1Id, evidence2Id, evidence3Id],
        deps as any,
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
              instance: `/api/v1/claims/${claimId}/line-items/${lineItemId}/evidence`,
              status: 404,
              title: "Not found",
              correlationId: "b7d7c91f-950a-43f6-a8de-ffb37f1001c1",
              errorCode: "NOT_FOUND",
            },
          },
        }),
      };

      const result = (await uploadService.linkEvidenceToLineItem(
        { axiosInstance: {} } as any,
        claimId,
        lineItemId,
        [evidence1Id, evidence2Id, evidence3Id],
        deps as any,
      )) as ApiError;

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
        claimId,
        lineItemId,
        [evidence1Id, evidence2Id, evidence3Id],
        deps as any,
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
          type: "success",
          evidenceId: evidence3Id.toString(),
          file: {
            filename: "evidence.pdf",
            originalname: "evidence.pdf",
            filesize: 12345,
          },
          message: `File uploaded with ID: ${evidence3Id.toString()} and linked to line item: ${lineItemId.toString()}`,
        },
      };

      const deps = {
        createClient: sinon.stub().returns({}),
        getClaims: sinon.stub(),
        getClaim: sinon.stub(),
        linkEvidenceToLineItem: sinon.stub(),
        uploadLineItemEvidence: sinon.stub().resolves(mockApiResponse),
      };

      const file = {
        originalname: "evidence.pdf",
        mimetype: "application/pdf",
        size: 12345,
        buffer: Buffer.from("fake pdf content"),
      } as Express.Multer.File;

      const result = (await uploadService.uploadLineItemEvidence(
        { axiosInstance: {} } as any,
        claimId,
        lineItemId,
        file,
        deps as any,
      )) as ApiResponse<UploadSuccess>;

      expect(result.status).to.equal("success");
      expect(result.body?.type).to.equal("success");
      expect(result.body?.evidenceId).to.equal(evidence3Id.toString());
      expect(result.body?.file.filename).to.equal("evidence.pdf",);
      expect(result.body?.file.originalname).to.equal("evidence.pdf",);
      expect(result.body?.file.filesize).to.equal(12345);
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
              instance: `/api/v1/claims/${claimId}/line-items/${lineItemId}/upload-evidence`,
              status: 404,
              title: "Not found",
              correlationId: "b7d7c91f-950a-43f6-a8de-ffb37f1001c1",
              errorCode: "NOT_FOUND",
            },
          },
        }),
      };

      const file = {
        originalname: "evidence.pdf",
        mimetype: "application/pdf",
        size: 12345,
        buffer: Buffer.from("fake pdf content"),
      } as Express.Multer.File;

      const result = (await uploadService.uploadLineItemEvidence(
        { axiosInstance: {} } as any,
        claimId,
        lineItemId,
        file,
        deps as any,
      )) as ApiResponse<UploadSuccess>;

      expect(result.status).to.equal("error");
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
        originalname: "evidence.pdf",
        mimetype: "application/pdf",
        size: 12345,
        buffer: Buffer.from("fake pdf content"),
      } as Express.Multer.File;

      const result = (await uploadService.uploadLineItemEvidence(
        { axiosInstance: {} } as any,
        claimId,
        lineItemId,
        file,
        deps as any,
      )) as ApiResponse<UploadSuccess>;

      expect(result.status).to.equal("error");
    });
  });
});
