/**
 * @description Tests that these utility functions handle error for our API requests
 */

import {
  createApiError,
  processApiError,
  processError,
} from "#src/helpers/errorHandler.js";
import { strict as assert } from "assert";
import sinon from "sinon";
import { ApiError } from "#src/types/api-types.js";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "#src/generated/claim-api/index.js";

describe("errorHandler", () => {
  beforeEach(() => {
    sinon.stub(console, "log");
    sinon.stub(console, "error");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("processError", () => {
    it("returns Error with expected message and cause when error is of type Error", () => {
      const inputError = new Error("Original");
      const result = processError(inputError, "doing something");
      assert(result instanceof Error);
      assert.strictEqual(result.message, "Original");
      assert.strictEqual(result.cause, inputError);
    });

    it("returns Error with expected message and cause when error is of type String", () => {
      const inputError = "Original";
      const result = processError(inputError, "doing something");
      assert(result instanceof Error);
      assert.strictEqual(result.message, "Original");
      assert.strictEqual(result.cause, inputError);
    });

    it("returns Error with expected message and cause when error is of other type", () => {
      const inputError = { foo: "bar" };
      const result = processError(inputError, "doing something");
      assert(result instanceof Error);
      assert.strictEqual(result.message, "{\"foo\":\"bar\"}");
      assert.strictEqual(result.cause, inputError);
    });
  });

  describe("processApiError", () => {
    it("should convert to HTTP error", () => {
      const error: ApiError = {
        status: "error",
        statusCode: 400,
        message: "There was an error with status code 400",
      };
      const result = processApiError(error, "context");
      assert.strictEqual(result.status, 400);
      assert.strictEqual(result.statusCode, 400);
      assert.strictEqual(result.message, "There was an error with status code 400");
    });
  });

  describe("createApiError", () => {

    [
      {
        status: 400,
        message: "Invalid request. Please check your input and try again.",
      },
      {
        status: 401,
        message: "Authentication failed. Please log in again.",
      },
      {
        status: 403,
        message: "You do not have permission to access this resource.",
      },
      {
        status: 404,
        message: "The requested information could not be found.",
      },
      {
        status: 408,
        message: "Request timed out. Please try again.",
      },
      {
        status: 429,
        message: "Too many requests. Please wait a moment and try again.",
      },
      {
        status: 500,
        message: "Internal server error. Please try again later.",
      },
      {
        status: 502,
        message: "Service temporarily unavailable. Please try again later.",
      },
      {
        status: 503,
        message: "Service unavailable. Please try again later.",
      },
      {
        status: 504,
        message: "Request timed out. Please try again later.",
      },
    ].forEach(({ status, message }) => {
      it(`should convert axios error with response and ${status} status to API error`, () => {
        const error = {
          isAxiosError: true,
          response: {
            status: status,
            data: {}
          },
        } as AxiosError<ApiErrorResponse>;

        const result = createApiError(error);
        assert.strictEqual(result.status, "error");
        assert.strictEqual(result.statusCode, status);
        assert.strictEqual(result.message, message);
      });
    });

    it("should convert axios error with response and other status to API error", () => {
      const error = {
        isAxiosError: true,
        response: {
          status: 599,
          data: {}
        },
      } as AxiosError<ApiErrorResponse>;

      const result = createApiError(error);
      assert.strictEqual(result.status, "error");
      assert.strictEqual(result.statusCode, 599);
      assert.strictEqual(result.message, "Service error (599). Please try again later.");
    });

    it("should convert axios error with response and detail to API error", () => {
      const error = {
        isAxiosError: true,
        response: {
          status: 400,
          data: {
            detail: "Error message",
          },
        },
      } as AxiosError<ApiErrorResponse>;

      const result = createApiError(error);
      assert.strictEqual(result.status, "error");
      assert.strictEqual(result.statusCode, 400);
      assert.strictEqual(result.message, "Error message");
    });

    ["ECONNABORTED", "ETIMEDOUT"].forEach((code) => {
      it(`should convert axios error with code ${code} to 504 network error`, () => {
        const error = {
          isAxiosError: true,
          code: code,
        } as AxiosError<ApiErrorResponse>;

        const result = createApiError(error);
        assert.strictEqual(result.status, "error");
        assert.strictEqual(result.statusCode, 504);
        assert.strictEqual(result.message, "Request timed out");
      });
    });

    ["ECONNREFUSED", "ENOTFOUND", "ECONNRESET"].forEach((code) => {
      it(`should convert axios error with code ${code} to 503 network error`, () => {
        const error = {
          isAxiosError: true,
          code: code,
        } as AxiosError<ApiErrorResponse>;

        const result = createApiError(error);
        assert.strictEqual(result.status, "error");
        assert.strictEqual(result.statusCode, 503);
        assert.strictEqual(result.message, "Unable to reach upstream service");
      });
    });

    it(`should convert axios error with any other code to 500 network error`, () => {
      const error = {
        isAxiosError: true,
        code: "EFOO",
        message: "bar"
      } as AxiosError<ApiErrorResponse>;

      const result = createApiError(error);
      assert.strictEqual(result.status, "error");
      assert.strictEqual(result.statusCode, 500);
      assert.strictEqual(result.message, "bar");
    });

    it("should convert non-axios error to 500 error", () => {
      const error = new Error("Foo");

      const result = createApiError(error);

      assert.strictEqual(result.status, "error");
      assert.strictEqual(result.statusCode, 500);
      assert.strictEqual(result.message, "Foo");
    });
  });
});
