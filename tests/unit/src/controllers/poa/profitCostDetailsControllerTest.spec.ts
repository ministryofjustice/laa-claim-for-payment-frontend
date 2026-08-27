import { afterEach, beforeEach, describe, it } from "mocha";
import { expect } from "chai";
import * as sinon from "sinon";
import type { Request, Response } from "express";
import {
  profitCostDetails,
  submitProfitCostDetails,
} from "#src/controllers/poa/profitCostDetailsController.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { V7Generator } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import { Claim } from "#src/types/Claim.js";

describe("Profit cost details controller", () => {
  let req: Partial<Request>;
  let res: any;
  let next: any;
  let renderStub: sinon.SinonStub;
  let statusStub: sinon.SinonStub;
  let redirectStub: sinon.SinonStub;
  let updateClaimStub: sinon.SinonStub;

  const claimId = new V7Generator().generate();

  beforeEach(() => {
    req = {
      body: {},
      path: "/poa/profit-cost",
      params: { claimId: claimId.toString() },
    };

    renderStub = sinon.stub();
    statusStub = sinon.stub().returns({ render: renderStub });
    redirectStub = sinon.stub();

    res = {
      locals: {
        csrfToken: "csrf-token",
      },
      render: renderStub,
      status: statusStub,
      redirect: redirectStub,
    };

    next = sinon.stub();

    updateClaimStub = sinon.stub(claimService, "updateClaim");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should render the profit cost details page with the correct template", async () => {
    req = {
      claim: new Claim({
        id: claimId.toString(),
      }),
    };

    await profitCostDetails(req as Request, res as Response, next);

    expect(renderStub.calledOnce).to.be.true;
    expect(renderStub.calledWith("main/poa/profitCostDetailsView.njk")).to.be
      .true;
  });

  it("redirects to HOW_MANY_CLIENTS_RETAINED when transfer of solicitor is 'yes'", async () => {
    req = {
      claim: new Claim({
        id: claimId.toString(),
      }),
      body: {
        ["courtTypeChoice"]: "COUNTY_COURT",
        ["clientStatusChoice"]: "CHILD",
        ["firstSolicitorChoice"]: "yes",
        ["transferOfSolicitorChoice"]: "yes",
      },
    };

    updateClaimStub.resolves({
      status: "success",
      body: null,
    });

    await submitProfitCostDetails(req as Request, res as Response, next);

    expect(
      updateClaimStub.calledWith(
        req.axiosMiddleware,
        sinon.match({
          id: claimId.toString(),
          courtType: "COUNTY_COURT",
          clientPartyStatus: "CHILD",
          firstActingSolicitorFlag: true,
          transferOfSolicitorFlag: true,
        }),
      ),
    ).to.be.true;

    expect(redirectStub.calledOnce).to.be.true;

    const expectedRoute = buildRoute(ROUTES.POA.PROFIT_COST.HOW_MANY_CLIENTS_RETAINED, {
      claimId: claimId,
    });

    expect(redirectStub.calledWith(expectedRoute)).to.be.true;
  });

  it("redirects to NUMBER_OF_CLIENTS_START_OF_CASE when transfer of solicitor is 'no'", async () => {
    req = {
      claim: new Claim({
        id: claimId.toString(),
      }),
      body: {
        ["courtTypeChoice"]: "COUNTY_COURT",
        ["clientStatusChoice"]: "CHILD",
        ["firstSolicitorChoice"]: "yes",
        ["transferOfSolicitorChoice"]: "no",
      },
    };

    updateClaimStub.resolves({
      status: "success",
      body: null,
    });

    await submitProfitCostDetails(req as Request, res as Response, next);

    expect(
      updateClaimStub.calledWith(
        req.axiosMiddleware,
        sinon.match({
          id: claimId.toString(),
          courtType: "COUNTY_COURT",
          clientPartyStatus: "CHILD",
          firstActingSolicitorFlag: true,
          transferOfSolicitorFlag: false,
        }),
      ),
    ).to.be.true;

    expect(redirectStub.calledOnce).to.be.true;

    const expectedRoute = buildRoute(ROUTES.POA.PROFIT_COST.NUMBER_OF_CLIENTS_START_OF_CASE, {
      claimId: claimId,
    });

    expect(redirectStub.calledWith(expectedRoute)).to.be.true;
  });

  describe("Court type question", () => {
    it("should render the court type radios correctly", async () => {
      req = {
        claim: new Claim({
          id: claimId.toString(),
        }),
      };

      await profitCostDetails(req as Request, res as Response, next);

      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.vm.courtTypeRadios.name).to.equal(
        "courtTypeChoice",
      );
      expect(renderArgs.vm.courtTypeRadios.items).to.have.length(4);
    });

    it("should return error when no court type is selected", async () => {
      await submitProfitCostDetails(req as Request, res as Response, next);

      expect(statusStub.calledOnceWith(400)).to.be.true;

      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.vm.courtTypeRadios.errorMessage.text).to.deep.equal({
        key: "pages.profitCostDetails.courtType.errors.empty",
      });
    });

    it("should return error when an invalid court type is selected", async () => {
      req.body = {
        courtTypeChoice: "invalid",
      };

      await submitProfitCostDetails(req as Request, res as Response, next);

      expect(statusStub.calledOnceWith(400)).to.be.true;

      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.vm.courtTypeRadios.errorMessage.text).to.deep.equal({
        key: "pages.profitCostDetails.courtType.errors.empty",
      });
    });
  });

  describe("Client status question", () => {
    it("should render the client status radios correctly", async () => {
      req = {
        claim: new Claim({
          id: claimId.toString(),
        }),
      };

      await profitCostDetails(req as Request, res as Response, next);

      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.vm.clientStatusRadios.name).to.equal(
        "clientStatusChoice",
      );
      expect(renderArgs.vm.clientStatusRadios.items).to.have.length(3);
    });

    it("should return error when no client status is selected", async () => {
      await submitProfitCostDetails(req as Request, res as Response, next);

      expect(statusStub.calledOnceWith(400)).to.be.true;

      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.vm.clientStatusRadios.errorMessage.text).to.deep.equal({
        key: "pages.profitCostDetails.clientStatus.errors.empty",
      });
    });

    it("should return error when an invalid client status is selected", async () => {
      req.body = {
        clientStatusChoice: "invalid",
      };

      await submitProfitCostDetails(req as Request, res as Response, next);

      expect(statusStub.calledOnceWith(400)).to.be.true;

      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.vm.clientStatusRadios.errorMessage.text).to.deep.equal({
        key: "pages.profitCostDetails.clientStatus.errors.empty",
      });
    });
  });

  describe("First solicitor firm question", () => {
    it("should render the first solicitor firm radios correctly", async () => {
      req = {
        claim: new Claim({
          id: claimId.toString(),
        }),
      };

      await profitCostDetails(req as Request, res as Response, next);

      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.vm.firstSolicitorRadios.name).to.equal(
        "firstSolicitorChoice",
      );
      expect(renderArgs.vm.firstSolicitorRadios.items).to.have.length(2);
    });

    it("should return error when no first solicitor option is selected", async () => {
      await submitProfitCostDetails(req as Request, res as Response, next);

      expect(statusStub.calledOnceWith(400)).to.be.true;

      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.vm.firstSolicitorRadios.errorMessage.text).to.deep.equal({
        key: "pages.profitCostDetails.firstSolicitor.errors.empty",
      });
    });

    it("should return error when an invalid first solicitor option is selected", async () => {
      req.body = {
        firstSolicitorChoice: "invalid",
      };

      await submitProfitCostDetails(req as Request, res as Response, next);

      expect(statusStub.calledOnceWith(400)).to.be.true;

      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.vm.firstSolicitorRadios.errorMessage.text).to.deep.equal({
        key: "pages.profitCostDetails.firstSolicitor.errors.empty",
      });
    });
  });

  describe("Transfer of solicitor question", () => {
    it("should render the transfer of solicitor radios correctly", async () => {
      req = {
        claim: new Claim({
          id: claimId.toString(),
        }),
      };

      await profitCostDetails(req as Request, res as Response, next);

      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.vm.transferOfSolicitorRadios.name).to.equal(
        "transferOfSolicitorChoice",
      );
      expect(renderArgs.vm.transferOfSolicitorRadios.items).to.have.length(2);
    });

    it("should return error when no transfer of solicitor option is selected", async () => {
      await submitProfitCostDetails(req as Request, res as Response, next);

      expect(statusStub.calledOnceWith(400)).to.be.true;

      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.vm.transferOfSolicitorRadios.errorMessage.text).to.deep.equal({
        key: "pages.profitCostDetails.transferOfSolicitor.errors.empty",
      });
    });

    it("should return error when an invalid transfer of solicitor option is selected", async () => {
      req.body = {
        transferOfSolicitorChoice: "invalid",
      };

      await submitProfitCostDetails(req as Request, res as Response, next);

      expect(statusStub.calledOnceWith(400)).to.be.true;

      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.vm.transferOfSolicitorRadios.errorMessage.text).to.deep.equal({
        key: "pages.profitCostDetails.transferOfSolicitor.errors.empty",
      });
    });
  });
});
