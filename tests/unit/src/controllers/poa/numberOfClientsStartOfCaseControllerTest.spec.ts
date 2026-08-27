import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import {
  numberOfClientsStartOfCase,
  submitNumberOfClientsStartOfCase,
} from "#src/controllers/poa/numberOfClientsStartOfCaseController.js";
import { V7Generator } from "uuidv7";
import { Claim } from "#src/types/Claim.js";
import { claimService } from "#src/services/claimService.js";

describe("numberOfClientsStartOfCaseController", () => {
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

  it("renders the number of clients start of case radio question page", async () => {
    const req = {
      claim: new Claim({
        id: claimId.toString(),
      }),
    } as unknown as Request;

    await numberOfClientsStartOfCase(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/radioQuestionPage.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");
    expect(renderArgs.vm.title.key).to.equal(
      "pages.numberOfClientsStartOfCase.title",
    );
    expect(renderArgs.vm.radios.name).to.equal(
      "numberOfClientsStartOfCase",
    );
    expect(renderArgs.vm.radios.items).to.deep.equal([
      {
        value: "ZERO",
        text: {
          key: "pages.numberOfClientsStartOfCase.ZERO.text"
        },
        checked: false,
      },
      {
        value: "ONE",
        text: {
          key: "pages.numberOfClientsStartOfCase.ONE.text"
        },
        checked: false,
      },
      {
        value: "TWO_OR_MORE",
        text: {
          key: "pages.numberOfClientsStartOfCase.TWO_OR_MORE.text"
        },
        checked: false,
      },
    ]);
  });

  it("redirects to multiple client hearings when 0 is selected", async () => {
    const req = {
      claim: new Claim({
        id: claimId.toString(),
      }),
      body: {
        numberOfClientsStartOfCase: "ZERO",
      },
    } as unknown as Request;

    updateClaimStub.resolves({
      status: "success",
      body: null,
    });

    await submitNumberOfClientsStartOfCase(req, res, next);

    expect(
      updateClaimStub.calledWith(
        req.axiosMiddleware,
        sinon.match({
          id: claimId.toString(),
          clientsStartCount: "ZERO",
        }),
      ),
    ).to.be.true;

    expect(
      (res.redirect as sinon.SinonStub).calledWith(
        `/claims/${claimId.toString()}/poa/multiple-client-hearings`,
      ),
    ).to.equal(true);
  });

  it("redirects to multiple client hearings when 1 is selected", async () => {
    const req = {
      claim: new Claim({
        id: claimId.toString(),
      }),
      body: {
        numberOfClientsStartOfCase: "ONE",
      },
    } as unknown as Request;

    updateClaimStub.resolves({
      status: "success",
      body: null,
    });

    await submitNumberOfClientsStartOfCase(req, res, next);

    expect(
      updateClaimStub.calledWith(
        req.axiosMiddleware,
        sinon.match({
          id: claimId.toString(),
          clientsStartCount: "ONE",
        }),
      ),
    ).to.be.true;

    expect(
      (res.redirect as sinon.SinonStub).calledWith(
        `/claims/${claimId.toString()}/poa/multiple-client-hearings`,
      ),
    ).to.equal(true);
  });

  it("redirects to multiple client hearings when 2+ is selected", async () => {
    const req = {
      claim: new Claim({
        id: claimId.toString(),
      }),
      body: {
        numberOfClientsStartOfCase: "TWO_OR_MORE",
      },
    } as unknown as Request;

    updateClaimStub.resolves({
      status: "success",
      body: null,
    });

    await submitNumberOfClientsStartOfCase(req, res, next);

    expect(
      updateClaimStub.calledWith(
        req.axiosMiddleware,
        sinon.match({
          id: claimId.toString(),
          clientsStartCount: "TWO_OR_MORE",
        }),
      ),
    ).to.be.true;

    expect(
      (res.redirect as sinon.SinonStub).calledWith(
        `/claims/${claimId.toString()}/poa/multiple-client-hearings`,
      ),
    ).to.equal(true);
  });

  it("rerenders with an error when no option is selected", async () => {
    const req = {
      body: {},
    } as unknown as Request;

    await submitNumberOfClientsStartOfCase(req, res, next);

    expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/radioQuestionPage.njk",
    );
  });
});