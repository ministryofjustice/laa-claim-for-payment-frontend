import sinon from "sinon";
import { expect } from "chai";
import { claimService } from "#src/services/claimService.js";
import { AxiosInstance } from "#node_modules/axios/index.js";
import { getClaimsEndpoint } from "#src/api/apiEndpointConstants.js";

describe("Claim Service:", () => {
  describe("getClaims", () => {
    let axiosStub: sinon.SinonStubbedInstance<AxiosInstance>;
    let configureAxiosStub: sinon.SinonStub;

    beforeEach(() => {
      axiosStub = { get: sinon.stub() } as any;
      configureAxiosStub = sinon
        .stub(claimService as any, "configureAxiosInstance")
        .returns(axiosStub);
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should call axios with the claim endpoint", async () => {
      const mockEmptyData = { data: [] };
      axiosStub.get.resolves(mockEmptyData);

      await claimService.getClaims({} as any, {} as any);

      sinon.assert.calledWith(axiosStub.get, getClaimsEndpoint);
      sinon.assert.calledWith(configureAxiosStub, {});
    });

    it("returns empty data if the response is not an array", async () => {
      const mockData = { data: "just a string" };
      axiosStub.get.resolves(mockData);

      const result = await claimService.getClaims({} as any, {} as any);

      sinon.assert.calledWith(axiosStub.get, getClaimsEndpoint);
      sinon.assert.calledWith(configureAxiosStub, {});

      expect(result.status).to.equal("error");
      expect(result).to.have.property("message").that.is.a("string").and.is.not.empty;
      expect(result).to.not.have.property("body")
    });

    it("should return empty data and an error when axios fails", async () => {
      const error = new Error("Network error");
      axiosStub.get.rejects(error);
      const errorMessage = "An unexpected error occurred. Please try again.";

      const result = await claimService.getClaims({} as any, {} as any);

      expect(result.status).to.equal("error");
      expect(result).to.include({
        message: errorMessage,
      });
      expect(result).to.not.have.property("body")
    });
  });

  describe("getClaim", () => {
    let axiosStub: sinon.SinonStubbedInstance<AxiosInstance>;
    let configureAxiosStub: sinon.SinonStub;

    beforeEach(() => {
      axiosStub = { get: sinon.stub() } as any;
      configureAxiosStub = sinon
        .stub(claimService as any, "configureAxiosInstance")
        .returns(axiosStub);
    });

    afterEach(() => {
      sinon.restore();
    });

    it("calls axios with the claim endpoint incl. id", async () => {
      const claimId = 123;
      axiosStub.get.resolves({ status: 200, data: { id: claimId } });

      await (claimService as any).getClaim({} as any, claimId);

      const expectedUrl = `/api/v1/claims/${encodeURIComponent(String(claimId))}`;
      sinon.assert.calledWith(axiosStub.get, expectedUrl);
      sinon.assert.calledWith(configureAxiosStub, {});
    });

    it("returns success with the claim body", async () => {
      const claimId = 456;
      const claim = {
        id: claimId,
        client: "Jane Doe",
        category: "Something",
        concluded: new Date("2024-01-02T10:00:00Z"),
        feeType: "Fixed",
        claimed: 4500,
        submissionId: "sub-1",
      };
      axiosStub.get.resolves({ status: 200, data: claim });

      const result = await (claimService as any).getClaim({} as any, claimId);

      expect(result.status).to.equal("success");
      expect(result).to.have.property("body");
      expect(result.body).to.deep.equal(claim);
    });

    it("returns error when axios fails", async () => {
      const claimId = 999;
      axiosStub.get.rejects(new Error("Network error"));

      const result = await (claimService as any).getClaim({} as any, claimId);

      expect(result.status).to.equal("error");
      expect(result).to.have.property("message").that.is.a("string").and.is.not.empty;
      expect(result).to.not.have.property("body");
    });
  });
});
