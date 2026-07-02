import { expect } from "chai";
import { beforeEach, describe, it } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import {
  poaClaimTypePage,
  submitPoaClaimType,
} from "#src/controllers/poa/poaClaimTypeController.js";
import type { AnswersCache } from "#src/services/answersCache.js";
import { z } from "zod";

describe("poaClaimTypeController", () => {
  let res: Response;
  let next: NextFunction;
  let answersCache: AnswersCache;

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

    answersCache = {
      get: sinon.stub().resolves(null),
      set: sinon.stub().resolves(),
      remove: sinon.stub().resolves(),
      clear: sinon.stub().resolves(),
    };
  });

  it("renders the POA claim type radio question page", async () => {
    const req = {
      sessionID: "session-123",
      params: {
        claimId: "1",
      },
    } as unknown as Request;

    await poaClaimTypePage(req, res, next, { answersCache });

    const args = (answersCache.get as sinon.SinonStub).firstCall.args;

    expect(args[0]).to.equal("session-123");
    expect(args[1]).to.equal(1);
    expect(args[2]).to.deep.equal(["poa", "type"]);
    expect(args[3]).to.be.instanceOf(z.ZodString);

    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/radioQuestionPage.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");
    expect(renderArgs.vm.title.key).to.equal("pages.poaClaimType.title");
    expect(renderArgs.vm.form.fieldName).to.equal("poaClaimType");
    expect(renderArgs.vm.form.choices).to.deep.include({
      value: "profit-cost",
      text: {
        key: "pages.poaClaimType.profitCost.text",
      },
      checked: false,
    });
  });

  it("redirects to profit cost details when Profit cost is selected", async () => {
    const req = {
      sessionID: "session-123",
      params: {
        claimId: "1",
      },
      body: {
        poaClaimType: "profit-cost",
      },
    } as unknown as Request;

    await submitPoaClaimType(req, res, next, { answersCache });

    expect((answersCache.set as sinon.SinonStub).calledOnce).to.equal(true);
    expect((answersCache.set as sinon.SinonStub).firstCall.args).to.deep.equal([
      "session-123",
      1,
      ["poa", "type"],
      "profit-cost",
    ]);

    expect((res.redirect as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.redirect as sinon.SinonStub).firstCall.args).to.deep.equal([
      "/claims/1/poa/profit-cost-details",
    ]);
  });

  it("redirects to expert cost details when Expert cost is selected", async () => {
    const req = {
      sessionID: "session-123",
      params: {
        claimId: "1",
      },
      body: {
        poaClaimType: "expert-cost",
      },
    } as unknown as Request;

    await submitPoaClaimType(req, res, next, { answersCache });

    expect((answersCache.set as sinon.SinonStub).calledOnce).to.equal(true);
    expect((answersCache.set as sinon.SinonStub).firstCall.args).to.deep.equal([
      "session-123",
      1,
      ["poa", "type"],
      "expert-cost",
    ]);

    expect((res.redirect as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.redirect as sinon.SinonStub).firstCall.args).to.deep.equal([
      "/claims/1/poa/expert-cost-details/1",
    ]);
  });

  it("redirects to non expert disbursement when Non expert disbursement is selected", async () => {
    const req = {
      sessionID: "session-123",
      params: {
        claimId: "1",
      },
      body: {
        poaClaimType: "non-expert-disbursement",
      },
    } as unknown as Request;

    await submitPoaClaimType(req, res, next, { answersCache });

    expect((answersCache.set as sinon.SinonStub).calledOnce).to.equal(true);
    expect((answersCache.set as sinon.SinonStub).firstCall.args).to.deep.equal([
      "session-123",
      1,
      ["poa", "type"],
      "non-expert-disbursement",
    ]);

    expect((res.redirect as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.redirect as sinon.SinonStub).firstCall.args).to.deep.equal([
      "/claims/1/poa/non-expert-disbursement",
    ]);
  });

  it("rerenders the radio question page with an error when no option is selected", async () => {
    const req = {
      sessionID: "session-123",
      params: {
        claimId: "1",
      },
      body: {},
    } as unknown as Request;

    await submitPoaClaimType(req, res, next, { answersCache });

    expect((answersCache.set as sinon.SinonStub).notCalled).to.equal(true);
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
        key: "pages.poaClaimType.errors.empty",
      },
    });
  });

  it("rerenders with selected invalid string preserved when invalid option is submitted", async () => {
    const req = {
      sessionID: "session-123",
      params: {
        claimId: "1",
      },
      body: {
        poaClaimType: "something-invalid",
      },
    } as unknown as Request;

    await submitPoaClaimType(req, res, next, { answersCache });

    expect((answersCache.set as sinon.SinonStub).notCalled).to.equal(true);

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.vm.form.error).to.deep.equal({
      fieldName: "poaClaimType",
      href: "#poaClaimType",
      text: {
        key: "pages.poaClaimType.errors.empty",
      },
    });

    expect(
      renderArgs.vm.form.choices.every(
        (choice: { checked: boolean }) => choice.checked === false,
      ),
    ).to.equal(true);
  });
});