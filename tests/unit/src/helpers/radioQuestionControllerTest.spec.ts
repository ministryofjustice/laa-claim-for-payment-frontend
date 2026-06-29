import { expect } from "chai";
import { beforeEach, describe, it } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import { createRadioQuestionController } from "#src/helpers/radioQuestionController.js";

describe("createRadioQuestionController", () => {
  let res: Response;
  let next: NextFunction;

  const controller = createRadioQuestionController({
    title: {
      key: "pages.testRadio.title"
    },
    fieldName: "testRadio",
    choices: [
      {
        value: "yes",
        text: {
          key: "pages.testRadio.yes.text"
        },
      },
      {
        value: "no",
        text: {
          key: "pages.testRadio.no.text"
        },
      },
    ],
    messagePrefix: "pages.testRadio",
    renderErrorContext: "rendering test radio page",
    submitErrorContext: "submitting test radio page",
    getRedirectUrl: () => "/next-page",
  });

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

  it("renders the radio question page", () => {
    const req = {} as Request;

    controller.get(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/radioQuestionPage.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");
    expect(renderArgs.vm.title.key).to.equal("pages.testRadio.title");
    expect(renderArgs.vm.form.fieldName).to.equal("testRadio");
    expect(renderArgs.vm.form.choices).to.deep.equal([
      {
        value: "yes",
        text: {
          key: "pages.testRadio.yes.text"
        },
        checked: false,
      },
      {
        value: "no",
        text: {
          key: "pages.testRadio.no.text"
        },
        checked: false,
      },
    ]);
  });

  it("redirects when a valid choice is submitted", () => {
    const req = {
      body: {
        testRadio: "yes",
      },
    } as unknown as Request;

    controller.post(req, res, next);

    expect((res.redirect as sinon.SinonStub).calledWith("/next-page")).to.equal(
      true,
    );
  });

  it("passes the selected choice to getRedirectUrl", () => {
    const getRedirectUrl = sinon.stub().returns("/selected-choice-page");

    const controllerWithRedirectStub = createRadioQuestionController({
      title: {
        key: "pages.testRadio.title"
      },
      fieldName: "testRadio",
      choices: [
        {
          value: "yes",
          text: {
            key: "pages.testRadio.yes.text"
          },
        },
      ],
      messagePrefix: "pages.testRadio.error.empty",
      renderErrorContext: "rendering test radio page",
      submitErrorContext: "submitting test radio page",
      getRedirectUrl,
    });

    const req = {
      body: {
        testRadio: "yes",
      },
    } as unknown as Request;

    controllerWithRedirectStub.post(req, res, next);

    expect(getRedirectUrl.calledOnce).to.equal(true);
    expect(getRedirectUrl.firstCall.args[1]).to.equal("yes");
    expect(
      (res.redirect as sinon.SinonStub).calledWith("/selected-choice-page"),
    ).to.equal(true);
  });

  it("rerenders with an error when no valid choice is submitted", () => {
    const req = {
      body: {},
    } as unknown as Request;

    controller.post(req, res, next);

    expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/radioQuestionPage.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.vm.form.error).to.deep.equal({
      fieldName: "testRadio",
      href: "#testRadio",
      text: {
        key: "pages.testRadio.errors.empty"
      },
    });
  });

  it("preserves an invalid submitted string as selectedValue", () => {
    const req = {
      body: {
        testRadio: "invalid-choice",
      },
    } as unknown as Request;

    controller.post(req, res, next);

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.vm.form.choices.every(
      (choice: { checked: boolean }) => !choice.checked,
    )).to.equal(true);
    expect(renderArgs.vm.form.error).to.deep.equal({
      fieldName: "testRadio",
      href: "#testRadio",
      text: {
        key: "pages.testRadio.errors.empty"
      },
    });
  });
});