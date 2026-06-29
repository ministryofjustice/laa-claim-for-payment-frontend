import { expect } from "chai";
import { describe, it, beforeEach } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import { escapingFixedFee, submitEscapingFixedFee } from "#src/controllers/poa/escapingFixedFeeController.js";

describe("escapingFixedFeeController", () => {
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

  it("renders the escaping the fixed fee radio question page", () => {
    const req = {
      params: {
        claimId: "1",
      },
    } as unknown as Request;

    escapingFixedFee(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/poa/escapingFixedFeeView.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");
    expect(renderArgs.vm.title).to.equal("pages.escapingFixedFee.question");
    expect(renderArgs.vm.form.fieldName).to.equal("escapingFixedFee");
  });

  it("redirects to CPGFS profit cost bill line page when escaping fixed fee answer is given", () => {
    const req = {
      params: {
        claimId: "1",
      },
      body: {
        escapingFixedFee: "yes",
      },
    } as unknown as Request;

    submitEscapingFixedFee(req, res, next);

    expect((res.redirect as sinon.SinonStub).calledWith(
      "/claims/1/poa/cpgfs-profit-cost-bill-line",
    )).to.equal(true);
  });

  it("rerenders the radio question page with an error when no option is selected", () => {
    const req = {
      params: {
        claimId: "1",
      },
      body: {},
    } as unknown as Request;

    submitEscapingFixedFee(req, res, next);

    expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/poa/escapingFixedFeeView.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.vm.form.error).to.deep.equal({
      fieldName: "escapingFixedFee",
      href: "#escapingFixedFee",
      text: {
        key: "pages.escapingFixedFee.errors.empty"
      },
    });
  });

  it("rerenders with selected invalid string preserved when invalid option is submitted", () => {
    const req = {
      params: {
        claimId: "1",
      },
      body: {
        escapingFixedFee: "invalid",
      },
    } as unknown as Request;

    submitEscapingFixedFee(req, res, next);

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.vm.form.error).to.deep.equal({
      fieldName: "escapingFixedFee",
      href: "#escapingFixedFee",
      text: {
        key: "pages.escapingFixedFee.errors.empty"
      },
    });

    expect(
      renderArgs.vm.form.choices.every(
        (choice: { checked: boolean }) => choice.checked === false,
      ),
    ).to.equal(true);
  });
});