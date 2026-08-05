import { V7Generator } from "uuidv7";
import { Category, ExpertCostLineItem } from "#src/types/Claim.js";
import {
  AddAnotherExpertCostViewModel,
  AddAnotherExpertCostViewModelParams,
} from "#src/viewmodels/poa/addAnotherLineItemViewModel.js";
import { expect } from "chai";

describe("AddAnotherLineItemViewModel", () => {
  const claimId = new V7Generator().generate();
  const lineItem1Id = new V7Generator().generate();
  const lineItem2Id = new V7Generator().generate();

  describe("AddAnotherExpertCostViewModel", () => {
    it("when one line item", () => {
      const lineItems: ExpertCostLineItem[] = [
        {
          id: lineItem1Id.toString(),
          title: "Line item 1",
          category: Category.DISBURSEMENT,
          date: new Date("2025-03-18"),
          evidenceItems: [],
          feeEarnerName: "Joe Bloggs",
          vatApplicable: true,
          actualNetValue: 123,
          netProfitCostAmount: null,
          netAdvocacyCostAmount: null,
        },
      ];

      const params: AddAnotherExpertCostViewModelParams = {
        claimId: claimId.toString(),
        lineItems,
      };

      const result = new AddAnotherExpertCostViewModel(params);

      expect(result.title).to.deep.equal({
        key: "pages.poa.expertCostDetails.addAnother.title.singular",
      });

      expect(result.radioQuestionViewModel.title).to.deep.equal({
        key: "pages.poa.expertCostDetails.addAnother.question",
      });

      expect(result.lineItemsSummaryList.card).to.be.undefined;
      expect(result.lineItemsSummaryList.rows.length).to.equal(1);

      expect(result.lineItemsSummaryList.rows[0].key.text).to.equal("18 March 2025");
      expect(result.lineItemsSummaryList.rows[0].value.text).to.equal("£123.00");
      expect(result.lineItemsSummaryList.rows[0].actions?.items.length).to.equal(2);
      expect(result.lineItemsSummaryList.rows[0].actions?.items[0].text).to.deep.equal({ key: "common.change" });
      expect(result.lineItemsSummaryList.rows[0].actions?.items[0].href).to.equal(`/claims/${claimId.toString()}/poa/expert-cost-details?lineItemId=${lineItem1Id.toString()}`);
      expect(result.lineItemsSummaryList.rows[0].actions?.items[0].visuallyHiddenText).to.equal("18 March 2025");
      expect(result.lineItemsSummaryList.rows[0].actions?.items[1].text).to.deep.equal({ key: "common.remove" });
      expect(result.lineItemsSummaryList.rows[0].actions?.items[1].href).to.equal(`/claims/${claimId.toString()}/poa/expert-cost-details/${lineItem1Id.toString()}/remove`);
      expect(result.lineItemsSummaryList.rows[0].actions?.items[1].visuallyHiddenText).to.equal("18 March 2025");
    });

    it("when more than one line item", () => {
      const lineItems: ExpertCostLineItem[] = [
        {
          id: lineItem1Id.toString(),
          title: "Line item 1",
          category: Category.DISBURSEMENT,
          date: new Date("2025-03-18"),
          evidenceItems: [],
          feeEarnerName: "Joe Bloggs",
          vatApplicable: true,
          actualNetValue: 123,
          netProfitCostAmount: null,
          netAdvocacyCostAmount: null,
        },
        {
          id: lineItem2Id.toString(),
          title: "Line item 2",
          category: Category.DISBURSEMENT,
          date: new Date("2026-07-26"),
          evidenceItems: [],
          feeEarnerName: "Jane Doe",
          vatApplicable: false,
          actualNetValue: 456,
          netProfitCostAmount: null,
          netAdvocacyCostAmount: null,
        },
      ];

      const params: AddAnotherExpertCostViewModelParams = {
        claimId: claimId.toString(),
        lineItems,
      };

      const result = new AddAnotherExpertCostViewModel(params);

      expect(result.title).to.deep.equal({
        key: "pages.poa.expertCostDetails.addAnother.title.multiple",
        args: { count: 2 },
      });

      expect(result.radioQuestionViewModel.title).to.deep.equal({
        key: "pages.poa.expertCostDetails.addAnother.question",
      });

      expect(result.lineItemsSummaryList.card).to.be.undefined;
      expect(result.lineItemsSummaryList.rows.length).to.equal(2);

      expect(result.lineItemsSummaryList.rows[0].key.text).to.equal("18 March 2025");
      expect(result.lineItemsSummaryList.rows[0].value.text).to.equal("£123.00");
      expect(result.lineItemsSummaryList.rows[0].actions?.items.length).to.equal(2);
      expect(result.lineItemsSummaryList.rows[0].actions?.items[0].text).to.deep.equal({ key: "common.change" });
      expect(result.lineItemsSummaryList.rows[0].actions?.items[0].href).to.equal(`/claims/${claimId.toString()}/poa/expert-cost-details?lineItemId=${lineItem1Id.toString()}`);
      expect(result.lineItemsSummaryList.rows[0].actions?.items[0].visuallyHiddenText).to.equal("18 March 2025");
      expect(result.lineItemsSummaryList.rows[0].actions?.items[1].text).to.deep.equal({ key: "common.remove" });
      expect(result.lineItemsSummaryList.rows[0].actions?.items[1].href).to.equal(`/claims/${claimId.toString()}/poa/expert-cost-details/${lineItem1Id.toString()}/remove`);
      expect(result.lineItemsSummaryList.rows[0].actions?.items[1].visuallyHiddenText).to.equal("18 March 2025");

      expect(result.lineItemsSummaryList.rows[1].key.text).to.equal("26 July 2026");
      expect(result.lineItemsSummaryList.rows[1].value.text).to.equal("£456.00");
      expect(result.lineItemsSummaryList.rows[1].actions?.items.length).to.equal(2);
      expect(result.lineItemsSummaryList.rows[1].actions?.items[0].text).to.deep.equal({ key: "common.change" });
      expect(result.lineItemsSummaryList.rows[1].actions?.items[0].href).to.equal(`/claims/${claimId.toString()}/poa/expert-cost-details?lineItemId=${lineItem2Id.toString()}`);
      expect(result.lineItemsSummaryList.rows[1].actions?.items[0].visuallyHiddenText).to.equal("26 July 2026");
      expect(result.lineItemsSummaryList.rows[1].actions?.items[1].text).to.deep.equal({ key: "common.remove" });
      expect(result.lineItemsSummaryList.rows[1].actions?.items[1].href).to.equal(`/claims/${claimId.toString()}/poa/expert-cost-details/${lineItem2Id.toString()}/remove`);
      expect(result.lineItemsSummaryList.rows[1].actions?.items[1].visuallyHiddenText).to.equal("26 July 2026");
    });
  });
});
