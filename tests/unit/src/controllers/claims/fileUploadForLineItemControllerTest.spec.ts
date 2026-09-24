import { afterEach, beforeEach, describe, it } from "mocha";
import { expect } from "chai";
import * as sinon from "sinon";
import type { Request, Response } from "express";
import { claimService } from "#src/services/claimService.js";
import {
  getClaimSuccessResponseData,
  linkLineItemToEvidenceResponseData,
} from "#tests/assets/getClaimsResponseData.js";
import {
  fileUploadForLineItemPage,
  linkEvidenceToLineItem,
} from "#src/controllers/claims/fileUploadForLineItemController.js";
import { ApiResponse } from "#src/types/api-types.js";
import { ClaimDto } from "#src/types/Claim.js";
import { HttpError } from "http-errors";
import { uploadService } from "#src/services/uploadService.js";
import { UUID, V7Generator } from "uuidv7";

describe("View File Upload For Line Item Controller", () => {
  let res: any;
  let next: any;

  let renderStub: sinon.SinonStub;
  let getClaimStub: sinon.SinonStub;
  let linkEvidenceStub: sinon.SinonStub;

  const claimId = UUID.parse("019f5fa1-dd58-7456-bf6f-73dd0b58eeb5");
  const lineItemId = UUID.parse("019f5fa4-0e78-712a-a6fd-51dd39005339");
  const evidenceId = new V7Generator().generate();

  beforeEach(() => {
    renderStub = sinon.stub();

    res = {
      render: renderStub,
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
      redirect: sinon.spy(),
      locals: {
        csrfToken: "test-csrf-token",
      },
    };

    next = sinon.stub();

    getClaimStub = sinon.stub(claimService, "getClaim");
    linkEvidenceStub = sinon.stub(uploadService, "linkEvidenceToLineItem");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("fileUploadForLineItemPage", () => {
    let req: Partial<Request>;

    beforeEach(() => {
      req = {
        params: {
          claimId: claimId.toString(),
          lineItemId: lineItemId.toString(),
        },
        path: `/claims/${claimId.toString()}/upload-evidence-individually/${lineItemId.toString()}/file-upload`,
      };
    });

    it("should render view of the file upload for line item page with data and correct template", async () => {
      getClaimStub.resolves(getClaimSuccessResponseData);

      await fileUploadForLineItemPage(req as Request, res as Response, next);

      expect(getClaimStub.calledOnce).to.be.true;
      expect(getClaimStub.calledWith(req.axiosMiddleware)).to.be.true;
      expect(renderStub.calledOnce).to.be.true;
      expect(renderStub.firstCall.args[0]).to.equal(
        "main/claims/fileUploadForLineItemView.njk",
      );
      const renderArgs = renderStub.firstCall.args[1];

      expect(renderArgs.csrfToken).to.equal("test-csrf-token");
      expect(renderArgs.vm.uploadUrl).to.equal(
        `/claims/${claimId.toString()}/upload-evidence-individually/${lineItemId.toString()}/file-upload/ajax-upload?claimStatus=SUBMITTED`,
      );
      expect(renderArgs.vm.deleteUrl).to.equal(
        `/claims/${claimId.toString()}/upload-evidence-individually/${lineItemId.toString()}/file-upload/ajax-delete?claimStatus=SUBMITTED`,
      );
      expect(renderArgs.vm.saveAndContinueHref).to.equal(
        `/claims/${claimId.toString()}/upload-evidence-individually`,
      );
    });

    it("should redirect to appropriate page when no claim is returned", async () => {
      const mockApiResponse: ApiResponse<ClaimDto> = {
        status: "error",
        statusCode: 404,
        message: "not found",
      };

      getClaimStub.resolves(mockApiResponse);

      await fileUploadForLineItemPage(req as Request, res as Response, next);

      expect(getClaimStub.calledOnce).to.be.true;
      expect(getClaimStub.calledWith(req.axiosMiddleware)).to.be.true;
      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.instanceOf(HttpError);
      expect(next.firstCall.args[0].message).to.include("not found");
    });

    it("should delegate API errors to Express error handling middleware with user-friendly message", async () => {
      const error = new Error("API Error");
      getClaimStub.rejects(error);

      await fileUploadForLineItemPage(req as Request, res as Response, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.include("API Error");
    });

    it("should return NOT_FOUND status if no line item exists for the claim", async () => {
      const nonExistentLineItemId = new V7Generator().generate();
      req = {
        path: `/claims/${claimId.toString()}/upload-evidence-individually/${nonExistentLineItemId.toString()}/file-upload`,
        params: {
          claimId: claimId.toString(),
          lineItemId: nonExistentLineItemId.toString(),
        },
      };

      getClaimStub.resolves(getClaimSuccessResponseData);

      await fileUploadForLineItemPage(req as Request, res as Response, next);

      expect(getClaimStub.calledOnce).to.be.true;
      expect(getClaimStub.calledWith(req.axiosMiddleware)).to.be.true;
      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.instanceOf(HttpError);
      expect(next.firstCall.args[0].message).to.include(
        `Line item ${nonExistentLineItemId.toString()} not found`,
      );
    });
  });

  describe("linkEvidenceToLineItem", () => {
    let req: Partial<Request>;

    beforeEach(() => {
      req = {
        params: {
          claimId: claimId.toString(),
          lineItemId: lineItemId.toString(),
        },
      };
    });

    it("should link evidence to line item and redirect when selection made", async () => {
      req.body = {
        documents: [evidenceId.toString()],
      };

      linkEvidenceStub.resolves(linkLineItemToEvidenceResponseData);

      await linkEvidenceToLineItem(req as Request, res as Response, next);

      expect(linkEvidenceStub.calledOnce).to.be.true;
      expect(linkEvidenceStub.calledWith(req.axiosMiddleware)).to.be.true;
      expect(renderStub.calledOnce).to.be.false;
      expect(
        res.redirect.calledWith(
          `/claims/${claimId.toString()}/upload-evidence-individually`,
        ),
      ).to.be.true;
    });

    it("should redirect when no selection made", async () => {
      req.body = {
        documents: [],
      };

      await linkEvidenceToLineItem(req as Request, res as Response, next);

      expect(linkEvidenceStub.calledOnce).to.be.false;
      expect(renderStub.calledOnce).to.be.false;
      expect(
        res.redirect.calledWith(
          `/claims/${claimId.toString()}/upload-evidence-individually`,
        ),
      ).to.be.true;
    });

    it("should ignore empty document IDs", async () => {
      req.body = {
        documents: [""],
      };

      await linkEvidenceToLineItem(req as Request, res as Response, next);

      expect(linkEvidenceStub.calledOnce).to.be.false;
      expect(renderStub.calledOnce).to.be.false;
      expect(
        res.redirect.calledWith(
          `/claims/${claimId.toString()}/upload-evidence-individually`,
        ),
      ).to.be.true;
    });

    it("should redirect to appropriate page when no claim is returned", async () => {
      req.body = {
        documents: [evidenceId.toString()],
      };

      const mockApiResponse: ApiResponse<null> = {
        status: "error",
        statusCode: 404,
        message: "not found",
      };

      linkEvidenceStub.resolves(mockApiResponse);

      await linkEvidenceToLineItem(req as Request, res as Response, next);

      expect(linkEvidenceStub.calledOnce).to.be.true;
      expect(linkEvidenceStub.calledWith(req.axiosMiddleware)).to.be.true;
      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.instanceOf(HttpError);
      expect(next.firstCall.args[0].message).to.include("not found");
    });

    it("should delegate API errors to Express error handling middleware with user-friendly message", async () => {
      req.body = {
        documents: [evidenceId.toString()],
      };

      const error = new Error("API Error");
      linkEvidenceStub.rejects(error);

      await linkEvidenceToLineItem(req as Request, res as Response, next);

      expect(linkEvidenceStub.calledOnce).to.be.true;
      expect(linkEvidenceStub.calledWith(req.axiosMiddleware)).to.be.true;
      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.include("API Error");
    });
  });
});
