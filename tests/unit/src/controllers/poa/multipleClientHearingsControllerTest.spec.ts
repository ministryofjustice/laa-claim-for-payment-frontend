import { expect } from "chai";
import { describe, it, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import { multipleClientHearings, submitMultipleClientHearings } from "#src/controllers/poa/multipleClientHearingsController.js";
import { V7Generator } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import { Claim } from "#src/types/Claim.js";

describe("multipleClientHearingsController", () => {
  let res: Response;
  let next: NextFunction;
  let updateClaimStub: sinon.SinonStub;

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

    updateClaimStub = sinon.stub(claimService, "updateClaim");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("renders the multiple client hearings radio question page", async () => {
    const req = {
      claim: new Claim({
        id: claimId.toString(),
      }),
    } as unknown as Request;

    await multipleClientHearings(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/radioQuestionPage.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");
    expect(renderArgs.vm.title.key).to.equal("pages.multipleClientHearings.title");
    expect(renderArgs.vm.radios.name).to.equal("multipleClientHearings");
  });

  it("redirects to escaping the standard fixed fee page when multiple client hearings answer is given", async () => {
    const req = {
      claim: new Claim({
        id: claimId.toString(),
      }),
      body: {
        multipleClientHearings: "yes",
      },
    } as unknown as Request;

    updateClaimStub.resolves({
      status: "success",
      body: null,
    });

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

    expect((res.redirect as sinon.SinonStub).calledWith(
      `/claims/${claimId.toString()}/poa/escaping-standard-fixed-fee`,
    )).to.equal(true);
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