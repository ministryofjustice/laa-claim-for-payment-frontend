/**
 * API Types
 *
 * This file contains all TypeScript interfaces and types related to API requests and responses.
 * These types are used across different services and components for consistent API interactions.
 */

/**
 * Pagination metadata interface
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

/**
 * API response interface with pagination
 */
export interface ApiResponse<T> {
  data: T[];
  pagination: PaginationMeta;
  status: "success" | "error";
  message?: string;
}

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
