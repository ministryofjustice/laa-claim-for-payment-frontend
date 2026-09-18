import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import { V7Generator } from "uuidv7";
import { Category, Claim, CostType } from "#src/types/Claim.js";
import {
  addAnotherDisbursement,
  submitAddAnotherDisbursement,
} from "#src/controllers/poa/addAnotherDisbursementController.js";
import { LocalDate } from "#src/types/date.js";
import { PoaNavigator } from "#src/navigation/poaNavigator.js";

describe("addAnotherDisbursementController", () => {
  let res: Response;
  let next: NextFunction;
  let redirectStub: sinon.SinonStub;
  let redirectFromAddAnotherDisbursementStub: sinon.SinonStub;

  const claimId = new V7Generator().generate();
  const lineItemId = new V7Generator().generate();

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

    redirectFromAddAnotherDisbursementStub = sinon.stub(
      PoaNavigator.prototype,
      "redirectFromAddAnotherDisbursement",
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  it("renders the add another expert cost page", () => {
    const req = {
      claim: new Claim({
        id: claimId.toString(),
        costType: CostType.EXPERT_COST,
        lineItems: [
          {
            id: lineItemId.toString(),
            title: "Line item 1",
            category: Category.DISBURSEMENT,
            date: new LocalDate(18, 3, 2025),
            evidenceItems: [],
          },
        ],
      }),
    } as unknown as Request;

    addAnotherDisbursement(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/poa/addAnotherDisbursementView.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");
    expect(renderArgs.vm.title.key).to.equal(
      "pages.poa.expertCostDetails.addAnother.title.singular",
    );
    expect(renderArgs.vm.radioQuestionViewModel.radios.name).to.equal(
      "addAnother",
    );
  });

  it("renders the add another non-expert disbursement page", () => {
    const req = {
      claim: new Claim({
        id: claimId.toString(),
        costType: CostType.NON_EXPERT_DISBURSEMENT,
        lineItems: [
          {
            id: lineItemId.toString(),
            title: "Line item 1",
            category: Category.DISBURSEMENT,
            date: new LocalDate(18, 3, 2025),
            evidenceItems: [],
          },
        ],
      }),
    } as unknown as Request;

    addAnotherDisbursement(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/poa/addAnotherDisbursementView.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");
    expect(renderArgs.vm.title.key).to.equal(
      "pages.poa.nonExpertDisbursementDetails.addAnother.title.singular",
    );
    expect(renderArgs.vm.radioQuestionViewModel.radios.name).to.equal(
      "addAnother",
    );
  });

  it("errors when profit cost type", () => {
    const req = {
      claim: new Claim({
        id: claimId.toString(),
        costType: CostType.PROFIT_COST,
      }),
    } as unknown as Request;

    addAnotherDisbursement(req, res, next);

    expect((next as sinon.SinonStub).calledOnce).to.be.true;
    expect((next as sinon.SinonStub).firstCall.args[0]).to.be.instanceOf(Error);
  });

  it("errors when no cost type", () => {
    const req = {
      claim: new Claim({
        id: claimId.toString(),
      }),
    } as unknown as Request;

    addAnotherDisbursement(req, res, next);

    expect((next as sinon.SinonStub).calledOnce).to.be.true;
    expect((next as sinon.SinonStub).firstCall.args[0]).to.be.instanceOf(Error);
  });

  it("redirects to expert cost page when no line items", () => {
    const req = {
      claim: new Claim({
        id: claimId.toString(),
        costType: CostType.EXPERT_COST,
        lineItems: [],
      }),
      query: {},
    } as unknown as Request;

    addAnotherDisbursement(req, res, next);

    expect(
      (res.redirect as sinon.SinonStub).calledWith(
        `/claims/${claimId.toString()}/poa/disbursement-details`,
      ),
    ).to.equal(true);
  });

  it("redirects when valid submission", async () => {
    const redirect = "/next-page";
    const req = {
      claim: new Claim({
        id: claimId.toString(),
        costType: CostType.EXPERT_COST,
      }),
      body: {
        addAnother: "yes",
      },
      query: {},
    } as unknown as Request;

    redirectFromAddAnotherDisbursementStub.returns(redirect);

    submitAddAnotherDisbursement(req, res, next);

    expect(redirectFromAddAnotherDisbursementStub.calledOnceWith(true)).to.be
      .true;
    expect(redirectStub.calledWith(redirect)).to.be.true;
  });

  it("rerenders the radio question page with an error when no option is selected", () => {
    const req = {
      claim: new Claim({
        id: claimId.toString(),
        costType: CostType.EXPERT_COST,
      }),
      body: {},
    } as unknown as Request;

    submitAddAnotherDisbursement(req, res, next);

    expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/poa/addAnotherDisbursementView.njk",
    );
  });

  it("rerenders with selected invalid string preserved when invalid option is submitted", () => {
    const req = {
      claim: new Claim({
        id: claimId.toString(),
        costType: CostType.EXPERT_COST,
      }),
      body: {
        addAnother: "invalid",
      },
    } as unknown as Request;

    submitAddAnotherDisbursement(req, res, next);

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(
      renderArgs.vm.radioQuestionViewModel.radios.items.every(
        (choice: { checked: boolean }) => !choice.checked,
      ),
    ).to.equal(true);
  });
});
