import { expect } from "chai";
import { PoaEvidenceUploadViewModel } from "#src/viewmodels/poa/evidenceUploadViewModel.js";
import { V7Generator } from "uuidv7";
import { UploadForm } from "#src/helpers/fileUploadValidation.js";
import { UploadField } from "#src/helpers/fields.js";
import { EvidenceItem } from "#src/types/Claim.js";

describe("PoaEvidenceUploadViewModel constructor()", () => {
  const claimId = new V7Generator().generate();
  const evidenceId = new V7Generator().generate();

  it("builds the POA evidence upload view model", () => {
    const field = new UploadField("prefix", "name", "id");
    const form = new UploadForm(field);

    const vm = new PoaEvidenceUploadViewModel({
      claimId,
      form,
    });

    expect(vm.title).to.equal("prefix.title");
    expect(vm.uploadUrl).to.equal(
      `/claims/${claimId.toString()}/poa/evidence-upload/ajax-upload?claimStatus=DRAFT`,
    );
    expect(vm.deleteUrl).to.equal(
      `/claims/${claimId.toString()}/poa/evidence-upload/ajax-delete?claimStatus=DRAFT`,
    );
    expect(vm.saveAndContinueHref).to.equal(
      `/claims/${claimId.toString()}/poa/check-details`,
    );
    expect(vm.saveAndComeBackLaterHref).to.equal("#");
    expect(vm.uploadedFiles).to.deep.equal([]);
  });

  it("uses uploaded files when provided", () => {
    const uploadedFiles: EvidenceItem[] = [
      {
        id: evidenceId.toString(),
        fileKey: "evidence.pdf",
        fileSize: 1000,
        submittedOn: "2026-06-17T14:34:01.226855Z",
      },
    ];
    const field = new UploadField("prefix", "name", "id");
    const form = new UploadForm(field);
    form.fill(uploadedFiles);

    const vm = new PoaEvidenceUploadViewModel({
      claimId,
      form,
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