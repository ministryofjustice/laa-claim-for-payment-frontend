import type { PaginationItem } from "./paginationItem.js";
import type { PaginationLink } from "./paginationLink.js";
import { PaginationResults } from "./paginationResults.js";

export class Pagination {
  items: PaginationItem[];
  results: PaginationResults;
  previous?: PaginationLink;
  next?: PaginationLink;

  /**
   * Creates a pagination model
   * @param {number} totalNumberOfResults The total number of results (unpaginated)
   * @param {number} numberOfResultsPerPage The number of results to show per page
   * @param {number} currentPage The current page
   * @param {string} href The path of the page resource
   */
  constructor(
    totalNumberOfResults: number,
    numberOfResultsPerPage: number,
    currentPage: number,
    href: string
  ) {
    const totalNumberOfPages = Math.ceil(totalNumberOfResults / numberOfResultsPerPage);

    if (totalNumberOfPages <= 1) {
      this.items = [];
    } else {
      const paginationItems = [];
      let page = 1;
      let isLastItemEllipsis = false;
      while (page <= totalNumberOfPages) {
        if (page === 1 || Math.abs(page - currentPage) <= 1 || page === totalNumberOfPages) {
          const paginationItem: PaginationItem = {
            text: page.toString(),
            href: `${href}?page=${page}`,
            selected: page === currentPage,
            type: undefined,
          };
          paginationItems.push(paginationItem);
          isLastItemEllipsis = false;
        } else if (!isLastItemEllipsis) {
          const paginationItem: PaginationItem = {
            type: "dots",
          };
          paginationItems.push(paginationItem);
          isLastItemEllipsis = true;
        }
        page++;
      }

      this.items = paginationItems;
    }

    this.results = new PaginationResults(
      totalNumberOfResults,
      numberOfResultsPerPage,
      currentPage,
      totalNumberOfPages
    );

    if (currentPage > 1) {
      this.previous = {
        text: "Previous",
        href: `${href}?page=${currentPage - 1}`,
      };
    }

    if (currentPage < totalNumberOfPages) {
      this.next = {
        text: "Next",
        href: `${href}?page=${currentPage + 1}`,
      };
    }
  }
}
