import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import {
  escapingFixedFee,
  submitEscapingFixedFee,
} from "#src/controllers/poa/escapingFixedFeeController.js";
import { V7Generator } from "uuidv7";
import { Claim } from "#src/types/Claim.js";
import { draftService } from "#src/services/draftService.js";

describe("escapingFixedFeeController", () => {
  let res: Response;
  let next: NextFunction;
  let setEscapedFlagStub: sinon.SinonStub;

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

    setEscapedFlagStub = sinon.stub(draftService, "setEscapedFlag");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("renders the escaping the fixed fee radio question page", async () => {
    const req = {
      claim: new Claim({
        id: claimId.toString(),
      }),
    } as unknown as Request;

    await escapingFixedFee(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/poa/escapingFixedFeeView.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");
    expect(renderArgs.vm.title.key).to.equal("pages.escapingFixedFee.question");
    expect(renderArgs.vm.radios.name).to.equal("escapingFixedFee");
  });

  it("redirects to CPGFS profit cost bill line page when escaping fixed fee answer is given", async () => {
    const req = {
      claim: new Claim({
        id: claimId.toString(),
      }),
      body: {
        escapingFixedFee: "yes",
      },
    } as unknown as Request;

    setEscapedFlagStub.resolves({
      status: "success",
      body: null,
    });

    await submitEscapingFixedFee(req, res, next);

    expect(
      setEscapedFlagStub.calledWith(
        req.axiosMiddleware,
        sinon.match({
          id: claimId.toString(),
        }),
      ),
    ).to.be.true;

    expect(
      (res.redirect as sinon.SinonStub).calledWith(
        `/claims/${claimId.toString()}/poa/cpgfs-profit-cost-bill-line`,
      ),
    ).to.equal(true);
  });

  it("rerenders the radio question page with an error when no option is selected", async () => {
    const req = {
      claim: new Claim({
        id: claimId.toString(),
      }),
      body: {},
    } as unknown as Request;

    await submitEscapingFixedFee(req, res, next);

    expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/poa/escapingFixedFeeView.njk",
    );
  });

  it("rerenders with selected invalid string preserved when invalid option is submitted", async () => {
    const req = {
      claim: new Claim({
        id: claimId.toString(),
      }),
      body: {
        escapingFixedFee: "invalid",
      },
    } as unknown as Request;

    await submitEscapingFixedFee(req, res, next);

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(
      renderArgs.vm.radios.items.every(
        (choice: { checked: boolean }) => !choice.checked,
      ),
    ).to.equal(true);
  });
});
