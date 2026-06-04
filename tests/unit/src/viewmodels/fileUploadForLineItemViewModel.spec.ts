import { FileUploadForLineItemViewModel } from "#src/viewmodels/fileUploadForLineItemViewModel.js";
import { claim1, claim6, claim7 } from "#tests/assets/claim.js";
import {
  billNarrativeLineItem,
  workItemLineItem1,
} from "#tests/assets/lineItems.js";
import { expect } from "chai";

describe("FileUploadForLineItemViewModel constructor()", ()=>{
  it("builds the title and saveAndContinueHref", () => {
    const vm = new FileUploadForLineItemViewModel(claim1, billNarrativeLineItem);

    expect(vm.title).to.equal("Bill narrative");
    expect(vm.saveAndContinueHref).to.equal("/claims/1/upload-evidence-individually");
  });

  it("builds the reusable documents when there are no evidence items not already uploaded for this line item", () => {
    const vm = new FileUploadForLineItemViewModel(claim1, billNarrativeLineItem);

    expect(vm.reusableDocuments.length).to.equal(0);
  });

  it("builds the reusable documents when there are evidence items not already uploaded for this line item", () => {
    const vm = new FileUploadForLineItemViewModel(claim1, workItemLineItem1);

    expect(vm.reusableDocuments.length).to.equal(1);
    expect(vm.reusableDocuments[0].name).to.equal("evidence1.pdf");
    expect(vm.reusableDocuments[0].size).to.equal("1KB");
  });

  it("builds the reusable documents when there is an evidence item in another line item that is already linked to this line item", () => {
    const vm = new FileUploadForLineItemViewModel(claim6, billNarrativeLineItem);

    expect(vm.reusableDocuments.length).to.equal(0);
  });

  it("builds the reusable documents when the same evidence has been linked to multiple other items", () => {
    const vm = new FileUploadForLineItemViewModel(claim7, workItemLineItem1);

    expect(vm.reusableDocuments.length).to.equal(1);
    expect(vm.reusableDocuments[0].name).to.equal("evidence1.pdf");
    expect(vm.reusableDocuments[0].size).to.equal("1KB");
  });

  it("builds the uploaded files when there are no evidence items not already uploaded for this line item", () => {
    const vm = new FileUploadForLineItemViewModel(claim1, billNarrativeLineItem);

    expect(vm.uploadedFiles.length).to.equal(1);
    expect(vm.uploadedFiles[0].name).to.equal("evidence1.pdf");
    expect(vm.uploadedFiles[0].size).to.equal("1KB");
  });

  it("builds the uploaded files when there are evidence items not already uploaded for this line item", () => {
    const vm = new FileUploadForLineItemViewModel(claim1, workItemLineItem1);

    expect(vm.uploadedFiles.length).to.equal(0);
  });

  it("builds the uploaded files when there is an evidence item in another line item that is already linked to this line item", () => {
    const vm = new FileUploadForLineItemViewModel(claim6, billNarrativeLineItem);

    expect(vm.uploadedFiles.length).to.equal(1);
    expect(vm.uploadedFiles[0].name).to.equal("evidence1.pdf");
    expect(vm.uploadedFiles[0].size).to.equal("1KB");
  });

  it("builds the uploaded files when the same evidence has been linked to multiple other items", () => {
    const vm = new FileUploadForLineItemViewModel(claim7, workItemLineItem1);

    expect(vm.uploadedFiles.length).to.equal(0);
  });
})