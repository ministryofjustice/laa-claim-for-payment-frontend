/**
 *
 */
export class InvalidPageError extends Error {
  invalidPage: number;
  pageToRedirectTo: number;

  /**
   * Creates an InvalidPageError error
   * @param {number} invalidPage The invalid page
   * @param {number} pageToRedirectTo The page to redirect to
   */
  constructor(invalidPage: number, pageToRedirectTo: number) {
    super(`Invalid page number: ${invalidPage}`);
    this.name = "InvalidPageError";
    this.invalidPage = invalidPage;
    this.pageToRedirectTo = pageToRedirectTo;
  }
}

/**
 *
 */
export class AnswerMissingError extends Error {
  urlToRedirectTo: string;

  /**
   * Creates an AnswerMissingError error
   * @param {string} urlToRedirectTo The URL to redirect to
   */
  constructor(urlToRedirectTo: string) {
    super(`Answer missing from: ${urlToRedirectTo}`);
    this.name = "AnswerMissingError";
    this.urlToRedirectTo = urlToRedirectTo;
  }
}
