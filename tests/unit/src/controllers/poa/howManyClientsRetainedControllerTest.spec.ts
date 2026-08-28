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
import { Claim } from "#src/types/Claim.js";

describe("howManyClientsRetainedController", () => {
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

  it("redirects to number of clients at start of case when answer is 0", async () => {
    const req = {
      claim: new Claim({
        id: claimId.toString(),
      }),
      body: {
        howManyClientsRetained: "ZERO",
      },
    } as unknown as Request;

    updateClaimStub.resolves({
      status: "success",
      body: null,
    });

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

    expect(
      (res.redirect as sinon.SinonStub).calledWith(
        `/claims/${claimId.toString()}/poa/number-of-clients-start-of-case`,
      ),
    ).to.be.true;
  });

  it("redirects to multiple client hearings when answer is not 0", async () => {
    const selections: string[] = ["ONE", "TWO_OR_MORE"];

    for (const selection of selections) {
      const req = {
        claim: new Claim({
          id: claimId.toString(),
        }),
        body: {
          howManyClientsRetained: selection,
        },
      } as unknown as Request;

      updateClaimStub.resolves({
        status: "success",
        body: null,
      });

      await submitHowManyClientsRetained(req, res, next);

      expect(
        updateClaimStub.calledWith(
          req.axiosMiddleware,
          sinon.match({
            id: claimId.toString(),
            clientsRetainedCount: selection,
          }),
        ),
      ).to.be.true;

      expect(
        (res.redirect as sinon.SinonStub).calledWith(
          `/claims/${claimId.toString()}/poa/multiple-client-hearings`,
        ),
      ).to.be.true;
    }
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