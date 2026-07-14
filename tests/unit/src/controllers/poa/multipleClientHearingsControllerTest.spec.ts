import { expect } from "chai";
import { describe, it, beforeEach } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import { multipleClientHearings, submitMultipleClientHearings } from "#src/controllers/poa/multipleClientHearingsController.js";
import { V7Generator } from "uuidv7";

describe("multipleClientHearingsController", () => {
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

  it("renders the multiple client hearings radio question page", () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
    } as unknown as Request;

    multipleClientHearings(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/radioQuestionPage.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");
    expect(renderArgs.vm.title.key).to.equal("pages.multipleClientHearings.title");
    expect(renderArgs.vm.form.fieldName).to.equal("multipleClientHearings");
  });

  it("redirects to escaping the standard fixed fee page when multiple client hearings answer is given", () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
      body: {
        multipleClientHearings: "yes",
      },
    } as unknown as Request;

    submitMultipleClientHearings(req, res, next);

    expect((res.redirect as sinon.SinonStub).calledWith(
      `/claims/${claimId.toString()}/poa/escaping-standard-fixed-fee`,
    )).to.equal(true);
  });

  it("rerenders the radio question page with an error when no option is selected", () => {
    const req = {
      params: {
        claimId: claimId.toString(),
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
        claimId: claimId.toString(),
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