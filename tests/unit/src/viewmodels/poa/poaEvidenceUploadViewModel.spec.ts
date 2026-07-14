import { expect } from "chai";
import { PoaEvidenceUploadViewModel } from "#src/viewmodels/profitCostDetails/profitCostDetailsEvidenceUploadViewModel.js";
import { V7Generator } from "uuidv7";

describe("PoaEvidenceUploadViewModel constructor()", () => {

  const evidenceId = new V7Generator().generate();

  it("builds the POA evidence upload view model", () => {
    const vm = new PoaEvidenceUploadViewModel({
      uploadUrl: "/upload",
      deleteUrl: "/delete",
      saveAndContinueHref: "/continue",
      saveAndComeBackLaterHref: "#",
    });

    expect(vm.title).to.equal("pages.poaEvidenceUpload.title");
    expect(vm.uploadUrl).to.equal("/upload");
    expect(vm.deleteUrl).to.equal("/delete");
    expect(vm.saveAndContinueHref).to.equal("/continue");
    expect(vm.saveAndComeBackLaterHref).to.equal("#");
    expect(vm.uploadedFiles).to.deep.equal([]);
  });

  it("uses uploaded files when provided", () => {
    const vm = new PoaEvidenceUploadViewModel({
      uploadUrl: "/upload",
      deleteUrl: "/delete",
      saveAndContinueHref: "/continue",
      saveAndComeBackLaterHref: "#",
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