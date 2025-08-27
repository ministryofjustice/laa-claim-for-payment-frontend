/**
 * @description Tests that these utility functions handle error for our API requests
 */

import {
  extractErrorMessage,
  isAuthError,
  isForbiddenError,
  isNotFoundError,
  isServerError,
  createProcessedError,
  extractAndLogError,
} from "#src/helpers/errorHandler.js";
import { strict as assert } from "assert";
import sinon from "sinon";

describe("errorHandler", () => {
  beforeEach(() => {
    sinon.stub(console, "log");
    sinon.stub(console, "error");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("extractErrorMessage", () => {
    it("returns user-friendly message for axios-like error with status", () => {
      const axiosError = {
        response: { status: 404, data: {}, statusText: "Not Found" },
      };
      const result = extractErrorMessage(axiosError);
      assert.strictEqual(result, "The requested information could not be found.");
    });

    it("extracts message from response.data.message if available", () => {
      const axiosError = {
        response: {
          status: 400,
          data: { message: "Invalid input field" },
          statusText: "Bad Request",
        },
      };
      const result = extractErrorMessage(axiosError);
      assert.strictEqual(result, "Invalid input field");
    });

    it("returns fallback message for unknown object", () => {
      const result = extractErrorMessage({ foo: "bar" });
      assert.strictEqual(result, "An unexpected error occurred. Please try again.");
    });

    it("returns message for string error", () => {
      const result = extractErrorMessage("some string error");
      assert.strictEqual(result, "An error occurred. Please try again.");
    });

    it("returns fallback message for null error", () => {
      const result = extractErrorMessage(null);
      assert.strictEqual(result, "An unexpected error occurred. Please try again.");
    });
  });

  describe("status code helpers", () => {
    it("isAuthError returns true for 401", () => {
      const error = { response: { status: 401 } };
      assert.strictEqual(isAuthError(error), true);
    });

    it("isForbiddenError returns true for 403", () => {
      const error = { response: { status: 403 } };
      assert.strictEqual(isForbiddenError(error), true);
    });

    it("isNotFoundError returns true for 404", () => {
      const error = { response: { status: 404 } };
      assert.strictEqual(isNotFoundError(error), true);
    });

    it("isServerError returns true for 500", () => {
      const error = { response: { status: 500 } };
      assert.strictEqual(isServerError(error), true);
    });
  });

  describe("returns user-friendly message for known network error codes:", () => {
    it("ECONNREFUSED", () => {
      const networkError = { code: "ECONNREFUSED" };
      const result = extractErrorMessage(networkError);
      assert.strictEqual(result, "Unable to connect to the service. Please try again later.");
    });

    it("ENOTFOUND", () => {
      const networkError = { code: "ENOTFOUND" };
      const result = extractErrorMessage(networkError);
      assert.strictEqual(result, "Service not found. Please check your connection and try again.");
    });

    it("ETIMEDOUT", () => {
      const networkError = { code: "ETIMEDOUT" };
      const result = extractErrorMessage(networkError);
      assert.strictEqual(result, "Request timed out. Please try again.");
    });

    it("ECONNRESET", () => {
      const networkError = { code: "ECONNRESET" };
      const result = extractErrorMessage(networkError);
      assert.strictEqual(result, "Connection was reset. Please try again.");
    });

    it("default/unhandled", () => {
      const networkError = { code: "otherCode" };
      const result = extractErrorMessage(networkError);
      assert.strictEqual(result, "Network error. Please check your connection and try again.");
    });
  });

  describe("createProcessedError", () => {
    it("returns Error with expected message and cause", () => {
      const inputError = new Error("Original");
      const result = createProcessedError(inputError, "doing something");
      assert(result instanceof Error);
      assert.strictEqual(result.message, "An unexpected error occurred. Please try again.");
      assert.strictEqual(result.cause, inputError);
    });
  });

  describe("extractAndLogError returns and logs context for status code:", () => {
    it("400", () => {
      const error = { response: { status: 400 } };
      const result = extractAndLogError(error, "testing context");
      assert.strictEqual(result, "Invalid request. Please check your input and try again.");
    });

    it("401", () => {
      const error = { response: { status: 401 } };
      const result = extractAndLogError(error, "testing context");
      assert.strictEqual(result, "Authentication failed. Please log in again.");
    });

    it("403", () => {
      const error = { response: { status: 403 } };
      const result = extractAndLogError(error, "testing context");
      assert.strictEqual(result, "You do not have permission to access this resource.");
    });

    it("404", () => {
      const error = { response: { status: 404 } };
      const result = extractAndLogError(error, "testing context");
      assert.strictEqual(result, "The requested information could not be found.");
    });

    it("408", () => {
      const error = { response: { status: 408 } };
      const result = extractAndLogError(error, "testing context");
      assert.strictEqual(result, "Request timed out. Please try again.");
    });

    it("429", () => {
      const error = { response: { status: 429 } };
      const result = extractAndLogError(error, "testing context");
      assert.strictEqual(result, "Too many requests. Please wait a moment and try again.");
    });

    it("500", () => {
      const error = { response: { status: 500 } };
      const result = extractAndLogError(error, "testing context");
      assert.strictEqual(result, "Internal server error. Please try again later.");
    });

    it("502", () => {
      const error = { response: { status: 502 } };
      const result = extractAndLogError(error, "testing context");
      assert.strictEqual(result, "Service temporarily unavailable. Please try again later.");
    });

    it("503", () => {
      const error = { response: { status: 503 } };
      const result = extractAndLogError(error, "testing context");
      assert.strictEqual(result, "Service unavailable. Please try again later.");
    });

    it("504", () => {
      const error = { response: { status: 504 } };
      const result = extractAndLogError(error, "testing context");
      assert.strictEqual(result, "Request timed out. Please try again later.");
    });

    it("default/unhandled", () => {
      const error = { response: { status: 534 } };
      const result = extractAndLogError(error, "testing context");
      assert.strictEqual(result, "Service error (534). Please try again later.");
    });
  });
});
