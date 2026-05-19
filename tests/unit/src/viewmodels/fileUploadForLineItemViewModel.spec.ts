import { Claim, LineItem } from "#src/types/Claim.js";
import { FileUploadForLineItemViewModel } from "#src/viewmodels/fileUploadForLineItemViewModel.js";
import { expect } from "chai";

describe("FileUploadForLineItemViewModel constructor()", ()=>{
  it("builds the title and saveAndContinueHref", () =>{
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

    const lineitm: LineItem = {
        id: 1,
        title: "Bill Narrative"
    }

    const vm = new FileUploadForLineItemViewModel(claim, lineitm);

    expect(vm.title).to.equal("Bill Narrative")
    expect(vm.saveAndContinueHref).to.equal("/claims/1/upload-evidence-individually");
  })
})