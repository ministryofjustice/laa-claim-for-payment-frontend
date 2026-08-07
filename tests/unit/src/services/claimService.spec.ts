import { expect } from "chai";
import sinon from "sinon";
import { claimService } from "#src/services/claimService.js";
import { ApiError } from "#src/types/api-types.js";
import { UUID, V7Generator } from "uuidv7";
import {
  Category,
  Claim,
  CostType,
  ExpertCostLineItemSchema,
  ProfitCostBillLineItemSchema,
} from "#src/types/Claim.js";
import { ExpertCostDetails, LineItemForm } from "#src/types/poa.js";

describe("Claim Service", () => {
  afterEach(() => {
    sinon.restore();
  });

  const claimId = new V7Generator().generate();
  const lineItemId = new V7Generator().generate();

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

      sinon.assert.calledWith(
        deps.getClaims,
        sinon.match({
          query: {
            limit: 10,
            page: 2,
            status: "SUBMITTED",
          },
        }),
      );
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
      costType: CostType.PROFIT_COST,
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
            costType: "PROFIT_COST",
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

  describe("addLineItemToClaim", () => {
    it("returns success with a location header when empty line item", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        addLineItemToClaim: sinon.stub().resolves({
          headers: {
            location: `/api/v1/claims/${claimId.toString()}/line-items/${lineItemId.toString()}`,
          },
        }),
      };

      const result = await claimService.addLineItemToClaim(
        { axiosInstance: {} } as any,
        claimId,
        undefined,
        deps as any,
      );

      expect(result).to.deep.equal({
        status: "success",
        body: lineItemId,
      });
    });

    it("returns success with a location header when defined line item", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        addLineItemToClaim: sinon.stub().resolves({
          headers: {
            location: `/api/v1/claims/${claimId.toString()}/line-items/${lineItemId.toString()}`,
          },
        }),
      };

      const result = await claimService.addLineItemToClaim(
        { axiosInstance: {} } as any,
        claimId,
        {
          type: CostType.EXPERT_COST,
          value: {
            activityDate: new Date(),
            actualNetValue: 123,
            vatApplies: true,
            feeEarnerName: "Joe Bloggs",
            description: "Lorem ipsum",
          },
        },
        deps as any,
      );

      expect(result).to.deep.equal({
        status: "success",
        body: lineItemId,
      });
    });

    it("returns error for a non-200 response", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        addLineItemToClaim: sinon.stub().rejects({
          isAxiosError: true,
          response: {
            status: 400,
            data: {
              detail: "Request validation failed.",
              instance:
                "/api/v1/claims/019fa7eb-e836-74e8-9eb5-01fa32302a9d/line-items",
              status: 400,
              title: "Invalid request",
              correlationId: "1eef7e2a-fdb9-4b17-8e54-cb32e9fd1eeb",
              errorCode: "VALIDATION_FAILED",
            },
          },
        }),
      };

      const result = (await claimService.addLineItemToClaim(
        { axiosInstance: {} } as any,
        claimId,
        undefined,
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
        addLineItemToClaim: sinon.stub().rejects(new Error("boom")),
      };

      const result = await claimService.addLineItemToClaim(
        { axiosInstance: {} } as any,
        claimId,
        undefined,
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
        addLineItemToClaim: sinon.stub().resolves({
          headers: {
            location: "foo",
          },
        }),
      };

      const result = await claimService.addLineItemToClaim(
        { axiosInstance: {} } as any,
        claimId,
        undefined,
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
        addLineItemToClaim: sinon.stub().resolves({
          headers: {
            location: `/api/v1/claims/${claimId}/line-items/foo`,
          },
        }),
      };

      const result = await claimService.addLineItemToClaim(
        { axiosInstance: {} } as any,
        claimId,
        undefined,
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
        addLineItemToClaim: sinon.stub().resolves({
          headers: {},
        }),
      };

      const result = await claimService.addLineItemToClaim(
        { axiosInstance: {} } as any,
        claimId,
        undefined,
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
        addLineItemToClaim: sinon.stub().resolves({}),
      };

      const result = await claimService.addLineItemToClaim(
        { axiosInstance: {} } as any,
        claimId,
        undefined,
        deps as any,
      );

      expect(result).to.deep.equal({
        status: "error",
        statusCode: 500,
        message: "Response did not contain headers",
      });
    });
  });

  describe("getLineItem", () => {
    it("returns success with an expert cost line item", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        getLineItem: sinon.stub().resolves({
          data: {
            id: lineItemId.toString(),
            title: "Some line item",
            category: "Disbursement",
            date: "2024-01-02T10:00:00Z",
            evidenceItems: [],
            actualNetValue: 123,
            netProfitCostAmount: null,
            netAdvocacyCostAmount: null,
            feeEarnerName: "Joe Bloggs",
            vatApplicable: true,
          },
        }),
      };

      const result = await claimService.getLineItem(
        { axiosInstance: {} } as any,
        claimId,
        lineItemId,
        ExpertCostLineItemSchema,
        deps as any,
      );

      expect(result.status).to.equal("success");
      expect(result.body).to.deep.equal({
        id: lineItemId.toString(),
        title: "Some line item",
        category: Category.DISBURSEMENT,
        date: new Date("2024-01-02T10:00:00Z"),
        evidenceItems: [],
        actualNetValue: 123,
        netProfitCostAmount: null,
        netAdvocacyCostAmount: null,
        feeEarnerName: "Joe Bloggs",
        vatApplicable: true,
      });

      sinon.assert.calledWith(
        deps.getLineItem,
        sinon.match({
          path: {
            claimId: claimId.toString(),
            lineItemId: lineItemId.toString(),
          },
          query: { status: "DRAFT" },
        }),
      );
    });

    it("returns success with a profit cost bill line item", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        getLineItem: sinon.stub().resolves({
          data: {
            id: lineItemId.toString(),
            title: "Some line item",
            category: "Disbursement",
            date: "2024-01-02T10:00:00Z",
            evidenceItems: [],
            actualNetValue: null,
            netProfitCostAmount: 123,
            netAdvocacyCostAmount: 456,
            feeEarnerName: "Joe Bloggs",
            vatApplicable: true,
          },
        }),
      };

      const result = await claimService.getLineItem(
        { axiosInstance: {} } as any,
        claimId,
        lineItemId,
        ProfitCostBillLineItemSchema,
        deps as any,
      );

      expect(result.status).to.equal("success");
      expect(result.body).to.deep.equal({
        id: lineItemId.toString(),
        title: "Some line item",
        category: Category.DISBURSEMENT,
        date: new Date("2024-01-02T10:00:00Z"),
        evidenceItems: [],
        actualNetValue: null,
        netProfitCostAmount: 123,
        netAdvocacyCostAmount: 456,
        feeEarnerName: "Joe Bloggs",
        vatApplicable: true,
      });

      sinon.assert.calledWith(
        deps.getLineItem,
        sinon.match({
          path: {
            claimId: claimId.toString(),
            lineItemId: lineItemId.toString(),
          },
          query: { status: "DRAFT" },
        }),
      );
    });

    it("returns zod error when fetching expert cost line item and body is profit cost bill line item", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        getLineItem: sinon.stub().resolves({
          data: {
            id: lineItemId.toString(),
            title: "Some line item",
            category: "Disbursement",
            date: "2024-01-02T10:00:00Z",
            evidenceItems: [],
            netProfitCostAmount: 123,
            netAdvocacyCostAmount: 456,
          },
        }),
      };

      const result = (await claimService.getLineItem(
        { axiosInstance: {} } as any,
        claimId,
        lineItemId,
        ExpertCostLineItemSchema,
        deps as any,
      )) as ApiError;

      expect(result.status).to.equal("error");
      expect(result.statusCode).to.equal(500);
    });

    it("returns zod error when fetching profit cost bill line item and body is expert cost line item", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        getLineItem: sinon.stub().resolves({
          data: {
            id: lineItemId.toString(),
            title: "Some line item",
            category: "Disbursement",
            date: "2024-01-02T10:00:00Z",
            evidenceItems: [],
            actualNetValue: 123,
          },
        }),
      };

      const result = (await claimService.getLineItem(
        { axiosInstance: {} } as any,
        claimId,
        lineItemId,
        ProfitCostBillLineItemSchema,
        deps as any,
      )) as ApiError;

      expect(result.status).to.equal("error");
      expect(result.statusCode).to.equal(500);
    });

    it("returns error for a non-200 response", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        getLineItem: sinon.stub().rejects({
          isAxiosError: true,
          response: {
            status: 404,
            data: {
              detail: "Resource not found",
              instance: "/api/v1/claims/123/line-items/456",
              status: 404,
              title: "Not found",
              correlationId: "b7d7c91f-950a-43f6-a8de-ffb37f1001c1",
              errorCode: "NOT_FOUND",
            },
          },
        }),
      };

      const result = (await claimService.getLineItem(
        { axiosInstance: {} } as any,
        claimId,
        lineItemId,
        ExpertCostLineItemSchema,
        deps as any,
      )) as ApiError;

      expect(result.status).to.equal("error");
      expect(result.statusCode).to.equal(404);
      expect(result.message).to.equal("Resource not found");
    });

    it("returns error shape when the API call fails", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        getLineItem: sinon.stub().rejects(new Error("boom")),
      };

      const result = await claimService.getLineItem(
        { axiosInstance: {} } as any,
        claimId,
        lineItemId,
        ExpertCostLineItemSchema,
        deps as any,
      );

      expect(result.status).to.equal("error");
      expect(result.message).to.be.a("string").and.not.empty;
      expect(result).to.not.have.property("body");
    });

    it("returns error shape when the response shape is invalid", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        getLineItem: sinon.stub().resolves({
          data: { invalid: true },
        }),
      };

      const result = await claimService.getLineItem(
        { axiosInstance: {} } as any,
        claimId,
        lineItemId,
        ExpertCostLineItemSchema,
        deps as any,
      );

      expect(result.status).to.equal("error");
      expect(result.message).to.be.a("string").and.not.empty;
      expect(result).to.not.have.property("body");
    });
  });

  describe("updateLineItem", () => {
    const lineItem: ExpertCostDetails = {
      activityDate: new Date(Date.UTC(2026, 6, 28)),
      actualNetValue: 123.45,
      vatApplies: true,
      feeEarnerName: "Joe Bloggs",
      description: "Lorem ipsum",
    };

    const lineItemForm: LineItemForm = {
      type: CostType.EXPERT_COST,
      value: lineItem,
    };

    it("returns success", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        updateLineItem: sinon.stub().resolves(null),
      };

      const result = await claimService.updateLineItem(
        { axiosInstance: {} } as any,
        claimId,
        lineItemId,
        lineItemForm,
        deps as any,
      );

      expect(result).to.deep.equal({
        status: "success",
        body: null,
      });

      expect(deps.updateLineItem.firstCall.args[0]).to.deep.equal({
        path: {
          claimId: claimId.toString(),
          lineItemId: lineItemId.toString(),
        },
        query: {
          status: "DRAFT",
        },
        body: {
          title: "Lorem ipsum",
          category: "Disbursement",
          date: "2026-07-28T00:00:00.000Z",
          actualNetValue: 123.45,
          vatApplicable: true,
          feeEarnerName: "Joe Bloggs",
        },
        client: {},
      });
    });

    it("returns error for a non-200 response", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        updateLineItem: sinon.stub().rejects({
          isAxiosError: true,
          response: {
            status: 400,
            data: {
              detail: "Request validation failed.",
              instance:
                "/api/v1/claims/019f7fd6-c3d1-7706-b518-6bdd409550c1/line-items/019fa90f-346f-7051-9e40-1bf1c2b53217",
              status: 400,
              title: "Invalid request",
              correlationId: "431063e8-a19a-4991-bc76-78232c54b8e2",
              errorCode: "VALIDATION_FAILED",
            },
          },
        }),
      };

      const result = (await claimService.updateLineItem(
        { axiosInstance: {} } as any,
        claimId,
        lineItemId,
        lineItemForm,
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
        updateLineItem: sinon.stub().rejects(new Error("boom")),
      };

      const result = await claimService.updateLineItem(
        { axiosInstance: {} } as any,
        claimId,
        lineItemId,
        lineItemForm,
        deps as any,
      );

      expect(result).to.deep.equal({
        status: "error",
        statusCode: 500,
        message: "boom",
      });
    });
  });

  describe("deleteLineItem", () => {
    it("returns success", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        deleteLineItem: sinon.stub().resolves(null),
      };

      const result = await claimService.deleteLineItem(
        { axiosInstance: {} } as any,
        claimId,
        lineItemId,
        deps as any,
      );

      expect(result).to.deep.equal({
        status: "success",
        body: null,
      });

      expect(deps.deleteLineItem.firstCall.args[0]).to.deep.equal({
        path: {
          claimId: claimId.toString(),
          lineItemId: lineItemId.toString(),
        },
        query: {
          status: "DRAFT",
        },
        client: {},
      });
    });

    it("returns success for a 404 response", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        deleteLineItem: sinon.stub().rejects({
          isAxiosError: true,
          response: {
            status: 404,
            data: {
              detail: "Request validation failed.",
              instance:
                "/api/v1/claims/019f7fd6-c3d1-7706-b518-6bdd409550c1/line-items/019fa90f-346f-7051-9e40-1bf1c2b53217",
              status: 404,
              title: "Not found",
              correlationId: "431063e8-a19a-4991-bc76-78232c54b8e2",
              errorCode: "NOT_FOUND",
            },
          },
        }),
      };

      const result = (await claimService.deleteLineItem(
        { axiosInstance: {} } as any,
        claimId,
        lineItemId,
        deps as any,
      )) as ApiError;

      expect(result).to.deep.equal({
        status: "success",
        body: null,
      });
    });

    it("returns error for a non-200 response", async () => {
      const deps = {
        createClient: sinon.stub().returns({}),
        deleteLineItem: sinon.stub().rejects({
          isAxiosError: true,
          response: {
            status: 400,
            data: {
              detail: "Request validation failed.",
              instance:
                "/api/v1/claims/019f7fd6-c3d1-7706-b518-6bdd409550c1/line-items/019fa90f-346f-7051-9e40-1bf1c2b53217",
              status: 400,
              title: "Invalid request",
              correlationId: "431063e8-a19a-4991-bc76-78232c54b8e2",
              errorCode: "VALIDATION_FAILED",
            },
          },
        }),
      };

      const result = (await claimService.deleteLineItem(
        { axiosInstance: {} } as any,
        claimId,
        lineItemId,
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
        deleteLineItem: sinon.stub().rejects(new Error("boom")),
      };

      const result = await claimService.deleteLineItem(
        { axiosInstance: {} } as any,
        claimId,
        lineItemId,
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