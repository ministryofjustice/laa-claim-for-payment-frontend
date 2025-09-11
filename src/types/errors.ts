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
