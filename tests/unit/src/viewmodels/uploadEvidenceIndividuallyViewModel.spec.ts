import { expect } from "chai";
import { UploadEvidenceIndividuallyViewModel } from "#src/viewmodels/uploadEvidenceIndividuallyViewModel.js";
import { claim5 } from "#tests/assets/claim.js";

describe("ClaimViewModel constructor()", () => {
  it("builds the bill narrative rows", () => {
    const vm = new UploadEvidenceIndividuallyViewModel(claim5);

    expect(vm.billNarrativeTaskList.idPrefix).to.equal("bill-narrative");
    expect(vm.billNarrativeTaskList.attributes.id).to.equal("bill-narrative");
    expect(vm.billNarrativeTaskList.items[0].title.text).to.equal("Bill narrative");
    expect(vm.billNarrativeTaskList.items[0].href).to.equal("/claims/5/upload-evidence-individually/1/file-upload");
    expect(vm.billNarrativeTaskList.items[0].status).to.deep.equal({
      tag: {
        text: {
          key: "common.uploadStatus.uploaded",
        },
        classes: "govuk-tag--green",
      }
    });
  });

  it("builds the work items rows", () => {
    const vm = new UploadEvidenceIndividuallyViewModel(claim5);

    expect(vm.workItemsTaskList.idPrefix).to.equal("work-items");
    expect(vm.workItemsTaskList.attributes.id).to.equal("work-items");
    expect(vm.workItemsTaskList.items[0].title.text).to.deep.equal({
      key: "common.onDate",
      args: {
        title: "Interim hearing",
        date: "20 December 2023",
      },
    });
    expect(vm.workItemsTaskList.items[0].href).to.equal("/claims/5/upload-evidence-individually/2/file-upload");
    expect(vm.workItemsTaskList.items[0].status).to.deep.equal({
      tag: {
        text: {
          key: "common.uploadStatus.notUploaded",
        },
        classes: "govuk-tag--blue",
      }
    });
  });

  it("builds the disbursements rows", () => {
    const vm = new UploadEvidenceIndividuallyViewModel(claim5);

    expect(vm.disbursementsTaskList.idPrefix).to.equal("disbursements");
    expect(vm.disbursementsTaskList.attributes.id).to.equal("disbursements");
    expect(vm.disbursementsTaskList.items[0].title.text).to.deep.equal({
      key: "common.onDate",
      args: {
        title: "Enquiry agent",
        date: "13 January 2023",
      },
    });
    expect(vm.disbursementsTaskList.items[0].href).to.equal("/claims/5/upload-evidence-individually/3/file-upload");
    expect(vm.disbursementsTaskList.items[0].status).to.deep.equal({
      tag: {
        text: {
          key: "common.uploadStatus.notUploaded",
        },
        classes: "govuk-tag--blue",
      }
    });
  });
});
