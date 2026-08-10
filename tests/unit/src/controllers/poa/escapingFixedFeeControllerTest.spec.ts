import { expect } from "chai";
import { describe, it, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import {
  escapingFixedFee,
  submitEscapingFixedFee,
} from "#src/controllers/poa/escapingFixedFeeController.js";
import { V7Generator } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import { Claim, ClaimStatus } from "#src/types/Claim.js";
import { uploadService } from "#src/services/uploadService.js";

describe("escapingFixedFeeController", () => {
  let res: Response;
  let next: NextFunction;
  let getClaimStub: sinon.SinonStub;
  let updateClaimStub: sinon.SinonStub;
  let deleteAllEvidenceStub: sinon.SinonStub;

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

    getClaimStub = sinon.stub(claimService, "getDraftClaim");
    updateClaimStub = sinon.stub(claimService, "updateClaim");
    deleteAllEvidenceStub = sinon.stub(
      uploadService,
      "deleteAllEvidenceFromClaim",
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  it("renders the escaping the fixed fee radio question page", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
    } as unknown as Request;

    getClaimStub.resolves({
      status: "success",
      body: new Claim({
        id: claimId.toString(),
      }),
    });

    await escapingFixedFee(req, res, next);

    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/poa/escapingFixedFeeView.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.csrfToken).to.equal("test-csrf-token");
    expect(renderArgs.vm.title.key).to.equal("pages.escapingFixedFee.question");
    expect(renderArgs.vm.form.fieldName).to.equal("escapingFixedFee");
  });

  it("redirects to CPGFS profit cost bill line page when escaping fixed fee answer is given", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
      body: {
        escapingFixedFee: "yes",
      },
    } as unknown as Request;

    getClaimStub.resolves({
      status: "success",
      body: new Claim({
        id: claimId.toString(),
      }),
    });

    updateClaimStub.resolves({
      status: "success",
      body: null,
    });

    await submitEscapingFixedFee(req, res, next);

    expect(
      updateClaimStub.calledWith(
        req.axiosMiddleware,
        sinon.match({
          id: claimId.toString(),
          escapedFlag: true,
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
      params: {
        claimId: claimId.toString(),
      },
      body: {},
    } as unknown as Request;

    await submitEscapingFixedFee(req, res, next);

    expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
    expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
    expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
      "main/poa/escapingFixedFeeView.njk",
    );

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.vm.form.error).to.deep.equal({
      fieldName: "escapingFixedFee",
      href: "#escapingFixedFee",
      text: {
        key: "pages.escapingFixedFee.errors.empty",
      },
    });
  });

  it("rerenders with selected invalid string preserved when invalid option is submitted", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
      body: {
        escapingFixedFee: "invalid",
      },
    } as unknown as Request;

    await submitEscapingFixedFee(req, res, next);

    const renderArgs = (res.render as sinon.SinonStub).firstCall.args[1];

    expect(renderArgs.vm.form.error).to.deep.equal({
      fieldName: "escapingFixedFee",
      href: "#escapingFixedFee",
      text: {
        key: "pages.escapingFixedFee.errors.empty",
      },
    });

    expect(
      renderArgs.vm.form.choices.every(
        (choice: { checked: boolean }) => !choice.checked,
      ),
    ).to.equal(true);
  });

  it("cleans up evidence if there is evidence on the claim and user answers no to escaping fixed fee", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
      body: {
        escapingFixedFee: "no",
      },
    } as unknown as Request;

    getClaimStub.resolves({
      status: "success",
      body: new Claim({
        id: claimId.toString(),
        evidence: [
          {
            id: "123-123567",
            fileKey: "fileKey",
            fileSize: 5,
            submittedOn: "",
          },
        ],
      }),
    });

    await submitEscapingFixedFee(req, res, next);

    sinon.assert.calledOnce(deleteAllEvidenceStub);

    expect(deleteAllEvidenceStub.firstCall.args[1].toString()).to.equal(
      claimId.toString(),
    );

    expect(deleteAllEvidenceStub.firstCall.args[2]).to.equal(ClaimStatus.DRAFT);
  });


  it("does not delete evidence if there is evidence on the claim and user answers yes to escaping fixed fee", async () => {
    const req = {
      params: {
        claimId: claimId.toString(),
      },
      body: {
        escapingFixedFee: "yes",
      },
    } as unknown as Request;

    getClaimStub.resolves({
      status: "success",
      body: new Claim({
        id: claimId.toString(),
        evidence: [
          {
            id: "123-123567",
            fileKey: "fileKey",
            fileSize: 5,
            submittedOn: "",
          },
        ],
      }),
    });

    await submitEscapingFixedFee(req, res, next);

    sinon.assert.notCalled(deleteAllEvidenceStub);
  });
});
