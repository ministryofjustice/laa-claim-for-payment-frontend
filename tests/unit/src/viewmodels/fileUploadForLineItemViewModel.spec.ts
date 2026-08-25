import { FileUploadForLineItemViewModel } from "#src/viewmodels/fileUploadForLineItemViewModel.js";
import { claim1, claim6, claim7 } from "#tests/assets/claim.js";
import {
  billNarrativeLineItem,
  workItemLineItem1,
} from "#tests/assets/lineItems.js";
import { expect } from "chai";
import { Claim } from "#src/types/Claim.js";

describe("FileUploadForLineItemViewModel constructor()", ()=>{
  it("builds the title and urls", () => {
    const claim = new Claim({
      ...claim1,
    });

    const claimId = "019f5fa1-dd58-7456-bf6f-73dd0b58eeb5";
    const lineItemId = "019f5fa4-0e78-712a-a6fd-51dd39005339";

    const vm = new FileUploadForLineItemViewModel(claim, billNarrativeLineItem);

    expect(vm.title).to.equal("Bill narrative");
    expect(vm.uploadUrl).to.equal(`/claims/${claimId}/upload-evidence-individually/${lineItemId}/file-upload/ajax-upload?claimStatus=SUBMITTED`);
    expect(vm.deleteUrl).to.equal(`/claims/${claimId}/upload-evidence-individually/${lineItemId}/file-upload/ajax-delete?claimStatus=SUBMITTED`);
    expect(vm.saveAndContinueHref).to.equal("/claims/019f5fa1-dd58-7456-bf6f-73dd0b58eeb5/upload-evidence-individually");
  });

  it("builds the reusable documents when there are no evidence items not already uploaded for this line item", () => {
    const claim = new Claim({
      ...claim1,
    });

    const vm = new FileUploadForLineItemViewModel(claim, billNarrativeLineItem);

    expect(vm.reusableDocuments.length).to.equal(0);
  });

  it("builds the reusable documents when there are evidence items not already uploaded for this line item", () => {
    const claim = new Claim({
      ...claim1,
    });

    const vm = new FileUploadForLineItemViewModel(claim, workItemLineItem1);

    expect(vm.reusableDocuments.length).to.equal(1);
    expect(vm.reusableDocuments[0].name).to.equal("evidence1.pdf");
    expect(vm.reusableDocuments[0].size).to.equal("1KB");
  });

  it("builds the reusable documents when there is an evidence item in another line item that is already linked to this line item", () => {
    const claim = new Claim({
      ...claim6,
    });

    const vm = new FileUploadForLineItemViewModel(claim, billNarrativeLineItem);

    expect(vm.reusableDocuments.length).to.equal(0);
  });

  it("builds the reusable documents when the same evidence has been linked to multiple other items", () => {
    const claim = new Claim({
      ...claim7,
    });

    const vm = new FileUploadForLineItemViewModel(claim, workItemLineItem1);

    expect(vm.reusableDocuments.length).to.equal(1);
    expect(vm.reusableDocuments[0].name).to.equal("evidence1.pdf");
    expect(vm.reusableDocuments[0].size).to.equal("1KB");
  });

  it("builds the uploaded files when there are no evidence items not already uploaded for this line item", () => {
    const claim = new Claim({
      ...claim1,
    });

    const vm = new FileUploadForLineItemViewModel(claim, billNarrativeLineItem);

    expect(vm.uploadedFiles.length).to.equal(1);
    expect(vm.uploadedFiles[0].name).to.equal("evidence1.pdf");
    expect(vm.uploadedFiles[0].size).to.equal("1KB");
  });

  it("builds the uploaded files when there are evidence items not already uploaded for this line item", () => {
    const claim = new Claim({
      ...claim1,
    });

    const vm = new FileUploadForLineItemViewModel(claim, workItemLineItem1);

    expect(vm.uploadedFiles.length).to.equal(0);
  });

  it("builds the uploaded files when there is an evidence item in another line item that is already linked to this line item", () => {
    const claim = new Claim({
      ...claim6,
    });

    const vm = new FileUploadForLineItemViewModel(claim, billNarrativeLineItem);

    expect(vm.uploadedFiles.length).to.equal(1);
    expect(vm.uploadedFiles[0].name).to.equal("evidence1.pdf");
    expect(vm.uploadedFiles[0].size).to.equal("1KB");
  });

  it("builds the uploaded files when the same evidence has been linked to multiple other items", () => {
    const claim = new Claim({
      ...claim7,
    });

    const vm = new FileUploadForLineItemViewModel(claim, workItemLineItem1);

    expect(vm.uploadedFiles.length).to.equal(0);
  });
})