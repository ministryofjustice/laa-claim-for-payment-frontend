import { expect } from "chai";
import sinon from "sinon";
import { claimService } from "#src/services/claimService.js";
import { ApiError } from "#src/types/api-types.js";

describe("Claim Service", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("getClaims", () => {
    it("returns success with paginated claims data", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        getClaims: sinon.stub().resolves({
          data: {
            claims: [
              {
                id: 1,
                ufn: "UFN-1",
                providerUserId: "3fa85f64-5717-4567-b3fc-2c963f66afa6",
                client: "Jane Doe",
                category: "Category A",
                concluded: "2026-03-12",
                feeType: "Fixed",
                claimed: 123.45,
                submissionId: "3fa85f64-5717-4567-b3fc-2c963f66afa7",
              },
            ],
            page: 2,
            limit: 10,
            total: 1,
            totalPages: 1,
          },
        }),
        getClaim: sinon.stub(),
        linkEvidenceToLineItem: sinon.stub(),
      };

      const result = await claimService.getClaims(
        { axiosInstance: {} } as any,
        2,
        10,
        deps as any
      );

      expect(result.status).to.equal("success");
      expect(result.body?.meta).to.include({
        page: 2,
        limit: 10,
        total: 1,
        totalPages: 1,
      });
      expect(result.body?.data).to.deep.equal([
        {
          id: 1,
          ufn: "UFN-1",
          providerUserId: "3fa85f64-5717-4567-b3fc-2c963f66afa6",
          client: "Jane Doe",
          category: "Category A",
          concluded: new Date("2026-03-12"),
          feeType: "Fixed",
          claimed: 123.45,
          submissionId: "3fa85f64-5717-4567-b3fc-2c963f66afa7",
        },
      ]);
    });

    it("returns error for a non-200 response", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        getClaims: sinon.stub().rejects({
          isAxiosError: true,
          response: {
            status: 500,
            data: {
              detail: "An error occurred",
            },
          },
        }),
        getClaim: sinon.stub(),
        linkEvidenceToLineItem: sinon.stub(),
      };

      const result = await claimService.getClaims(
        { axiosInstance: {} } as any,
        2,
        10,
        deps as any
      ) as ApiError;

      expect(result.status).to.equal("error");
      expect(result.statusCode).to.equal(500);
      expect(result.message).to.equal("An error occurred");
    });

    it("returns error shape when the API call fails", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        getClaims: sinon.stub().rejects(new Error("boom")),
        getClaim: sinon.stub(),
        linkEvidenceToLineItem: sinon.stub(),
      };

      const result = await claimService.getClaims(
        { axiosInstance: {} } as any,
        1,
        10,
        deps as any
      );

      expect(result.status).to.equal("error");
      expect(result.message).to.be.a("string").and.not.empty;
      expect(result).to.not.have.property("body");
    });

    it("returns error shape when the response shape is invalid", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        getClaims: sinon.stub().resolves({
          data: { foo: "bar" },
        }),
        getClaim: sinon.stub(),
        linkEvidenceToLineItem: sinon.stub(),
      };

      const result = await claimService.getClaims(
        { axiosInstance: {} } as any,
        1,
        10,
        deps as any
      );

      expect(result.status).to.equal("error");
      expect(result.message).to.be.a("string").and.not.empty;
      expect(result).to.not.have.property("body");
    });
  });

  describe("getClaim", () => {
    it("returns success with a claim", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        getClaims: sinon.stub(),
        getClaim: sinon.stub().resolves({
          data: {
            id: 123,
            ufn: "UFN-123",
            providerUserId: "3fa85f64-5717-4567-b3fc-2c963f66afa6",
            client: "Jane Doe",
            category: "Something",
            concluded: "2024-01-02T10:00:00Z",
            feeType: "Fixed",
            claimed: 4500,
            submissionId: "sub-1",
          },
        }),
        linkEvidenceToLineItem: sinon.stub(),
      };

      const result = await claimService.getClaim(
        { axiosInstance: {} } as any,
        123,
        deps as any
      );

      expect(result.status).to.equal("success");
      expect(result.body).to.deep.equal({
        id: 123,
        ufn: "UFN-123",
        providerUserId: "3fa85f64-5717-4567-b3fc-2c963f66afa6",
        client: "Jane Doe",
        category: "Something",
        concluded: new Date("2024-01-02T10:00:00Z"),
        feeType: "Fixed",
        claimed: 4500,
        submissionId: "sub-1",
      });
    });

    it("returns error for a non-200 response", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        getClaims: sinon.stub(),
        getClaim: sinon.stub().rejects({
          isAxiosError: true,
          response: {
            status: 404,
            data: {
              detail: "Resource not found",
              instance: "/api/v1/claims/123",
              status: 404,
              title: "Not found",
              correlationId: "b7d7c91f-950a-43f6-a8de-ffb37f1001c1",
              errorCode: "NOT_FOUND",
            },
          },
        }),
        linkEvidenceToLineItem: sinon.stub(),
      };

      const result = await claimService.getClaim(
        { axiosInstance: {} } as any,
        123,
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
        getClaim: sinon.stub().rejects(new Error("boom")),
        linkEvidenceToLineItem: sinon.stub(),
      };

      const result = await claimService.getClaim(
        { axiosInstance: {} } as any,
        999,
        deps as any
      );

      expect(result.status).to.equal("error");
      expect(result.message).to.be.a("string").and.not.empty;
      expect(result).to.not.have.property("body");
    });

    it("returns error shape when the response shape is invalid", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        getClaims: sinon.stub(),
        getClaim: sinon.stub().resolves({
          data: { invalid: true },
        }),
        linkEvidenceToLineItem: sinon.stub(),
      };

      const result = await claimService.getClaim(
        { axiosInstance: {} } as any,
        123,
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

      const result = await claimService.linkEvidenceToLineItem(
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

      const result = await claimService.linkEvidenceToLineItem(
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

      const result = await claimService.linkEvidenceToLineItem(
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
      const deps = {
        createClient: sinon.stub().returns({}),
        getClaims: sinon.stub(),
        getClaim: sinon.stub(),
        linkEvidenceToLineItem: sinon.stub(),
        uploadLineItemEvidence: sinon.stub().resolves({ data: {} }),
      };

      const file = {
        originalname: 'evidence.pdf',
        mimetype: 'application/pdf',
        size: 12345,
        buffer: Buffer.from('fake pdf content'),
      } as Express.Multer.File;

      const result = await claimService.uploadLineItemEvidence(
        { axiosInstance: {} } as any,
        1,
        2,
        file,
        deps as any
      );

      expect(result.status).to.equal("success");
      expect(result.body?.file).to.deep.equal({
        filename: 'evidence.pdf',
        originalname: 'evidence.pdf',
      });
      expect(result.body?.success.messageText).to.equal('evidence.pdf uploaded');
      expect(result.body?.success.messageHtml).to.include('evidence.pdf');
      expect(result.body?.success.messageHtml).to.include('12KB');
      expect(result.body?.success.messageHtml).to.include('Uploaded');
    });

    it('escapes file names in the success HTML', async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        getClaims: sinon.stub(),
        getClaim: sinon.stub(),
        linkEvidenceToLineItem: sinon.stub(),
        uploadLineItemEvidence: sinon.stub().resolves({ data: {} }),
      };

      const file = {
        originalname: '<script>.pdf',
        mimetype: 'application/pdf',
        size: 12345,
        buffer: Buffer.from('fake pdf content'),
      } as Express.Multer.File;

      const result = await claimService.uploadLineItemEvidence(
        { axiosInstance: {} } as any,
        1,
        2,
        file,
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

      const result = await claimService.uploadLineItemEvidence(
        { axiosInstance: {} } as any,
        1,
        2,
        file,
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

      const result = await claimService.uploadLineItemEvidence(
        { axiosInstance: {} } as any,
        1,
        2,
        file,
        deps as any
      );

      expect(result.status).to.equal("error");
      expect(result.message).to.be.a("string").and.not.empty;
      expect(result).to.not.have.property("body");
    });
  });
});