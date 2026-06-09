import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import * as sinon from "sinon";
import type { Request, Response } from "express";
import {
  profitCostDetails,
  submitProfitCostDetails,
} from "#src/controllers/poa/profitCostDetailsController.js";

describe("Profit cost details controller", () => {
  let req: Partial<Request>;
  let res: any;
  let next: any;
  let renderStub: sinon.SinonStub;
  let statusStub: sinon.SinonStub;
  let redirectStub: sinon.SinonStub;

  beforeEach(() => {
    req = {
      body: {},
      path: "/poa/profit-cost",
      params: { claimId: "1" },
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
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should render the profit cost details page with the correct template", async () => {
    await profitCostDetails(req as Request, res as Response, next);

    expect(renderStub.calledOnce).to.be.true;
    expect(renderStub.calledWith("main/poa/profitCostDetailsView.njk")).to.be
      .true;
  });

  describe("Court type question", () => {
    it("should render the court type radios correctly", async () => {
      await profitCostDetails(req as Request, res as Response, next);

      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.vm.form.courtTypeFieldName).to.equal("courtTypeChoice");
      expect(renderArgs.vm.form.courtTypeChoices).to.have.length(4);
    });

    it("should return error when no court type is selected", async () => {
      await submitProfitCostDetails(req as Request, res as Response, next);

      expect(statusStub.calledOnceWith(400)).to.be.true;

      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.vm.form.courtTypeError.text).to.equal(
        "pages.profitCostDetails.courtType.error.empty",
      );
    });

    it("should return error when an invalid court type is selected", async () => {
      req.body = {
        courtTypeChoice: "invalid",
      };

      await submitProfitCostDetails(req as Request, res as Response, next);

      expect(statusStub.calledOnceWith(400)).to.be.true;

      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.vm.form.courtTypeError.text).to.equal(
        "pages.profitCostDetails.courtType.error.empty",
      );
    });
  });

  describe("Client status question", () => {
    it("should render the client status radios correctly", async () => {
      await profitCostDetails(req as Request, res as Response, next);

      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.vm.form.clientStatusFieldName).to.equal(
        "clientStatusChoice",
      );
      expect(renderArgs.vm.form.clientStatusChoices).to.have.length(3);
    });

    it("should return error when no client status is selected", async () => {
      await submitProfitCostDetails(req as Request, res as Response, next);

      expect(statusStub.calledOnceWith(400)).to.be.true;

      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.vm.form.clientStatusError.text).to.equal(
        "pages.profitCostDetails.clientStatus.error.empty",
      );
    });

    it("should return error when an invalid client status is selected", async () => {
      req.body = {
        clientStatusChoice: "invalid",
      };

      await submitProfitCostDetails(req as Request, res as Response, next);

      expect(statusStub.calledOnceWith(400)).to.be.true;

      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.vm.form.clientStatusError.text).to.equal(
        "pages.profitCostDetails.clientStatus.error.empty",
      );
    });
  });

  describe("First solicitor firm question", () => {
    it("should render the first solicitor firm radios correctly", async () => {
      await profitCostDetails(req as Request, res as Response, next);

      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.vm.form.firstSolicitorFieldName).to.equal(
        "firstSolicitorChoice",
      );
      expect(renderArgs.vm.form.firstSolicitorChoices).to.have.length(2);
    });

    it("should return error when no first solicitor option is selected", async () => {
      await submitProfitCostDetails(req as Request, res as Response, next);

      expect(statusStub.calledOnceWith(400)).to.be.true;

      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.vm.form.firstSolicitorError.text).to.equal(
        "pages.profitCostDetails.firstSolicitor.error.empty",
      );
    });

    it("should return error when an invalid first solicitor option is selected", async () => {
      req.body = {
        firstSolicitorChoice: "invalid",
      };

      await submitProfitCostDetails(req as Request, res as Response, next);

      expect(statusStub.calledOnceWith(400)).to.be.true;

      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.vm.form.firstSolicitorError.text).to.equal(
        "pages.profitCostDetails.firstSolicitor.error.empty",
      );
    });
  });

  describe("Transfer of solicitor question", () => {
    it("should render the transfer of solicitor radios correctly", async () => {
      await profitCostDetails(req as Request, res as Response, next);

      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.vm.form.transferSolicitorFieldName).to.equal(
        "transferSolicitorChoice",
      );
      expect(renderArgs.vm.form.transferSolicitorChoices).to.have.length(2);
    });

    it("should return error when no transfer solicitor option is selected", async () => {
      await submitProfitCostDetails(req as Request, res as Response, next);

      expect(statusStub.calledOnceWith(400)).to.be.true;

      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.vm.form.transferSolicitorError.text).to.equal(
        "pages.profitCostDetails.transferSolicitor.error.empty",
      );
    });

    it("should return error when an invalid transfer solicitor option is selected", async () => {
      req.body = {
        transferSolicitorChoice: "invalid",
      };

      await submitProfitCostDetails(req as Request, res as Response, next);

      expect(statusStub.calledOnceWith(400)).to.be.true;

      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.vm.form.transferSolicitorError.text).to.equal(
        "pages.profitCostDetails.transferSolicitor.error.empty",
      );
    });
  });
});
