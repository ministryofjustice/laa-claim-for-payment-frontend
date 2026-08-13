import { expect } from "chai";
import { describe, it } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import { validateLanguage } from "#src/helpers/validateLanguage.js";

describe("validateLanguage", () => {
  const res = {} as Response;

  it("allows requests with no lng query parameter", () => {
    const req = {
      query: {},
    } as unknown as Request;

    const next = sinon.stub() as unknown as NextFunction;

    validateLanguage(req, res, next);

    expect((next as sinon.SinonStub).calledOnce).to.equal(true);
    expect((next as sinon.SinonStub).firstCall.args).to.have.length(0);
  });

  it("allows English", () => {
    const req = {
      query: {
        lng: "en",
      },
    } as unknown as Request;

    const next = sinon.stub() as unknown as NextFunction;

    validateLanguage(req, res, next);

    expect((next as sinon.SinonStub).calledOnce).to.equal(true);
    expect((next as sinon.SinonStub).firstCall.args).to.have.length(0);
  });

  it("allows Welsh", () => {
    const req = {
      query: {
        lng: "cy",
      },
    } as unknown as Request;

    const next = sinon.stub() as unknown as NextFunction;

    validateLanguage(req, res, next);

    expect((next as sinon.SinonStub).calledOnce).to.equal(true);
    expect((next as sinon.SinonStub).firstCall.args).to.have.length(0);
  });

  it("returns a BadRequest error for an unsupported language", () => {
    const req = {
      query: {
        lng: "fr",
      },
    } as unknown as Request;

    const next = sinon.stub() as unknown as NextFunction;

    validateLanguage(req, res, next);

    expect((next as sinon.SinonStub).calledOnce).to.equal(true);

    const error = (next as sinon.SinonStub).firstCall.args[0];

    expect(error).to.exist;
    expect(error.statusCode).to.equal(400);
    expect(error.message).to.equal("Unsupported language");
  });

  it("returns a BadRequest error for a SQL injection-style lng value", () => {
    const req = {
      query: {
        lng: "cy' OR '1'='1' --",
      },
    } as unknown as Request;

    const next = sinon.stub() as unknown as NextFunction;

    validateLanguage(req, res, next);

    expect((next as sinon.SinonStub).calledOnce).to.equal(true);

    const error = (next as sinon.SinonStub).firstCall.args[0];

    expect(error).to.exist;
    expect(error.statusCode).to.equal(400);
    expect(error.message).to.equal("Unsupported language");
  });

  it("returns a BadRequest error when lng is not a string", () => {
    const req = {
      query: {
        lng: ["en", "cy"],
      },
    } as unknown as Request;

    const next = sinon.stub() as unknown as NextFunction;

    validateLanguage(req, res, next);

    expect((next as sinon.SinonStub).calledOnce).to.equal(true);

    const error = (next as sinon.SinonStub).firstCall.args[0];

    expect(error).to.exist;
    expect(error.statusCode).to.equal(400);
    expect(error.message).to.equal("Unsupported language");
  });
});