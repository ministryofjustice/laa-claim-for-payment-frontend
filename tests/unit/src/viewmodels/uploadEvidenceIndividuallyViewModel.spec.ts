import { expect } from "chai";
import { UploadEvidenceIndividuallyViewModel } from "#src/viewmodels/uploadEvidenceIndividuallyViewModel.js";
import { claim5 } from "#tests/assets/claim.js";
import { UUID } from "uuidv7";
import { Message } from "#src/viewmodels/components/message.js";
import { expectLocalizedText } from "#tests/unit/src/viewmodels/base/base.spec.js";
import { Claim } from "#src/types/Claim.js";

describe("UploadEvidenceIndividuallyViewModel constructor()", () => {
  it("builds the bill narrative rows", () => {
    const claim = new Claim({
      ...claim5,
    });
    const claimId = claim.id;
    const lineItemId = UUID.parse("019f5fa4-0e78-712a-a6fd-51dd39005339");
    const vm = new UploadEvidenceIndividuallyViewModel(claim);

    expect(vm.billNarrativeTaskList.idPrefix).to.equal("bill-narrative");
    expect(vm.billNarrativeTaskList.attributes.id).to.equal("bill-narrative");
    expect(vm.billNarrativeTaskList.items[0].title.text).to.equal(
      "Bill narrative",
    );
    expect(vm.billNarrativeTaskList.items[0].href).to.equal(
      `/claims/${claimId}/upload-evidence-individually/${lineItemId}/file-upload`,
    );
    expect(vm.billNarrativeTaskList.items[0].status).to.deep.equal({
      tag: {
        text: {
          key: "common.uploadStatus.uploaded",
        },
        classes: "govuk-tag--green",
      },
    });
  });

  it("builds the work items rows", () => {
    const claim = new Claim({
      ...claim5,
    });
    const claimId = claim.id;
    const lineItemId = UUID.parse("019f5fa4-7304-7ee5-9e1b-e692c26a0973");
    const vm = new UploadEvidenceIndividuallyViewModel(claim);

    expect(vm.workItemsTaskList.idPrefix).to.equal("work-items");
    expect(vm.workItemsTaskList.attributes.id).to.equal("work-items");
    const title = vm.workItemsTaskList.items[0].title.text as Message;
    expect(title.key).to.equal("common.onDate");
    expect(title.args?.["title"]).to.equal("Interim hearing");
    expectLocalizedText(title.args?.["date"]!, "20 December 2023");
    expect(vm.workItemsTaskList.items[0].href).to.equal(
      `/claims/${claimId}/upload-evidence-individually/${lineItemId}/file-upload`,
    );
    expect(vm.workItemsTaskList.items[0].status).to.deep.equal({
      tag: {
        text: {
          key: "common.uploadStatus.notUploaded",
        },
        classes: "govuk-tag--blue",
      },
    });
  });

  it("builds the disbursements rows", () => {
    const claim = new Claim({
      ...claim5,
    });
    const claimId = claim.id;
    const lineItemId = UUID.parse("019f5fa5-5fb7-746d-946f-0ca18008570c");
    const vm = new UploadEvidenceIndividuallyViewModel(claim);

    expect(vm.disbursementsTaskList.idPrefix).to.equal("disbursements");
    expect(vm.disbursementsTaskList.attributes.id).to.equal("disbursements");
    const title = vm.disbursementsTaskList.items[0].title.text as Message;
    expect(title.key).to.equal("common.onDate");
    expect(title.args?.["title"]).to.equal("Enquiry agent");
    expectLocalizedText(title.args?.["date"]!, "13 January 2023");
    expect(vm.disbursementsTaskList.items[0].href).to.equal(
      `/claims/${claimId}/upload-evidence-individually/${lineItemId}/file-upload`,
    );
    expect(vm.disbursementsTaskList.items[0].status).to.deep.equal({
      tag: {
        text: {
          key: "common.uploadStatus.notUploaded",
        },
        classes: "govuk-tag--blue",
      },
    });
  });
});
