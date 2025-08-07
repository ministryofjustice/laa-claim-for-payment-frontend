import sinon from 'sinon';
import { expect } from 'chai';
import getSubmissionTestData from '../testAssets/submissionTestData.js';
import { submissionsService, transformSubmission } from '#src/services/submissionsService.js';
import { isSubmission } from '#src/helpers/typeChecks.js';
import { AxiosInstanceWrapper } from "#types/axios-instance-wrapper.js";

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
    }

    // Act - call transformer with the mock data
    const result = transformSubmission(mockDataInput);


    // Assert - check the data 

      // type guarding - defensive coding
    expect(isSubmission(result)).to.be.true;

      // checks this is a valid object (Submission is interface - doesn't exist at runtime)
    expect(result).to.be.an('object'); 

      // checks the data conforms to the right structure
    expect(result).to.have.property('id', 'validId'); 
    expect(result).to.have.property('friendlyId', 'validFriendlyId'); 
    expect(result).to.have.property('providerUserId', 'validProviderUserId'); 
    expect(result).to.have.property('providerOfficeId', 'validProviderOfficeId'); 
    expect(result).to.have.property('submissionTypeCode', 'validSubmissionTypeCode'); 
    expect(result).to.have.property('submissionDate', 'validSubmissionDate'); 
    expect(result).to.have.property('submissionPeriodStartDate', 'validPeriodStart'); 
    expect(result).to.have.property('submissionPeriodEndDate', 'validPeriodEnd'); 
    expect(result).to.have.property('scheduleId', 'validScheduleId'); 

    expect(result.claims).to.be.an('array');
    })

    it("should throw an error when the transformer is used on null", () => {
    
    // Arrange - set up the mock data
    const mockDataInput = null;

    // Act - call transformer with the mock data
    // Assert - check it is thrown

    expect(() => transformSubmission(mockDataInput)).to.throw('Invalid submissions item: expected object'); 
    })
  })

  describe("getSubmissions", () => {
    let submissionsServiceStub: sinon.SinonStub;
    let logSpy: sinon.SinonSpy;
    let errorSpy: sinon.SinonSpy;

    let middleware: AxiosInstanceWrapper;

    let req: Partial<Request>;

    beforeEach(() => {
    // Reset the stub before each test

    submissionsServiceStub = sinon.stub(submissionsService, "getSubmissions");
    logSpy = sinon.spy(console, 'log')
    errorSpy = sinon.spy(console, 'error')

    // Assign a mock or dummy value to middleware
    middleware = {} as AxiosInstanceWrapper;
    });

    afterEach(() => { 
    // Restore the stubs after each test
    submissionsServiceStub.restore();
    logSpy.restore();
    errorSpy.restore();
    });

    it("should make a GET request correctly", async () => {
    // Mocking resolved value of the API call
    submissionsServiceStub.resolves(getSubmissionTestData)
    
    // faked API call
    const response = await submissionsService.getSubmissions(middleware);

    // manually call the transform method
    const responseTyped = transformSubmission(response);

    // Assertions
    expect(response).to.deep.equal(getSubmissionTestData);
    expect(isSubmission(responseTyped)).to.be.true;
    expect(isSubmission(response)).to.be.false;
    })

    it("should throw an error when the API call fails", async () => {
    submissionsServiceStub.rejects(new Error("API error"));

    try {
        await submissionsService.getSubmissions(middleware);
        throw new Error("should throw")
    } catch (err ) {
        if (err instanceof Error) {
            expect(err.message).to.equal('API error');
        } else {
            throw err;
        }
    }
    })
  })

})



