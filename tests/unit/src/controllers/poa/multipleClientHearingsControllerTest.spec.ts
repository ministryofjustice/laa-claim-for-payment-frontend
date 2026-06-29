import { expect } from "chai";
import { describe, it, beforeEach } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import { multipleClientHearings, submitMultipleClientHearings } from "#src/controllers/poa/multipleClientHearingsController.js";

describe("multipleClientHearingsController", () => {
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

  it("renders the multiple client hearings radio question page", () => {
    const req = {
      params: {
        claimId: "1",
      },
    } as unknown as Request;

    multipleClientHearings(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/radioQuestionPage.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");
    expect(renderArgs.vm.title).to.equal("pages.multipleClientHearings.title");
    expect(renderArgs.vm.form.fieldName).to.equal("multipleClientHearings");
  });

  it("redirects to escaping the standard fixed fee page when multiple client hearings answer is given", () => {
    const req = {
      params: {
        claimId: "1",
      },
      body: {
        multipleClientHearings: "yes",
      },
    } as unknown as Request;

    submitMultipleClientHearings(req, res, next);

    expect((res.redirect as sinon.SinonStub).calledWith(
      "/claims/1/poa/escaping-standard-fixed-fee",
    )).to.equal(true);
  });

  it("rerenders the radio question page with an error when no option is selected", () => {
    const req = {
      params: {
        claimId: "1",
      },
      body: {},
    } as unknown as Request;

    submitMultipleClientHearings(req, res, next);

    expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/radioQuestionPage.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.vm.form.error).to.deep.equal({
      fieldName: "multipleClientHearings",
      href: "#multipleClientHearings",
      text: {
        key: "pages.multipleClientHearings.errors.empty"
      },
    });
  });

  it("rerenders with selected invalid string preserved when invalid option is submitted", () => {
    const req = {
      params: {
        claimId: "1",
      },
      body: {
        multipleClientHearings: "invalid",
      },
    } as unknown as Request;

    submitMultipleClientHearings(req, res, next);

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.vm.form.error).to.deep.equal({
      fieldName: "multipleClientHearings",
      href: "#multipleClientHearings",
      text: {
        key: "pages.multipleClientHearings.errors.empty"
      },
    });

    expect(
      renderArgs.vm.form.choices.every(
        (choice: { checked: boolean }) => choice.checked === false,
      ),
    ).to.equal(true);
  });
});