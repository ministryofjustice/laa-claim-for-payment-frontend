import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import {
  howManyClientsRetained,
  submitHowManyClientsRetained,
} from "#src/controllers/poa/howManyClientsRetainedController.js";
import { V7Generator } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import { Claim, Count } from "#src/types/Claim.js";
import { PoaNavigator } from "#src/navigation/poaNavigator.js";

describe("howManyClientsRetainedController", () => {
  let res: Response;
  let next: NextFunction;
  let redirectStub: sinon.SinonStub;
  let updateClaimStub: sinon.SinonStub;
  let redirectFromHowManyClientsRetainedStub: sinon.SinonStub;

  const claimId = new V7Generator().generate();

  beforeEach(() => {
    redirectStub = sinon.stub();

    res = {
      render: sinon.stub(),
      redirect: redirectStub,
      status: sinon.stub().returnsThis(),
      locals: {
        csrfToken: "test-csrf-token",
      },
    } as unknown as Response;

    next = sinon.stub() as unknown as NextFunction;

    updateClaimStub = sinon.stub(claimService, "updateClaim");

    redirectFromHowManyClientsRetainedStub = sinon.stub(
      PoaNavigator.prototype,
      "redirectFromHowManyClientsRetained",
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  it("renders the page", () => {
    const req = {
      claim: new Claim({
        id: claimId.toString(),
      }),
    } as unknown as Request;

    howManyClientsRetained(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.be.true;
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/radioQuestionPage.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");
    expect(renderArgs.vm.title.key).to.equal(
      "pages.howManyClientsRetained.title",
    );
    expect(renderArgs.vm.radios.name).to.equal("howManyClientsRetained");
  });

  it("redirects when valid submission", async () => {
    const redirect = "/next-page";

    const req = {
      claim: new Claim({
        id: claimId.toString(),
      }),
      body: {
        howManyClientsRetained: "ZERO",
      },
      query: {},
    } as unknown as Request;

    updateClaimStub.resolves({
      status: "success",
      body: null,
    });

    redirectFromHowManyClientsRetainedStub.returns(redirect);

    await submitHowManyClientsRetained(req, res, next);

    expect(
      updateClaimStub.calledWith(
        req.axiosMiddleware,
        sinon.match({
          id: claimId.toString(),
          clientsRetainedCount: "ZERO",
        }),
      ),
    ).to.be.true;

    expect(redirectFromHowManyClientsRetainedStub.calledOnceWith(Count.ZERO)).to
      .be.true;
    expect(redirectStub.calledWith(redirect)).to.be.true;
  });

  it("re-renders the page with an error when no option is selected", async () => {
    const req = {
      body: {},
    } as unknown as Request;

    await submitHowManyClientsRetained(req, res, next);

    expect((res.status as sinon.SinonStub).calledWith(400)).to.be.true;
    expect((res.render as sinon.SinonStub).calledOnce).to.be.true;
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/radioQuestionPage.njk",
    );
  });

  it("re-renders the page with an error when an invalid option is selected", async () => {
    const req = {
      body: {
        howManyClientsRetained: "invalid",
      },
    } as unknown as Request;

    await submitHowManyClientsRetained(req, res, next);

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(
      renderArgs.vm.radios.items.every(
        (choice: { checked: boolean }) => !choice.checked,
      ),
    ).to.be.true;
  });
});