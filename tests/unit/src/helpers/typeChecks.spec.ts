import sinon from 'sinon';
import { expect } from 'chai';
import { getSubmissionsEndpoint } from '#src/api/apiEndpointConstants.js';
import getSubmissionTestData from '../testAssets/submissionTestData.js';
import { transformSubmission } from '#src/services/submissionsService.js';
import { isSubmission } from '#src/helpers/typeChecks.js';

describe("isSubmission", () => {
  it("should return true for a valid Submission object", () => {
    
    // Arrange - set up the mock data
    const mockValidSubmission = {
      id: "validId",
      providerUserId: "validProviderUserId",
      friendlyId: "validFriendlyId",
      providerOfficeId: "validProviderOfficeId",
      submissionTypeCode: "validSubmissionTypeCode",
      submissionDate: "validSubmissionDate",
      submissionPeriodStartDate: "validPeriodStart",
      submissionPeriodEndDate: "validPeriodEnd",
      scheduleId: "validScheduleId",
      claims: [],
    }

    // Assert & Act - check the data 
    expect(isSubmission(mockValidSubmission)).to.be.true;
  })

  it("should return false for null", () => {
    expect(isSubmission(null)).to.be.false;
  })

  it("should return false for non-objects", () => {
    expect(isSubmission('just a string')).to.be.false;
    expect(isSubmission(1998)).to.be.false;
    expect(isSubmission(false)).to.be.false;
  })

  it("should return false when claims is NOT an array", () => {
    // Arrange - set up the mock data
    const notASubmission = {
     id: "validId",
      providerUserId: "validProviderUserId",
      friendlyId: "validFriendlyId",
      providerOfficeId: "validProviderOfficeId",
      submissionTypeCode: "validSubmissionTypeCode",
      submissionDate: "validSubmissionDate",
      submissionPeriodStartDate: "validPeriodStart",
      submissionPeriodEndDate: "validPeriodEnd",
      scheduleId: "validScheduleId",
      claims: "just a string"
    }

    // Assert & Act - check the data 
    expect(isSubmission(notASubmission)).to.be.false;
  })
  
   it("should return false when values are missing", () => {
    // Arrange - set up the mock data
    const notASubmission = {
     id: "validId",
      providerUserId: "validProviderUserId",
      providerOfficeId: "validProviderOfficeId",
      submissionTypeCode: "validSubmissionTypeCode",
      submissionDate: "validSubmissionDate",
      submissionPeriodStartDate: "validPeriodStart",
      submissionPeriodEndDate: "validPeriodEnd",
      scheduleId: "validScheduleId",
    }

    // Assert & Act - check the data 
    expect(isSubmission(notASubmission)).to.be.false;
  })




})