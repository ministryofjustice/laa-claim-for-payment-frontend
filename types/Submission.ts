import type { Claim } from "./Claim.js";

// Submission Interface

export interface Submission {
	id?: string;// UUID - TS handles UUID as a string -> using crypto node library breaks code (ES module)
	friendlyId?: string,
    providerUserId?: string; // UUID - TS handles UUID as a string -> using crypto node library breaks code (ES module)
    providerOfficeId? : string; // UUID - TS handles UUID as a string -> using crypto node library breaks code (ES module)
    submissionTypeCode?: string;
    submissionDate?: string; 
    submissionPeriodStartDate?: string;
    submissionPeriodEndDate?: string;
    scheduleId?: string;
    claims?: Claim[];
}