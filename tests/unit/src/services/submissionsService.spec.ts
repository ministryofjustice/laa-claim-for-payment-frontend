import sinon from "sinon";
import { expect } from "chai";
import { submissionsService, transformSubmission } from "#src/services/submissionsService.js";
import { isSubmission } from "#src/helpers/typeChecks.js";
import { AxiosInstance } from "#node_modules/axios/index.js";
import { getSubmissionsEndpoint } from "#src/api/apiEndpointConstants.js";

describe("submissionsService:", () => {
  describe("data transformer", () => {
    it("should transform a valid object into a submission type", () => {
      // Arrange - set up the mock data
      const mockDataInput = {
        id: "validId",
        providerUserId: "validProviderUserId",
        friendlyId: "validFriendlyId",
        providerOfficeId: "validProviderOfficeId",
        submissionTypeCode: "validSubmissionTypeCode",
        submissionDate: "validSubmissionDate",
        submissionPeriodStartDate: "validPeriodStart",
        submissionPeriodEndDate: "validPeriodEnd",
        scheduleId: "validScheduleId",
        claims: undefined, // sitting as undefined -- not implemented yet
      };

      // Act - call transformer with the mock data
      const result = transformSubmission(mockDataInput);

      // Assert - check the data

      // type guarding - defensive coding
      expect(isSubmission(result)).to.be.true;

      // checks this is a valid object (Submission is interface - doesn't exist at runtime)
      expect(result).to.be.an("object");

      // checks the data conforms to the right structure
      expect(result).to.have.property("id", "validId");
      expect(result).to.have.property("friendlyId", "validFriendlyId");
      expect(result).to.have.property("providerUserId", "validProviderUserId");
      expect(result).to.have.property("providerOfficeId", "validProviderOfficeId");
      expect(result).to.have.property("submissionTypeCode", "validSubmissionTypeCode");
      expect(result).to.have.property("submissionDate", "validSubmissionDate");
      expect(result).to.have.property("submissionPeriodStartDate", "validPeriodStart");
      expect(result).to.have.property("submissionPeriodEndDate", "validPeriodEnd");
      expect(result).to.have.property("scheduleId", "validScheduleId");

      expect(result.claims).to.be.an("array");
    });

    it("should throw an error when the transformer is used on null", () => {
      // Arrange - set up the mock data
      const mockDataInput = null;

      // Act - call transformer with the mock data
      // Assert - check it is thrown
      expect(() => transformSubmission(mockDataInput)).to.throw(
        "Invalid submissions item: expected object"
      );
    });
  });

  describe("getSubmissions", () => {
    let axiosStub: sinon.SinonStubbedInstance<AxiosInstance>;
    let configureAxiosStub: sinon.SinonStub;

    beforeEach(() => {
      // Reset the stub before each test

      axiosStub = { get: sinon.stub() } as any;
      configureAxiosStub = sinon
        .stub(submissionsService as any, "configureAxiosInstance")
        .returns(axiosStub);
    });

    afterEach(() => {
      // Restore the stubs after each test
      sinon.restore();
    });

    it("should call axios with the submissions endpoint", async () => {
      // Arrange - Mocking resolved value of the API call
      axiosStub.get.resolves({ data: [] });

      // Act - faked API call
      await submissionsService.getSubmissions({} as any);

      // Assertions
      sinon.assert.calledWith(axiosStub.get, getSubmissionsEndpoint);
      sinon.assert.calledWith(configureAxiosStub, {});
    });

    it("should return empty data and an error when axios fails", async () => {
      const error = new Error("Network error");

      // Arrange - reject the promise with an error, stub error method
      axiosStub.get.rejects(error);
      const errorMessage = "An unexpected error occurred. Please try again.";

      // Act - call the method.
      const result = await submissionsService.getSubmissions({} as any);

      // Assert - error and data is as expected.
      expect(result).to.include({
        message: errorMessage,
      });

      expect(result.data).to.be.an("array").that.is.empty;
    });
  });
});
