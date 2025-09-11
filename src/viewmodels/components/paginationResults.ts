export class PaginationResults {
  count: number;
  from: number;
  to: number;
  text: string;

  /**
   * Creates a pagination results model
   * @param {number} totalNumberOfResults The total number of results (unpaginated)
   * @param {number} numberOfResultsPerPage The number of results to show per page
   * @param {number} currentPage The current page
   * @param {number} totalNumberOfPages The total number of pages
   */
  constructor(
    totalNumberOfResults: number,
    numberOfResultsPerPage: number,
    currentPage: number,
    totalNumberOfPages: number
  ) {
    if (totalNumberOfResults === 0) {
      this.from = 0;
      this.to = 0;
    } else {
      const from: number = (currentPage - 1) * numberOfResultsPerPage + 1;

      const numberOfResultsOnThisPage: number = (() => {
        if (currentPage < totalNumberOfPages) {
          return numberOfResultsPerPage;
        } else {
          const remainder = totalNumberOfResults % numberOfResultsPerPage;
          return remainder === 0 ? numberOfResultsPerPage : remainder;
        }
      })();

      this.from = from;
      this.to = from + numberOfResultsOnThisPage - 1;
    }

    this.count = totalNumberOfResults;
    this.text = totalNumberOfResults === 1 ? "result" : "results";
  }
}
