import { V7Generator } from "uuidv7";
import { Category, DisbursementLineItem } from "#src/types/Claim.js";
import {
  AddAnotherDisbursementViewModel,
  AddAnotherDisbursementViewModelParams,
} from "#src/viewmodels/poa/addAnotherLineItemViewModel.js";
import { expect } from "chai";
import { LocalDate } from "#src/types/date.js";
import { expectLocalizedText } from "#tests/unit/src/viewmodels/base/base.spec.js";
import { BooleanField } from "#src/helpers/fields.js";
import { YesNoQuestionForm } from "#src/helpers/radioQuestionValidation.js";

describe("AddAnotherLineItemViewModel", () => {
  const claimId = new V7Generator().generate();
  const lineItem1Id = new V7Generator().generate();
  const lineItem2Id = new V7Generator().generate();

  describe("AddAnotherDisbursementViewModel", () => {
    it("when one line item", () => {
      const lineItems: DisbursementLineItem[] = [
        {
          id: lineItem1Id.toString(),
          title: "Line item 1",
          category: Category.DISBURSEMENT,
          date: new LocalDate(18, 3, 2025),
          evidenceItems: [],
          feeEarnerName: "Joe Bloggs",
          vatApplicable: true,
          actualNetValue: 123,
          netProfitCostAmount: null,
          netAdvocacyCostAmount: null,
        },
      ];

      const field = new BooleanField("test", "test", "test");

      const params: AddAnotherDisbursementViewModelParams = {
        claimId: claimId.toString(),
        lineItems,
        form: new YesNoQuestionForm(field),
      };

      const result = new AddAnotherDisbursementViewModel(params);

      expect(result.title).to.deep.equal({
        key: "test.title.singular",
      });

      expect(result.radioQuestionViewModel.title).to.deep.equal({
        key: "test.question",
      });

      expect(result.lineItemsSummaryList.card).to.be.undefined;
      expect(result.lineItemsSummaryList.attributes.id).to.equal("disbursement-rows");
      expect(result.lineItemsSummaryList.rows.length).to.equal(1);

      expectLocalizedText(
        result.lineItemsSummaryList.rows[0].key.text,
        "18 March 2025",
      );
      expect(result.lineItemsSummaryList.rows[0].value.text).to.equal(
        "£123.00",
      );
      expect(
        result.lineItemsSummaryList.rows[0].actions?.items.length,
      ).to.equal(2);
      expect(
        result.lineItemsSummaryList.rows[0].actions?.items[0].text,
      ).to.deep.equal({ key: "common.change" });
      expect(
        result.lineItemsSummaryList.rows[0].actions?.items[0].href,
      ).to.equal(
        `/claims/${claimId.toString()}/poa/disbursement-details?lineItemId=${lineItem1Id.toString()}`,
      );
      expectLocalizedText(
        result.lineItemsSummaryList.rows[0].actions?.items[0]
          .visuallyHiddenText!,
        "18 March 2025",
      );
      expect(
        result.lineItemsSummaryList.rows[0].actions?.items[1].text,
      ).to.deep.equal({ key: "common.remove" });
      expect(
        result.lineItemsSummaryList.rows[0].actions?.items[1].href,
      ).to.equal(
        `/claims/${claimId.toString()}/poa/disbursement-details/${lineItem1Id.toString()}/remove`,
      );
      expectLocalizedText(
        result.lineItemsSummaryList.rows[0].actions?.items[1]
          .visuallyHiddenText!,
        "18 March 2025",
      );
    });

    it("when more than one line item", () => {
      const lineItems: DisbursementLineItem[] = [
        {
          id: lineItem1Id.toString(),
          title: "Line item 1",
          category: Category.DISBURSEMENT,
          date: new LocalDate(18, 3, 2025),
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
          date: new LocalDate(26, 7, 2026),
          evidenceItems: [],
          feeEarnerName: "Jane Doe",
          vatApplicable: false,
          actualNetValue: 456,
          netProfitCostAmount: null,
          netAdvocacyCostAmount: null,
        },
      ];

      const field = new BooleanField("test", "test", "test");

      const params: AddAnotherDisbursementViewModelParams = {
        claimId: claimId.toString(),
        lineItems,
        form: new YesNoQuestionForm(field),
      };

      const result = new AddAnotherDisbursementViewModel(params);

      expect(result.title).to.deep.equal({
        key: "test.title.multiple",
        args: { count: 2 },
      });

      expect(result.radioQuestionViewModel.title).to.deep.equal({
        key: "test.question",
      });

      expect(result.lineItemsSummaryList.card).to.be.undefined;
      expect(result.lineItemsSummaryList.attributes.id).to.equal("disbursement-rows");
      expect(result.lineItemsSummaryList.rows.length).to.equal(2);

      expectLocalizedText(
        result.lineItemsSummaryList.rows[0].key.text,
        "18 March 2025",
      );
      expect(result.lineItemsSummaryList.rows[0].value.text).to.equal(
        "£123.00",
      );
      expect(
        result.lineItemsSummaryList.rows[0].actions?.items.length,
      ).to.equal(2);
      expect(
        result.lineItemsSummaryList.rows[0].actions?.items[0].text,
      ).to.deep.equal({ key: "common.change" });
      expect(
        result.lineItemsSummaryList.rows[0].actions?.items[0].href,
      ).to.equal(
        `/claims/${claimId.toString()}/poa/disbursement-details?lineItemId=${lineItem1Id.toString()}`,
      );
      expectLocalizedText(
        result.lineItemsSummaryList.rows[0].actions?.items[0]
          .visuallyHiddenText!,
        "18 March 2025",
      );
      expect(
        result.lineItemsSummaryList.rows[0].actions?.items[1].text,
      ).to.deep.equal({ key: "common.remove" });
      expect(
        result.lineItemsSummaryList.rows[0].actions?.items[1].href,
      ).to.equal(
        `/claims/${claimId.toString()}/poa/disbursement-details/${lineItem1Id.toString()}/remove`,
      );
      expectLocalizedText(
        result.lineItemsSummaryList.rows[0].actions?.items[1]
          .visuallyHiddenText!,
        "18 March 2025",
      );

      expectLocalizedText(
        result.lineItemsSummaryList.rows[1].key.text,
        "26 July 2026",
      );
      expect(result.lineItemsSummaryList.rows[1].value.text).to.equal(
        "£456.00",
      );
      expect(
        result.lineItemsSummaryList.rows[1].actions?.items.length,
      ).to.equal(2);
      expect(
        result.lineItemsSummaryList.rows[1].actions?.items[0].text,
      ).to.deep.equal({ key: "common.change" });
      expect(
        result.lineItemsSummaryList.rows[1].actions?.items[0].href,
      ).to.equal(
        `/claims/${claimId.toString()}/poa/disbursement-details?lineItemId=${lineItem2Id.toString()}`,
      );
      expectLocalizedText(
        result.lineItemsSummaryList.rows[1].actions?.items[0]
          .visuallyHiddenText!,
        "26 July 2026",
      );
      expect(
        result.lineItemsSummaryList.rows[1].actions?.items[1].text,
      ).to.deep.equal({ key: "common.remove" });
      expect(
        result.lineItemsSummaryList.rows[1].actions?.items[1].href,
      ).to.equal(
        `/claims/${claimId.toString()}/poa/disbursement-details/${lineItem2Id.toString()}/remove`,
      );
      expectLocalizedText(
        result.lineItemsSummaryList.rows[1].actions?.items[1]
          .visuallyHiddenText!,
        "26 July 2026",
      );
    });
  });
});
