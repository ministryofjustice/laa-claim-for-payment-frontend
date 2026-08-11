import { AxiosInstanceWrapper } from "middleware-axios";
import sinon from "sinon";
import { Claim, ClaimStatus, CostType } from "#src/types/Claim.js";
import { V7Generator } from "uuidv7";
import { beforeEach } from "mocha";
import { claimService } from "#src/services/claimService.js";
import { uploadService } from "#src/services/uploadService.js";
import { expect } from "chai";
import { draftService } from "#src/services/draftService.js";

describe("draftService", () => {
  const axiosMiddleware = {} as AxiosInstanceWrapper;

  let updateClaimStub: sinon.SinonStub;
  let deleteAllEvidenceStub: sinon.SinonStub;

  const claimId = new V7Generator().generate();
  const evidenceId = new V7Generator().generate();

  beforeEach(() => {
    deleteAllEvidenceStub = sinon.stub(
      uploadService,
      "deleteAllEvidenceFromClaim",
    );
    updateClaimStub = sinon.stub(claimService, "updateClaim");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("setEscapedFlag", () => {
    it("deletes evidence when claim has evidence and setting flag to false", async () => {
      const claim = new Claim({
        id: claimId.toString(),
        escaped: true,
        evidence: [
          {
            id: evidenceId.toString(),
            fileKey: "test.pdf",
            fileSize: 123456,
            submittedOn: "2026-06-17T14:34:01.226855Z",
          },
        ],
      });

      deleteAllEvidenceStub.resolves({
        status: "success",
        body: null,
      });

      updateClaimStub.resolves({
        status: "success",
        body: null,
      });

      await draftService.setEscapedFlag(axiosMiddleware, claim, false);

      expect(deleteAllEvidenceStub.firstCall.args[1]).to.deep.equal(claimId);
      expect(deleteAllEvidenceStub.firstCall.args[2]).to.equal(
        ClaimStatus.DRAFT,
      );

      expect((updateClaimStub.firstCall.args[1] as Claim).escapedFlag).to.equal(
        false,
      );
    });

    it("doesn't delete evidence when claim has no evidence and setting flag to false", async () => {
      const claim = new Claim({
        id: claimId.toString(),
        escaped: true,
      });

      updateClaimStub.resolves({
        status: "success",
        body: null,
      });

      await draftService.setEscapedFlag(axiosMiddleware, claim, false);

      sinon.assert.notCalled(deleteAllEvidenceStub);

      expect((updateClaimStub.firstCall.args[1] as Claim).escapedFlag).to.equal(
        false,
      );
    });

    it("doesn't delete evidence when setting flag to true", async () => {
      const claim = new Claim({
        id: claimId.toString(),
        escaped: false,
      });

      updateClaimStub.resolves({
        status: "success",
        body: null,
      });

      await draftService.setEscapedFlag(axiosMiddleware, claim, true);

      sinon.assert.notCalled(deleteAllEvidenceStub);

      expect((updateClaimStub.firstCall.args[1] as Claim).escapedFlag).to.equal(
        true,
      );
    });
  });

  describe("setCostType", () => {
    const costTypes = Object.values(CostType);

    describe("deletes evidence when claim has evidence and changing answer", () => {
      costTypes.forEach((newAnswer: CostType) => {
        costTypes
          .filter((costType: CostType) => costType !== newAnswer)
          .forEach((oldAnswer: CostType) => {
            it(`from ${newAnswer} to ${oldAnswer}`, async () => {
              const claim = new Claim({
                id: claimId.toString(),
                costType: oldAnswer,
                evidence: [
                  {
                    id: evidenceId.toString(),
                    fileKey: "test.pdf",
                    fileSize: 123456,
                    submittedOn: "2026-06-17T14:34:01.226855Z",
                  },
                ],
              });

              deleteAllEvidenceStub.resolves({
                status: "success",
                body: null,
              });

              updateClaimStub.resolves({
                status: "success",
                body: null,
              });

              await draftService.setCostType(axiosMiddleware, claim, newAnswer);

              expect(deleteAllEvidenceStub.firstCall.args[1]).to.deep.equal(
                claimId,
              );
              expect(deleteAllEvidenceStub.firstCall.args[2]).to.equal(
                ClaimStatus.DRAFT,
              );

              expect(
                (updateClaimStub.firstCall.args[1] as Claim).costType,
              ).to.equal(newAnswer);
            });
          });
      });
    });

    describe("doesn't delete evidence when claim has no evidence and changing answer", () => {
      costTypes.forEach((newAnswer: CostType) => {
        costTypes
          .filter((costType: CostType) => costType !== newAnswer)
          .forEach((oldAnswer: CostType) => {
            it(`from ${newAnswer} to ${oldAnswer}`, async () => {
              const claim = new Claim({
                id: claimId.toString(),
                costType: oldAnswer,
              });

              updateClaimStub.resolves({
                status: "success",
                body: null,
              });

              await draftService.setCostType(axiosMiddleware, claim, newAnswer);

              sinon.assert.notCalled(deleteAllEvidenceStub);

              expect(
                (updateClaimStub.firstCall.args[1] as Claim).costType,
              ).to.equal(newAnswer);
            });
          });
      });
    });

    describe("doesn't delete evidence when answer doesn't change", () => {
      costTypes.forEach((answer: CostType) => {
        it(`and answer is ${answer}`, async () => {
          const claim = new Claim({
            id: claimId.toString(),
            costType: answer,
          });

          updateClaimStub.resolves({
            status: "success",
            body: null,
          });

          await draftService.setCostType(axiosMiddleware, claim, answer);

          sinon.assert.notCalled(deleteAllEvidenceStub);

          expect(
            (updateClaimStub.firstCall.args[1] as Claim).costType,
          ).to.equal(answer);
        });
      });
    });
  });
});
