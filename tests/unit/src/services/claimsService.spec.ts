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
      // Reset the stub before each test
      axiosStub = { get: sinon.stub() } as any;
      configureAxiosStub = sinon
        .stub(claimService as any, "configureAxiosInstance")
        .returns(axiosStub);
    });

    afterEach(() => {
      // Restore the stubs after each test
      sinon.restore();
    });

    it("should call axios with the claim endpoint", async () => {
      const mockEmptyData = { data: [] };
      axiosStub.get.resolves(mockEmptyData);

      await claimService.getClaims({} as any);

      sinon.assert.calledWith(axiosStub.get, getClaimsEndpoint);
      sinon.assert.calledWith(configureAxiosStub, {});
    });

    it("returns empty data if the response is not an array", async () => {
      const mockData = { data: "just a string" };
      axiosStub.get.resolves(mockData);

      const result = await claimService.getClaims({} as any);

      sinon.assert.calledWith(axiosStub.get, getClaimsEndpoint);
      sinon.assert.calledWith(configureAxiosStub, {});
      expect(result.data).to.be.an("array").that.is.empty;
    });

    it("should return empty data and an error when axios fails", async () => {
      const error = new Error("Network error");
      axiosStub.get.rejects(error);
      const errorMessage = "An unexpected error occurred. Please try again.";

      const result = await claimService.getClaims({} as any);

      expect(result).to.include({
        message: errorMessage,
      });
      expect(result.data).to.be.an("array").that.is.empty;
    });
  });
});
