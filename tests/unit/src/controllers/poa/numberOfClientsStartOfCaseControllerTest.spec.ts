import { expect } from "chai";
import { beforeEach, describe, it } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import {
  numberOfClientsStartOfCase,
  submitNumberOfClientsStartOfCase,
} from "#src/controllers/poa/numberOfClientsStartOfCaseController.js";
import { V7Generator } from "uuidv7";

describe("numberOfClientsStartOfCaseController", () => {
  let res: Response;
  let next: NextFunction;

  const claimId = new V7Generator().generate();

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
        claimId: claimId.toString(),
      },
    } as unknown as Request;

    numberOfClientsStartOfCase(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/radioQuestionPage.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");
    expect(renderArgs.vm.title.key).to.equal(
      "pages.numberOfClientsStartOfCase.title",
    );
    expect(renderArgs.vm.form.fieldName).to.equal(
      "numberOfClientsStartOfCase",
    );
    expect(renderArgs.vm.form.choices).to.deep.equal([
      {
        value: "ZERO",
        text: {
          key: "pages.numberOfClientsStartOfCase.none.text"
        },
        checked: false,
      },
      {
        value: "ONE",
        text: {
          key: "pages.numberOfClientsStartOfCase.one.text"
        },
        checked: false,
      },
      {
        value: "TWO_OR_MORE",
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
        claimId: claimId.toString(),
      },
      body: {
        numberOfClientsStartOfCase: "ZERO",
      },
    } as unknown as Request;

    submitNumberOfClientsStartOfCase(req, res, next);

    expect(
      (res.redirect as sinon.SinonStub).calledWith(
        `/claims/${claimId.toString()}/poa/multiple-client-hearings`,
      ),
    ).to.equal(true);
  });

  it("redirects to multiple client hearings when 1 is selected", () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
      body: {
        numberOfClientsStartOfCase: "ONE",
      },
    } as unknown as Request;

    submitNumberOfClientsStartOfCase(req, res, next);

    expect(
      (res.redirect as sinon.SinonStub).calledWith(
        `/claims/${claimId.toString()}/poa/multiple-client-hearings`,
      ),
    ).to.equal(true);
  });

  it("redirects to multiple client hearings when 2+ is selected", () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
      body: {
        numberOfClientsStartOfCase: "TWO_OR_MORE",
      },
    } as unknown as Request;

    submitNumberOfClientsStartOfCase(req, res, next);

    expect(
      (res.redirect as sinon.SinonStub).calledWith(
        `/claims/${claimId.toString()}/poa/multiple-client-hearings`,
      ),
    ).to.equal(true);
  });

  it("rerenders with an error when no option is selected", () => {
    const req = {
      params: {
        claimId: claimId.toString(),
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
      fieldName: "numberOfClientsStartOfCase",
      href: "#numberOfClientsStartOfCase",
      text: {
        key: "pages.numberOfClientsStartOfCase.errors.empty"
      },
    });
  });
});