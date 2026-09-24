import { expect } from "chai";
import { beforeEach, describe, it } from "mocha";
import sinon from "sinon";
import type { Request } from "express";
import {
  poaEvidenceUploadPage,
  submitPoaEvidenceUpload,
} from "#src/controllers/poa/poaEvidenceUploadController.js";
import { V7Generator } from "uuidv7";
import { Category, Claim } from "#src/types/Claim.js";
import { LocalDate } from "#src/types/date.js";
import { PoaNavigator } from "#src/navigation/poaNavigator.js";

describe("poaEvidenceUploadController", () => {
  let res: any;
  let next: any;

  let renderStub: sinon.SinonStub;
  let redirectStub: sinon.SinonStub;
  let redirectFromEvidenceUploadStub: sinon.SinonStub;

  const claimId = new V7Generator().generate();
  const lineItemId = new V7Generator().generate();
  const evidenceId = new V7Generator().generate();

  beforeEach(() => {
    renderStub = sinon.stub();
    redirectStub = sinon.stub();

    res = {
      render: renderStub,
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
      redirect: redirectStub,
      locals: {
        csrfToken: "test-csrf-token",
      },
    };

    next = sinon.stub();

    redirectFromEvidenceUploadStub = sinon.stub(
      PoaNavigator.prototype,
      "redirectFromEvidenceUpload",
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("poaEvidenceUploadPage", () => {
    let req: Partial<Request>;

    beforeEach(() => {
      req = {
        axiosMiddleware: {} as any,
        claim: new Claim({
          id: claimId.toString(),
          evidence: [],
        }),
      };
    });

    it("renders the POA evidence upload page", () => {
      poaEvidenceUploadPage(req as Request, res, next);

      expect(renderStub.calledOnce).to.equal(true);
      expect(renderStub.firstCall.args[0]).to.equal(
        "main/poa/poaEvidenceUploadView.njk",
      );

      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.csrfToken).to.equal("test-csrf-token");
      expect(renderArgs.vm.title).to.equal("pages.poaEvidenceUpload.title");
      expect(renderArgs.vm.uploadUrl).to.equal(
        `/claims/${claimId.toString()}/poa/evidence-upload/ajax-upload?claimStatus=DRAFT`,
      );
      expect(renderArgs.vm.deleteUrl).to.equal(
        `/claims/${claimId.toString()}/poa/evidence-upload/ajax-delete?claimStatus=DRAFT`,
      );
      expect(renderArgs.vm.saveAndContinueHref).to.equal(
        `/claims/${claimId.toString()}/poa/check-details`,
      );
      expect(renderArgs.vm.saveAndComeBackLaterHref).to.equal("#");
    });
  });

  describe("uploadEvidenceFile", () => {
    let req: Partial<Request>;

    it("redirects when valid submission", async () => {
      const redirect = "/next-page";
      req = {
        axiosMiddleware: {} as any,
        claim: new Claim({
          id: claimId.toString(),
          evidence: [
            {
              id: evidenceId.toString(),
              fileKey: "sample.pdf",
              fileSize: 1024,
              submittedOn: "2026-06-17T10:20:05Z",
            },
          ],
        }),
        query: {},
      };

      redirectFromEvidenceUploadStub.returns(redirect);

      submitPoaEvidenceUpload(req as Request, res, next);

      expect(redirectFromEvidenceUploadStub.calledOnce).to.be.true;
      expect(redirectStub.calledWith(redirect)).to.be.true;
    });

    it("renders with an error when no evidence has been uploaded", () => {
      req = {
        axiosMiddleware: {} as any,
        claim: new Claim({
          id: claimId.toString(),
          lineItems: [
            {
              id: lineItemId.toString(),
              title: "Line item = threshold",
              category: Category.DISBURSEMENT,
              date: new LocalDate(29, 7, 2026),
              actualNetValue: 20,
              vatApplicable: false,
              feeEarnerName: "John Smith",
              evidenceItems: [],
            },
          ],
          evidence: [],
        }),
      };

      (res.status as unknown) = sinon.stub().returns(res);

      submitPoaEvidenceUpload(req as Request, res, next);

      expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
      expect(renderStub.calledOnce).to.equal(true);

      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.vm.errorSummary.errorList).to.have.length(1);
      expect(renderArgs.vm.errorSummary.errorList[0].text.key).to.equal(
        "pages.poaEvidenceUpload.errors.empty",
      );
    });
  });
});
