import { expect } from "chai";
import { describe, it, beforeEach } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import {
  poaClaimTypePage,
  submitPoaClaimType,
} from "#src/controllers/poa/poaClaimTypeController.js";

describe("poaClaimTypeController", () => {
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

  it("renders the POA claim type radio question page", () => {
    const req = {
      params: {
        claimId: "1",
      },
    } as unknown as Request;

    poaClaimTypePage(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/radioQuestionPage.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");
    expect(renderArgs.vm.title).to.equal("pages.poaClaimType.title");
    expect(renderArgs.vm.form.fieldName).to.equal("poaClaimType");
    expect(renderArgs.vm.form.choices).to.deep.include({
      value: "profit-cost",
      text: {
        key: "pages.poaClaimType.profitCost.text"
      },
      checked: false,
    });
  });

  it("redirects to profit cost details when Profit cost is selected", () => {
    const req = {
      params: {
        claimId: "1",
      },
      body: {
        poaClaimType: "profit-cost",
      },
    } as unknown as Request;

    submitPoaClaimType(req, res, next);

    expect((res.redirect as sinon.SinonStub).calledWith(
      "/claims/1/poa/profit-cost-details",
    )).to.equal(true);
  });

  it("redirects to expert cost details when Expert cost is selected", () => {
    const req = {
      params: {
        claimId: "1",
      },
      body: {
        poaClaimType: "expert-cost",
      },
    } as unknown as Request;

    submitPoaClaimType(req, res, next);

    expect((res.redirect as sinon.SinonStub).calledWith(
      "/claims/1/poa/expert-cost-details/1",
    )).to.equal(true);
  });

  it("redirects to non expert disbursement when Non expert disbursement is selected", () => {
    const req = {
      params: {
        claimId: "1",
      },
      body: {
        poaClaimType: "non-expert-disbursement",
      },
    } as unknown as Request;

    submitPoaClaimType(req, res, next);

    expect((res.redirect as sinon.SinonStub).calledWith(
      "/claims/1/poa/non-expert-disbursement",
    )).to.equal(true);
  });

  it("rerenders the radio question page with an error when no option is selected", () => {
    const req = {
      params: {
        claimId: "1",
      },
      body: {},
    } as unknown as Request;

    submitPoaClaimType(req, res, next);

    expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/radioQuestionPage.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.vm.form.error).to.deep.equal({
      fieldName: "poaClaimType",
      href: "#poaClaimType",
      text: {
        key: "pages.poaClaimType.errors.empty"
      },
    });
  });

  it("rerenders with selected invalid string preserved when invalid option is submitted", () => {
    const req = {
      params: {
        claimId: "1",
      },
      body: {
        poaClaimType: "something-invalid",
      },
    } as unknown as Request;

    submitPoaClaimType(req, res, next);

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.vm.form.error).to.deep.equal({
      fieldName: "poaClaimType",
      href: "#poaClaimType",
      text: {
        key: "pages.poaClaimType.errors.empty"
      },
    });

    expect(
      renderArgs.vm.form.choices.every(
        (choice: { checked: boolean }) => choice.checked === false,
      ),
    ).to.equal(true);
  });
});