import { expect } from "chai";
import { UploadEvidenceIndividuallyViewModel } from "#src/viewmodels/uploadEvidenceIndividuallyViewModel.js";
import { Claim } from "#src/types/Claim.js";

const claim: Claim = {
  id: 1,
  concluded: new Date(),
  ufn: "someUFN",
  providerUserId: "someProviderUserId",
  client: "someClient",
  category: "someCategory",
  feeType: "someFeeType",
  claimed: 1,
  submissionId: "someSubmissionId",
  lineItems: [],
};

describe("ClaimViewModel constructor()", () => {
  it("builds the bill narrative rows", () => {
    const vm = new UploadEvidenceIndividuallyViewModel(claim);

    expect(vm.billNarrativeTasks[0].link.text).to.equal("Bill narrative");
    expect(vm.billNarrativeTasks[0].link.href).to.equal("/claims/1/upload-evidence-individually/1/file-upload");
    expect(vm.billNarrativeTasks[0].tag).to.deep.equal({
      text: {
        key: "common.uploadStatus.uploaded",
      },
      classes: "govuk-tag--green",
    });
  });

  it("builds the work items rows", () => {
    const vm = new UploadEvidenceIndividuallyViewModel(claim);

    expect(vm.workItemsTasks[0].link.text).to.equal(
      "Interim hearing on 20 December 2023",
    );
    expect(vm.workItemsTasks[0].link.href).to.equal("/claims/1/upload-evidence-individually/2/file-upload");
    expect(vm.workItemsTasks[0].tag).to.deep.equal({
      text: {
        key: "common.uploadStatus.notUploaded",
      },
      classes: "govuk-tag--blue",
    });

    expect(vm.workItemsTasks[1].link.text).to.equal(
      "Interim hearing on 4 January 2024",
    );
    expect(vm.workItemsTasks[1].link.href).to.equal("/claims/1/upload-evidence-individually/3/file-upload");
    expect(vm.workItemsTasks[1].tag).to.deep.equal({
      text: {
        key: "common.uploadStatus.notUploaded",
      },
      classes: "govuk-tag--blue",
    });

    expect(vm.workItemsTasks[2].link.text).to.equal(
      "Final hearing on 24 January 2024",
    );
    expect(vm.workItemsTasks[2].link.href).to.equal("/claims/1/upload-evidence-individually/4/file-upload");
    expect(vm.workItemsTasks[2].tag).to.deep.equal({
      text: {
        key: "common.uploadStatus.notUploaded",
      },
      classes: "govuk-tag--blue",
    });
  });

  it("builds the disbursements rows", () => {
    const vm = new UploadEvidenceIndividuallyViewModel(claim);

    expect(vm.disbursementsTasks[0].link.text).to.equal(
      "Enquiry agent on 23 December 2023",
    );
    expect(vm.disbursementsTasks[0].link.href).to.equal("/claims/1/upload-evidence-individually/5/file-upload");
    expect(vm.disbursementsTasks[0].tag).to.deep.equal({
      text: {
        key: "common.uploadStatus.notUploaded",
      },
      classes: "govuk-tag--blue",
    });

    expect(vm.disbursementsTasks[1].link.text).to.equal(
      "Enquiry agent on 13 January 2023",
    );
    expect(vm.disbursementsTasks[1].link.href).to.equal("/claims/1/upload-evidence-individually/6/file-upload");
    expect(vm.disbursementsTasks[1].tag).to.deep.equal({
      text: {
        key: "common.uploadStatus.notUploaded",
      },
      classes: "govuk-tag--blue",
    });

    expect(vm.disbursementsTasks[2].link.text).to.equal(
      "Car mileage on 20 December 2023",
    );
    expect(vm.disbursementsTasks[2].link.href).to.equal("/claims/1/upload-evidence-individually/7/file-upload");
    expect(vm.disbursementsTasks[2].tag).to.deep.equal({
      text: {
        key: "common.uploadStatus.notUploaded",
      },
      classes: "govuk-tag--blue",
    });

    expect(vm.disbursementsTasks[3].link.text).to.equal(
      "Car mileage on 4 January 2024",
    );
    expect(vm.disbursementsTasks[3].link.href).to.equal("/claims/1/upload-evidence-individually/8/file-upload");
    expect(vm.disbursementsTasks[3].tag).to.deep.equal({
      text: {
        key: "common.uploadStatus.notUploaded",
      },
      classes: "govuk-tag--blue",
    });
  });
});
