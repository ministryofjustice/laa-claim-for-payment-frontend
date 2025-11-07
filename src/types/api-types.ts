/**
 * API Types
 *
 * This file contains all TypeScript interfaces and types related to API requests and responses.
 * These types are used across different services and components for consistent API interactions.
 */

export interface ApiSuccess<T> {
  status: "success";
  body: T;
  message?: never;
}

export interface ApiError<E = string> {
  status: "error";
  message: E;
  body?: never;
}

export type ApiResponse<T, E = string> = ApiSuccess<T> | ApiError<E>;

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

export interface Paginated<Data> {
  meta: PaginationMeta;
  data: Data;
} 

