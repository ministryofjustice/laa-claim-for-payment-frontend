import { expect } from "chai";
import { PoaEvidenceUploadViewModel } from "#src/viewmodels/poa/evidenceUploadViewModel.js";
import { V7Generator } from "uuidv7";
import { UploadForm } from "#src/helpers/fileUploadValidation.js";
import { UploadField } from "#src/helpers/fields.js";
import { Category, Claim, CostType } from "#src/types/Claim.js";
import { LocalDate } from "#src/types/date.js";

describe("PoaEvidenceUploadViewModel constructor()", () => {
  const claimId = new V7Generator().generate().toString();
  const lineItemId = new V7Generator().generate().toString();
  const evidenceId = new V7Generator().generate().toString();

  it("builds the POA evidence upload view model", () => {
    const claim = new Claim({
      id: claimId,
    });
    const field = new UploadField("prefix", "name", "id");
    const form = new UploadForm(field);

    const vm = new PoaEvidenceUploadViewModel({
      claim,
      form,
    });

    expect(vm.title).to.equal("prefix.title");
    expect(vm.uploadUrl).to.equal(
      `/claims/${claimId}/poa/evidence-upload/ajax-upload?claimStatus=DRAFT`,
    );
    expect(vm.deleteUrl).to.equal(
      `/claims/${claimId}/poa/evidence-upload/ajax-delete?claimStatus=DRAFT`,
    );
    expect(vm.saveAndContinueHref).to.equal(
      `/claims/${claimId}/poa/check-details`,
    );
    expect(vm.saveAndComeBackLaterHref).to.equal("#");
    expect(vm.uploadedFiles).to.deep.equal([]);
  });

  it("uses uploaded files when provided", () => {
    const claim = new Claim({
      id: claimId,
      costType: CostType.EXPERT_COST,
      lineItems: [
        {
          id: lineItemId,
          title: "Line item >= threshold",
          category: Category.DISBURSEMENT,
          date: new LocalDate(29, 7, 2026),
          actualNetValue: 20,
          vatApplicable: false,
          feeEarnerName: "John Smith",
          evidenceItems: [],
        },
      ],
      evidence: [
        {
          id: evidenceId,
          fileKey: "evidence.pdf",
          fileSize: 1000,
          submittedOn: "2026-06-17T14:34:01.226855Z",
        },
      ],
    });
    const field = new UploadField("prefix", "name", "id");
    const form = new UploadForm(field);
    form.fill(claim.evidence);

    const vm = new PoaEvidenceUploadViewModel({
      claim,
      form,
    });

    expect(vm.uploadedFiles).to.deep.equal([
      {
        id: evidenceId,
        name: "evidence.pdf",
        size: "1KB",
      },
    ]);
    expect(vm.alert).to.be.undefined;
  });

  it("shows alert when evidence is not required", () => {
    const claim = new Claim({
      id: claimId,
      costType: CostType.EXPERT_COST,
      lineItems: [
        {
          id: lineItemId,
          title: "Line item < threshold",
          category: Category.DISBURSEMENT,
          date: new LocalDate(29, 7, 2026),
          actualNetValue: 19.99,
          vatApplicable: false,
          feeEarnerName: "John Smith",
          evidenceItems: [],
        },
      ],
      evidence: [
        {
          id: evidenceId,
          fileKey: "evidence.pdf",
          fileSize: 1000,
          submittedOn: "2026-06-17T14:34:01.226855Z",
        },
      ],
    });
    const field = new UploadField("prefix", "name", "id");
    const form = new UploadForm(field);
    form.fill(claim.evidence);

    const vm = new PoaEvidenceUploadViewModel({
      claim,
      form,
    });

    expect(vm.alert?.variant).to.equal("information");
    expect(vm.alert?.title).to.deep.equal({
      key: "pages.poaEvidenceUpload.alert.title",
      args: {
        amount: "£20",
      },
    });
    expect(vm.alert?.showTitleAsHeading).to.equal(true);
    expect(vm.alert?.dismissable).to.equal(false);
    expect(vm.alert?.text).to.deep.equal({
      key: "pages.poaEvidenceUpload.alert.text",
    });
  });

  it("doesn't show alert for profit cost", () => {
    const claim = new Claim({
      id: claimId,
      costType: CostType.PROFIT_COST,
      lineItems: [
        {
          id: lineItemId,
          title: "Line item < threshold",
          category: Category.DISBURSEMENT,
          date: new LocalDate(29, 7, 2026),
          netProfitCostAmount: 19.99,
          netAdvocacyCostAmount: 19.99,
          vatApplicable: false,
          feeEarnerName: "John Smith",
          evidenceItems: [],
        },
      ],
      evidence: [
        {
          id: evidenceId,
          fileKey: "evidence.pdf",
          fileSize: 1000,
          submittedOn: "2026-06-17T14:34:01.226855Z",
        },
      ],
    });
    const field = new UploadField("prefix", "name", "id");
    const form = new UploadForm(field);
    form.fill(claim.evidence);

    const vm = new PoaEvidenceUploadViewModel({
      claim,
      form,
    });

    expect(vm.alert).to.be.undefined;
  });
});
