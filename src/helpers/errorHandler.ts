/**
 * Error Handler Utility
 *
 * Provides comprehensive error handling for API requests including:
 * - HTTP status code mapping to user-friendly messages
 * - Network error handling
 * - Response message extraction
 * - Structured logging
 */

import { devError } from "./index.js";
import type { ApiError } from "#src/types/api-types.js";
import type { ApiErrorResponse } from "#src/generated/claim-api/index.js";
import axios from "axios";
import type { HttpError } from "http-errors";
import createHttpError from "http-errors";

// HTTP Status Code Constants
const HTTP_BAD_REQUEST = 400;
const HTTP_UNAUTHORIZED = 401;
const HTTP_FORBIDDEN = 403;
const HTTP_NOT_FOUND = 404;
const HTTP_REQUEST_TIMEOUT = 408;
const HTTP_TOO_MANY_REQUESTS = 429;
const HTTP_INTERNAL_SERVER_ERROR = 500;
const HTTP_BAD_GATEWAY = 502;
const HTTP_SERVICE_UNAVAILABLE = 503;
const HTTP_GATEWAY_TIMEOUT = 504;

/**
 * Get user-friendly message for HTTP status codes
 * @param {number} status - HTTP status code
 * @returns {string} User-friendly error message
 */
function getHttpErrorMessage(status: number): string {
  switch (status) {
    case HTTP_BAD_REQUEST:
      return 'Invalid request. Please check your input and try again.';
    case HTTP_UNAUTHORIZED:
      return 'Authentication failed. Please log in again.';
    case HTTP_FORBIDDEN:
      return 'You do not have permission to access this resource.';
    case HTTP_NOT_FOUND:
      return 'The requested information could not be found.';
    case HTTP_REQUEST_TIMEOUT:
      return 'Request timed out. Please try again.';
    case HTTP_TOO_MANY_REQUESTS:
      return 'Too many requests. Please wait a moment and try again.';
    case HTTP_INTERNAL_SERVER_ERROR:
      return 'Internal server error. Please try again later.';
    case HTTP_BAD_GATEWAY:
      return 'Service temporarily unavailable. Please try again later.';
    case HTTP_SERVICE_UNAVAILABLE:
      return 'Service unavailable. Please try again later.';
    case HTTP_GATEWAY_TIMEOUT:
      return 'Request timed out. Please try again later.';
    default:
      return `Service error (${status}). Please try again later.`;
  }
}

/**
 * Extract error message from various error types with user-friendly messages
 * @param {unknown} error - Error object
 * @returns {string} User-friendly error message
 */
function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return JSON.stringify(error);
}

/**
 * Create a processed error with user-friendly message for global error handler
 * @param {unknown} error - Original error object
 * @param {string} context - Context description for logging (e.g., "loading cases", "fetching client details")
 * @returns {Error} Processed error with user-friendly message
 */
export function processError(error: unknown, context: string): Error {
  const message = extractErrorMessage(error);
  devError(`Error ${context}: ${message}`);
  return new Error(message, { cause: error });
}

/**
 * Convert ApiError to HttpError
 * @param {ApiError} error - Original error object
 * @param {string} context - Context description for logging (e.g., "loading cases", "fetching client details")
 * @returns {HttpError} Processed error
 */
export function processApiError(error: ApiError, context: string): HttpError {
  const { statusCode, message } = error;
  devError(`Error ${context}: ${message}`);
  return createHttpError(statusCode, message);
}

/**
 * Create API error
 * @param {unknown} error - Original error object
 * @returns {ApiError} API error
 */
export function createApiError(error: unknown): ApiError {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    if (error.response != null) {
      const { response } = error;
      return {
        status: "error",
        statusCode: response.status,
        message: response.data.detail ?? getHttpErrorMessage(response.status),
      };
    } else {
      switch (error.code) {
        case "ECONNABORTED":
        case "ETIMEDOUT":
          return {
            status: "error",
            statusCode: HTTP_GATEWAY_TIMEOUT,
            message: "Request timed out",
          };

        case "ECONNREFUSED":
        case "ENOTFOUND":
        case "ECONNRESET":
          return {
            status: "error",
            statusCode: HTTP_SERVICE_UNAVAILABLE,
            message: "Unable to reach upstream service",
          };

        default:
          return {
            status: "error",
            statusCode: HTTP_INTERNAL_SERVER_ERROR,
            message: error.message,
          };
      }
    }
  }

  return {
    status: "error",
    statusCode: HTTP_INTERNAL_SERVER_ERROR,
    message: extractErrorMessage(error),
  };
}
