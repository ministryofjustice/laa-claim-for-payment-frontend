import { expect } from "chai";
import { PoaEvidenceUploadViewModel } from "#src/viewmodels/profitCostDetails/profitCostDetailsEvidenceUploadViewModel.js";

describe("PoaEvidenceUploadViewModel constructor()", () => {
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
          id: 1,
          name: "evidence.pdf",
          size: "1KB",
        },
      ],
    });

    expect(vm.uploadedFiles).to.deep.equal([
      {
        id: 1,
        name: "evidence.pdf",
        size: "1KB",
      },
    ]);
  });
});