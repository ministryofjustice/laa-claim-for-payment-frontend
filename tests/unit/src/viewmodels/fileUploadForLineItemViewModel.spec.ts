import { FileUploadForLineItemViewModel } from "#src/viewmodels/fileUploadForLineItemViewModel.js";
import { claim1 } from "#tests/assets/claim.js";
import { billNarrativeLineItem } from "#tests/assets/lineItems.js";
import { expect } from "chai";

describe("FileUploadForLineItemViewModel constructor()", ()=>{
  it("builds the title and saveAndContinueHref", () =>{
    const vm = new FileUploadForLineItemViewModel(claim1, billNarrativeLineItem);

    expect(vm.title).to.equal("Bill narrative")
    expect(vm.saveAndContinueHref).to.equal("/claims/1/upload-evidence-individually");
  })
})