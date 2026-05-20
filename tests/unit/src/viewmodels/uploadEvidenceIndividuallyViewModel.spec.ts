import { expect } from "chai";
import { UploadEvidenceIndividuallyViewModel } from "#src/viewmodels/uploadEvidenceIndividuallyViewModel.js";
import { claim5 } from "#tests/assets/claim.js";

describe("ClaimViewModel constructor()", () => {
  it("builds the bill narrative rows", () => {
    const vm = new UploadEvidenceIndividuallyViewModel(claim5);

    expect(vm.billNarrativeTasks[0].link.text).to.equal("Bill narrative");
    expect(vm.billNarrativeTasks[0].link.href).to.equal("/claims/5/upload-evidence-individually/1/file-upload");
    expect(vm.billNarrativeTasks[0].tag).to.deep.equal({
      text: {
        key: "common.uploadStatus.uploaded",
      },
      classes: "govuk-tag--green",
    });
  });

  it("builds the work items rows", () => {
    const vm = new UploadEvidenceIndividuallyViewModel(claim5);

    expect(vm.workItemsTasks[0].link.text).to.deep.equal({
      key: "common.onDate",
      args: {
        title: "Interim hearing",
        date: "20 December 2023",
      },
    });
    expect(vm.workItemsTasks[0].link.href).to.equal("/claims/5/upload-evidence-individually/2/file-upload");
    expect(vm.workItemsTasks[0].tag).to.deep.equal({
      text: {
        key: "common.uploadStatus.notUploaded",
      },
      classes: "govuk-tag--blue",
    });
  });

  it("builds the disbursements rows", () => {
    const vm = new UploadEvidenceIndividuallyViewModel(claim5);

    expect(vm.disbursementsTasks[0].link.text).to.deep.equal({
      key: "common.onDate",
      args: {
        title: "Enquiry agent",
        date: "13 January 2023",
      },
    });
    expect(vm.disbursementsTasks[0].link.href).to.equal("/claims/5/upload-evidence-individually/3/file-upload");
    expect(vm.disbursementsTasks[0].tag).to.deep.equal({
      text: {
        key: "common.uploadStatus.notUploaded",
      },
      classes: "govuk-tag--blue",
    });
  });
});
