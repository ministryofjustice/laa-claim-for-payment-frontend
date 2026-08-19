import { expect } from "chai";
import { PoaEvidenceUploadViewModel } from "#src/viewmodels/profitCostDetails/profitCostDetailsEvidenceUploadViewModel.js";
import { V7Generator } from "uuidv7";
import { Form } from "#src/helpers/validation.js";

describe("PoaEvidenceUploadViewModel constructor()", () => {
  const claimId = new V7Generator().generate();
  const evidenceId = new V7Generator().generate();

  it("builds the POA evidence upload view model", () => {
    const form = new Form({});

    const vm = new PoaEvidenceUploadViewModel({
      claimId,
      form,
    });

    expect(vm.title).to.equal("pages.poaEvidenceUpload.title");
    expect(vm.uploadUrl).to.equal(`/claims/${claimId.toString()}/poa/evidence-upload/ajax-upload?claimStatus=DRAFT`);
    expect(vm.deleteUrl).to.equal(`/claims/${claimId.toString()}/poa/evidence-upload/ajax-delete?claimStatus=DRAFT`);
    expect(vm.saveAndContinueHref).to.equal(`/claims/${claimId.toString()}/poa/check-details`);
    expect(vm.saveAndComeBackLaterHref).to.equal("#");
    expect(vm.uploadedFiles).to.deep.equal([]);
  });

  it("uses uploaded files when provided", () => {
    const form = new Form({});

    const vm = new PoaEvidenceUploadViewModel({
      claimId,
      form,
      uploadedFiles: [
        {
          id: evidenceId.toString(),
          name: "evidence.pdf",
          size: "1KB",
        },
      ],
    });

    expect(vm.uploadedFiles).to.deep.equal([
      {
        id: evidenceId.toString(),
        name: "evidence.pdf",
        size: "1KB",
      },
    ]);
  });
});