import { expect } from "chai";
import { describe, it, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import { multipleClientHearings, submitMultipleClientHearings } from "#src/controllers/poa/multipleClientHearingsController.js";
import { V7Generator } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import { Claim } from "#src/types/Claim.js";
import { PoaNavigator } from "#src/navigation/poaNavigator.js";

describe("multipleClientHearingsController", () => {
  let res: Response;
  let next: NextFunction;
  let redirectStub: sinon.SinonStub;
  let updateClaimStub: sinon.SinonStub;
  let redirectFromMultipleClientHearingsStub: sinon.SinonStub;

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

    redirectFromMultipleClientHearingsStub = sinon.stub(
      PoaNavigator.prototype,
      "redirectFromMultipleClientHearings",
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  it("renders the multiple client hearings radio question page", () => {
    const req = {
      claim: new Claim({
        id: claimId.toString(),
      }),
    } as unknown as Request;

    multipleClientHearings(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/radioQuestionPage.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");
    expect(renderArgs.vm.title.key).to.equal("pages.multipleClientHearings.title");
    expect(renderArgs.vm.radios.name).to.equal("multipleClientHearings");
  });

  it("redirects when valid submission", async () => {
    const redirect = "/next-page";
    const req = {
      claim: new Claim({
        id: claimId.toString(),
      }),
      body: {
        multipleClientHearings: "yes",
      },
      query: {},
    } as unknown as Request;

    updateClaimStub.resolves({
      status: "success",
      body: null,
    });

    redirectFromMultipleClientHearingsStub.returns(redirect);

    await submitMultipleClientHearings(req, res, next);

    expect(
      updateClaimStub.calledWith(
        req.axiosMiddleware,
        sinon.match({
          id: claimId.toString(),
          multiClientHearingFlag: true,
        }),
      ),
    ).to.be.true;

    expect(redirectFromMultipleClientHearingsStub.calledOnce).to.be.true;
    expect(redirectStub.calledWith(redirect)).to.be.true;
  });

  it("rerenders the radio question page with an error when no option is selected", async () => {
    const req = {
      claim: new Claim({
        id: claimId.toString(),
      }),
      body: {},
    } as unknown as Request;

    await submitMultipleClientHearings(req, res, next);

    expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/radioQuestionPage.njk",
    );
  });

  it("rerenders with selected invalid string preserved when invalid option is submitted", async () => {
    const req = {
      claim: new Claim({
        id: claimId.toString(),
      }),
      body: {
        multipleClientHearings: "invalid",
      },
    } as unknown as Request;

    await submitMultipleClientHearings(req, res, next);

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(
      renderArgs.vm.radios.items.every(
        (choice: { checked: boolean }) => !choice.checked,
      ),
    ).to.equal(true);
  });
});