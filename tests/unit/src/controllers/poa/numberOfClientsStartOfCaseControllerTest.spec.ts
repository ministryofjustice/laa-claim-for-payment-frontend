import { expect } from "chai";
import { beforeEach, describe, it } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import {
  numberOfClientsStartOfCase,
  submitNumberOfClientsStartOfCase,
} from "#src/controllers/poa/numberOfClientsStartOfCaseController.js";

describe("numberOfClientsStartOfCaseController", () => {
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    res = {
      render: sinon.stub(),
      redirect: sinon.stub(),
      status: sinon.stub().returnsThis(),
      locals: {
        csrfToken: "test-csrf-token",
      },
    } as unknown as Response;

    next = sinon.stub() as unknown as NextFunction;
  });

  it("renders the number of clients start of case radio question page", () => {
    const req = {
      params: {
        claimId: "1",
      },
    } as unknown as Request;

    numberOfClientsStartOfCase(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/radioQuestionPage.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");
    expect(renderArgs.vm.title).to.equal(
      "pages.numberOfClientsStartOfCase.title",
    );
    expect(renderArgs.vm.form.fieldName).to.equal(
      "numberOfClientsStartOfCase",
    );
    expect(renderArgs.vm.form.choices).to.deep.equal([
      {
        value: "none",
        text: {
          key: "pages.numberOfClientsStartOfCase.none.text"
        },
        checked: false,
      },
      {
        value: "one",
        text: {
          key: "pages.numberOfClientsStartOfCase.one.text"
        },
        checked: false,
      },
      {
        value: "more-than-two",
        text: {
          key: "pages.numberOfClientsStartOfCase.moreThanTwo.text"
        },
        checked: false,
      },
    ]);
  });

  it("redirects to multiple client hearings when 0 is selected", () => {
    const req = {
      params: {
        claimId: "1",
      },
      body: {
        numberOfClientsStartOfCase: "none",
      },
    } as unknown as Request;

    submitNumberOfClientsStartOfCase(req, res, next);

    expect(
      (res.redirect as sinon.SinonStub).calledWith(
        "/claims/1/poa/multiple-client-hearings",
      ),
    ).to.equal(true);
  });

  it("redirects to multiple client hearings when 1 is selected", () => {
    const req = {
      params: {
        claimId: "1",
      },
      body: {
        numberOfClientsStartOfCase: "one",
      },
    } as unknown as Request;

    submitNumberOfClientsStartOfCase(req, res, next);

    expect(
      (res.redirect as sinon.SinonStub).calledWith(
        "/claims/1/poa/multiple-client-hearings",
      ),
    ).to.equal(true);
  });

  it("redirects to multiple client hearings when 2+ is selected", () => {
    const req = {
      params: {
        claimId: "1",
      },
      body: {
        numberOfClientsStartOfCase: "more-than-two",
      },
    } as unknown as Request;

    submitNumberOfClientsStartOfCase(req, res, next);

    expect(
      (res.redirect as sinon.SinonStub).calledWith(
        "/claims/1/poa/multiple-client-hearings",
      ),
    ).to.equal(true);
  });

  it("rerenders with an error when no option is selected", () => {
    const req = {
      params: {
        claimId: "1",
      },
      body: {},
    } as unknown as Request;

    submitNumberOfClientsStartOfCase(req, res, next);

    expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/radioQuestionPage.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.vm.form.error).to.deep.equal({
      text: {
        key: "pages.numberOfClientsStartOfCase.error.empty"
      },
    });
  });
});