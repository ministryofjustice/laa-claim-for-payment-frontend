// Claim Interface
export interface Claim {
  id?: string; // Long in BE
  ufn?: string;
  providerUserId?: string;
  client?: string;
  category?: string;
  concluded?: string; // TODO: BE is a LocalDate ?
  feeType?: string;
  claimed?: string; // Double in BE
  submissionId?: string; // UUID - TS handles UUID as a string -> using crypto node library breaks code (ES module)
}
