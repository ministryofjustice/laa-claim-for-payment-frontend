import { expect } from "chai";
import { beforeEach, describe, it } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import {
  howManyClientsRetained,
  submitHowManyClientsRetained,
} from "#src/controllers/poa/howManyClientsRetainedController.js";

describe("howManyClientsRetainedController", () => {
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

  it("renders the page", () => {
    const req = {
      params: {
        claimId: "1",
      },
    } as unknown as Request;

    howManyClientsRetained(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.be.true;
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/radioQuestionPage.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");
    expect(renderArgs.vm.title).to.equal("pages.howManyClientsRetained.title");
    expect(renderArgs.vm.form.fieldName).to.equal("howManyClientsRetained");
  });

  it("redirects to number of clients at start of case when answer is 0", () => {
    const req = {
      params: {
        claimId: "1",
      },
      body: {
        howManyClientsRetained: "none",
      },
    } as unknown as Request;

    submitHowManyClientsRetained(req, res, next);

    expect(
      (res.redirect as sinon.SinonStub).calledWith(
        "/claims/1/poa/number-of-clients-start-of-case",
      ),
    ).to.be.true;
  });

  it("redirects to multiple client hearings when answer is not 0", () => {
    const selections: string[] = ["one", "more-than-two"];

    selections.forEach((selection: string) => {
      const req = {
        params: {
          claimId: "1",
        },
        body: {
          howManyClientsRetained: selection,
        },
      } as unknown as Request;

      submitHowManyClientsRetained(req, res, next);

      expect(
        (res.redirect as sinon.SinonStub).calledWith(
          "/claims/1/poa/multiple-client-hearings",
        ),
      ).to.be.true;
    });
  });

  it("re-renders the page with an error when no option is selected", () => {
    const req = {
      params: {
        claimId: "1",
      },
      body: {},
    } as unknown as Request;

    submitHowManyClientsRetained(req, res, next);

    expect((res.status as sinon.SinonStub).calledWith(400)).to.be.true;
    expect((res.render as sinon.SinonStub).calledOnce).to.be.true;
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/radioQuestionPage.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.vm.form.error).to.deep.equal({
      fieldName: "howManyClientsRetained",
      href: "#howManyClientsRetained",
      text: {
        key: "pages.howManyClientsRetained.errors.empty"
      },
    });
  });

  it("re-renders the page with an error when an invalid option is selected", () => {
    const req = {
      params: {
        claimId: "1",
      },
      body: {
        howManyClientsRetained: "invalid",
      },
    } as unknown as Request;

    submitHowManyClientsRetained(req, res, next);

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.vm.form.error).to.deep.equal({
      fieldName: "howManyClientsRetained",
      href: "#howManyClientsRetained",
      text: {
        key: "pages.howManyClientsRetained.errors.empty"
      },
    });

    expect(
      renderArgs.vm.form.choices.every(
        (choice: { checked: boolean }) => !choice.checked,
      ),
    ).to.be.true;
  });
});