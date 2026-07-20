import { expect } from "chai";
import sinon from "sinon";
import { claimService } from "#src/services/claimService.js";
import { ApiError } from "#src/types/api-types.js";
import { UUID, V7Generator } from "uuidv7";
import { Claim, ClaimType } from "#src/types/Claim.js";

describe("Claim Service", () => {
  afterEach(() => {
    sinon.restore();
  });

  const claimId = new V7Generator().generate();

  describe("getClaims", () => {
    it("returns success with paginated claims data", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        getClaims: sinon.stub().resolves({
          data: {
            claims: [
              {
                id: claimId.toString(),
                ufn: "UFN-1",
                providerUserId: "3fa85f64-5717-4567-b3fc-2c963f66afa6",
                client: "Jane Doe",
                category: "Category A",
                concluded: "2026-03-12",
                feeType: "Fixed",
                claimed: 123.45,
              },
            ],
            page: 2,
            limit: 10,
            total: 1,
            totalPages: 1,
          },
        }),
      };

      const result = await claimService.getClaims(
        { axiosInstance: {} } as any,
        2,
        10,
        deps as any,
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
          id: claimId.toString(),
          ufn: "UFN-1",
          providerUserId: "3fa85f64-5717-4567-b3fc-2c963f66afa6",
          client: "Jane Doe",
          category: "Category A",
          concluded: new Date("2026-03-12"),
          feeType: "Fixed",
          claimed: 123.45,
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
      };

      const result = (await claimService.getClaims(
        { axiosInstance: {} } as any,
        2,
        10,
        deps as any,
      )) as ApiError;

      expect(result.status).to.equal("error");
      expect(result.statusCode).to.equal(500);
      expect(result.message).to.equal("An error occurred");
    });

    it("returns error shape when the API call fails", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        getClaims: sinon.stub().rejects(new Error("boom")),
      };

      const result = await claimService.getClaims(
        { axiosInstance: {} } as any,
        1,
        10,
        deps as any,
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
      };

      const result = await claimService.getClaims(
        { axiosInstance: {} } as any,
        1,
        10,
        deps as any,
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
        getClaim: sinon.stub().resolves({
          data: {
            id: claimId.toString(),
            ufn: "UFN-123",
            providerUserId: "3fa85f64-5717-4567-b3fc-2c963f66afa6",
            client: "Jane Doe",
            category: "Something",
            concluded: "2024-01-02T10:00:00Z",
            feeType: "Fixed",
            claimed: 4500,
          },
        }),
      };

      const result = await claimService.getClaim(
        { axiosInstance: {} } as any,
        claimId,
        deps as any,
      );

      expect(result.status).to.equal("success");
      expect(result.body?.value).to.deep.equal({
        id: claimId.toString(),
        ufn: "UFN-123",
        providerUserId: "3fa85f64-5717-4567-b3fc-2c963f66afa6",
        client: "Jane Doe",
        category: "Something",
        concluded: new Date("2024-01-02T10:00:00Z"),
        feeType: "Fixed",
        claimed: 4500,
      });

      sinon.assert.calledWith(
        deps.getClaim,
        sinon.match({
          path: { claimId: claimId.toString() },
          query: { status: "SUBMITTED" },
        }),
      );
    });

    it("returns error for a non-200 response", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
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
      };

      const result = (await claimService.getClaim(
        { axiosInstance: {} } as any,
        claimId,
        deps as any,
      )) as ApiError;

      expect(result.status).to.equal("error");
      expect(result.statusCode).to.equal(404);
      expect(result.message).to.equal("Resource not found");
    });

    it("returns error shape when the API call fails", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        getClaim: sinon.stub().rejects(new Error("boom")),
      };

      const result = await claimService.getClaim(
        { axiosInstance: {} } as any,
        claimId,
        deps as any,
      );

      expect(result.status).to.equal("error");
      expect(result.message).to.be.a("string").and.not.empty;
      expect(result).to.not.have.property("body");
    });

    it("returns error shape when the response shape is invalid", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        getClaim: sinon.stub().resolves({
          data: { invalid: true },
        }),
      };

      const result = await claimService.getClaim(
        { axiosInstance: {} } as any,
        claimId,
        deps as any,
      );

      expect(result.status).to.equal("error");
      expect(result.message).to.be.a("string").and.not.empty;
      expect(result).to.not.have.property("body");
    });
  });

  describe("getDraftClaim", () => {
    it("returns success with a claim", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        getClaim: sinon.stub().resolves({
          data: {
            id: claimId.toString(),
            ufn: "UFN-123",
            providerUserId: "3fa85f64-5717-4567-b3fc-2c963f66afa6",
            client: "Jane Doe",
            category: "Something",
            concluded: "2024-01-02T10:00:00Z",
            feeType: "Fixed",
            claimed: 4500,
          },
        }),
      };

      const result = await claimService.getDraftClaim(
        { axiosInstance: {} } as any,
        claimId,
        deps as any,
      );

      expect(result.status).to.equal("success");
      expect(result.body?.value).to.deep.equal({
        id: claimId.toString(),
        ufn: "UFN-123",
        providerUserId: "3fa85f64-5717-4567-b3fc-2c963f66afa6",
        client: "Jane Doe",
        category: "Something",
        concluded: new Date("2024-01-02T10:00:00Z"),
        feeType: "Fixed",
        claimed: 4500,
      });

      sinon.assert.calledWith(
        deps.getClaim,
        sinon.match({
          path: { claimId: claimId.toString() },
          query: { status: "DRAFT" },
        }),
      );
    });

    it("returns error for a non-200 response", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
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
      };

      const result = (await claimService.getDraftClaim(
        { axiosInstance: {} } as any,
        claimId,
        deps as any,
      )) as ApiError;

      expect(result.status).to.equal("error");
      expect(result.statusCode).to.equal(404);
      expect(result.message).to.equal("Resource not found");
    });

    it("returns error shape when the API call fails", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        getClaim: sinon.stub().rejects(new Error("boom")),
      };

      const result = await claimService.getDraftClaim(
        { axiosInstance: {} } as any,
        claimId,
        deps as any,
      );

      expect(result.status).to.equal("error");
      expect(result.message).to.be.a("string").and.not.empty;
      expect(result).to.not.have.property("body");
    });

    it("returns error shape when the response shape is invalid", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        getClaim: sinon.stub().resolves({
          data: { invalid: true },
        }),
      };

      const result = await claimService.getDraftClaim(
        { axiosInstance: {} } as any,
        claimId,
        deps as any,
      );

      expect(result.status).to.equal("error");
      expect(result.message).to.be.a("string").and.not.empty;
      expect(result).to.not.have.property("body");
    });
  });

  describe("createClaim", () => {
    it("returns success with a location header", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        createClaim: sinon.stub().resolves({
          headers: {
            location:
              "/api/v1/claims/019f7f1a-0bd5-74c4-87b9-2bb69c0f0cd1?status=DRAFT",
          },
        }),
      };

      const result = await claimService.createClaim(
        { axiosInstance: {} } as any,
        deps as any,
      );

      expect(result).to.deep.equal({
        status: "success",
        body: UUID.parse("019f7f1a-0bd5-74c4-87b9-2bb69c0f0cd1"),
      });
    });

    it("returns error for a non-200 response", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        createClaim: sinon.stub().rejects({
          isAxiosError: true,
          response: {
            status: 400,
            data: {
              detail: "Request validation failed.",
              instance: "/api/v1/claims",
              status: 400,
              title: "Invalid request",
              correlationId: "15b62600-b665-4eb2-a6d7-f436fe8a4cf5",
              errorCode: "VALIDATION_FAILED",
              fieldErrors: [
                {
                  field: "client",
                  message: "must not be null",
                },
              ],
            },
          },
        }),
      };

      const result = (await claimService.createClaim(
        { axiosInstance: {} } as any,
        deps as any,
      )) as ApiError;

      expect(result).to.deep.equal({
        status: "error",
        statusCode: 400,
        message: "Request validation failed.",
      });
    });

    it("returns error shape when the API call fails", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        createClaim: sinon.stub().rejects(new Error("boom")),
      };

      const result = await claimService.createClaim(
        { axiosInstance: {} } as any,
        deps as any,
      );

      expect(result).to.deep.equal({
        status: "error",
        statusCode: 500,
        message: "boom",
      });
    });

    it("returns error shape when the location header is unexpected shape", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        createClaim: sinon.stub().resolves({
          headers: {
            location: "foo",
          },
        }),
      };

      const result = await claimService.createClaim(
        { axiosInstance: {} } as any,
        deps as any,
      );

      expect(result).to.deep.equal({
        status: "error",
        statusCode: 500,
        message: "Invalid Location header",
      });
    });

    it("returns error shape when the location header doesn't contain uuid", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        createClaim: sinon.stub().resolves({
          headers: {
            location: "/api/v1/claims/foo?status=DRAFT",
          },
        }),
      };

      const result = await claimService.createClaim(
        { axiosInstance: {} } as any,
        deps as any,
      );

      expect(result).to.deep.equal({
        status: "error",
        statusCode: 500,
        message: "could not parse UUID string",
      });
    });

    it("returns error shape when the location header is missing", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        createClaim: sinon.stub().resolves({
          headers: {},
        }),
      };

      const result = await claimService.createClaim(
        { axiosInstance: {} } as any,
        deps as any,
      );

      expect(result).to.deep.equal({
        status: "error",
        statusCode: 500,
        message: "Missing Location header",
      });
    });

    it("returns error shape when the headers are missing", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        createClaim: sinon.stub().resolves({}),
      };

      const result = await claimService.createClaim(
        { axiosInstance: {} } as any,
        deps as any,
      );

      expect(result).to.deep.equal({
        status: "error",
        statusCode: 500,
        message: "Response did not contain headers",
      });
    });
  });

  describe("updateClaim", () => {
    const claim: Claim = new Claim({
      id: claimId.toString(),
      type: ClaimType.PROFIT_COST,
    });

    it("returns success", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        updateClaim: sinon.stub().resolves(null),
      };

      const result = await claimService.updateClaim(
        { axiosInstance: {} } as any,
        claim,
        deps as any,
      );

      expect(result).to.deep.equal({
        status: "success",
        body: null,
      });

      sinon.assert.calledWith(
        deps.updateClaim,
        sinon.match({
          path: { id: claimId.toString() },
          query: { status: "DRAFT" },
          body: {
            type: "PROFIT_COST",
          },
        }),
      );
    });

    it("returns error for a non-200 response", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        updateClaim: sinon.stub().rejects({
          isAxiosError: true,
          response: {
            status: 400,
            data: {
              detail: "Request validation failed.",
              instance: "/api/v1/claims/019f7fd6-c3d1-7706-b518-6bdd409550c1",
              status: 400,
              title: "Invalid request",
              correlationId: "431063e8-a19a-4991-bc76-78232c54b8e2",
              errorCode: "VALIDATION_FAILED",
              fieldErrors: [
                {
                  field: "client",
                  message: "must not be null",
                },
              ],
            },
          },
        }),
      };

      const result = (await claimService.updateClaim(
        { axiosInstance: {} } as any,
        claim,
        deps as any,
      )) as ApiError;

      expect(result).to.deep.equal({
        status: "error",
        statusCode: 400,
        message: "Request validation failed.",
      });
    });

    it("returns error shape when the API call fails", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        updateClaim: sinon.stub().rejects(new Error("boom")),
      };

      const result = await claimService.updateClaim(
        { axiosInstance: {} } as any,
        claim,
        deps as any,
      );

      expect(result).to.deep.equal({
        status: "error",
        statusCode: 500,
        message: "boom",
      });
    });
  });
});