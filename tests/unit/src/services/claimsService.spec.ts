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
});