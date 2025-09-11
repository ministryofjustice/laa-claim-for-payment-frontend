import { InvalidPageError } from "#src/types/api-types.js";
import { PaginationResults, type PaginationItem, type PaginationLink } from "./index.js";

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

    if (totalNumberOfResults === 0 && currentPage === 1) {
      this.items = [];
    } else {
      if (currentPage > totalNumberOfPages) {
        throw new InvalidPageError(currentPage, totalNumberOfPages === 0 ? 1 : totalNumberOfPages);
      }

      if (currentPage < 1) {
        throw new InvalidPageError(currentPage, 1);
      }

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

      this.items = Pagination.buildPaginationItems(currentPage, totalNumberOfPages, href);
    }

    this.results = new PaginationResults(
      totalNumberOfResults,
      numberOfResultsPerPage,
      currentPage,
      totalNumberOfPages
    );
  }

  private static buildPaginationItems(
    currentPage: number,
    totalNumberOfPages: number,
    href: string
  ): PaginationItem[] {
    if (totalNumberOfPages === 1) {
      return [];
    } else {
      const paginationItems: PaginationItem[] = [];
      let isLastItemEllipsis = false;
      for (let page = 1; page <= totalNumberOfPages; page++) {
        if (page === 1 || Math.abs(page - currentPage) <= 1 || page === totalNumberOfPages) {
          const paginationItem: PaginationItem = {
            text: page.toString(),
            href: `${href}?page=${page}`,
            selected: page === currentPage,
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
      }

      return paginationItems;
    }
  }
}
