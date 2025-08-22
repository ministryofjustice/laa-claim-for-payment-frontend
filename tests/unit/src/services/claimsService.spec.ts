import sinon from "sinon";
import { expect } from "chai";
import { claimService, transformClaim } from "#src/services/claimService.js";
import { isClaim } from "#src/helpers/typeChecks.js";
import { AxiosInstance } from "#node_modules/axios/index.js";
import { getClaimsEndpoint } from "#src/api/apiEndpointConstants.js";

describe("Claim Service:", () => {
  describe("data transformer", () => {
    it("should transform a valid object into a submission type", () => {
      const mockDataInput = {
        id: "validId",
        client: "validClient",
        category: "validCategory",
        concluded: "validConcluded",
        claimed: "validClaimed",
        submissionId: "validSubmissionId",
      };

      const result = transformClaim(mockDataInput);

      // Check the data structures

      // type guarding
      expect(isClaim(result)).to.be.true;

      // checks this is a valid object (Claim is interface - doesn't exist at runtime)
      expect(result).to.be.an("object");

      // checks the data conforms to the right structure
      expect(result).to.have.property("id", "validId");
      expect(result).to.have.property("client", "validClient");
      expect(result).to.have.property("category", "validCategory");
      expect(result).to.have.property("concluded", "validConcluded");
      expect(result).to.have.property("claimed", "validClaimed");
      expect(result).to.have.property("submissionId", "validSubmissionId");
    });

    it("should throw an error when the transformer is used on null", () => {
      const mockDataInput = null;

      expect(() => transformClaim(mockDataInput)).to.throw("Invalid claim item: expected object");
    });
  });

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
