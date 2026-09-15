import { expect } from "chai";
import { describe, it } from "mocha";
import { DisbursementDetailsForm } from "#src/helpers/disbursementDetailsValidation.js";
import { CostType } from "#src/types/Claim.js";
import {
  expectFailure,
  expectSuccess,
} from "#tests/unit/src/helpers/validationTest.spec.js";

const validBody = {
  activityDateDay: "27",
  activityDateMonth: "3",
  activityDateYear: "2007",
  actualNetValue: "10.50",
  vatApplies: "yes",
  feeEarnerName: "John Smith",
  description: "Expert report",
};

const categories = [
  [CostType.EXPERT_COST, "pages.poa.expertCostDetails"],
  [
    CostType.NON_EXPERT_DISBURSEMENT,
    "pages.poa.nonExpertDisbursementDetails",
  ],
] as const;

for (const [costType, prefix] of categories) {
  describe(`DisbursementDetailsForm monetary validation: ${costType}`, () => {
    it("accepts and normalises pasted currency", () => {
      const form = new DisbursementDetailsForm(costType);

      form.validate({
        ...validBody,
        actualNetValue: " £1,234.5 ",
      });

      expect(
        expectSuccess(form.validation).value.actualNetValue,
      ).to.equal("1234.50");
    });

    for (const [input, reason] of [
      ["", "empty"],
      ["abc", "invalid"],
      ["-10", "negative"],
      ["10.123", "pence"],
    ]) {
      it(`reports ${reason} with the correct field and message prefix`, () => {
        const form = new DisbursementDetailsForm(costType);

        form.validate({
          ...validBody,
          actualNetValue: input,
        });

        const errors = expectFailure(form.validation).errors;

        expect(errors).to.have.length(1);
        expect(errors[0].href).to.equal("#actual-net-value");
        expect(errors[0].text.key).to.equal(
          `${prefix}.actualNetValue.errors.${reason}`,
        );
        expect(form.fields.actualNetValue.getValue()).to.equal(input);

        expect(form.getErrorSummary()?.errorList).to.deep.equal([
          {
            href: errors[0].href,
            text: errors[0].text,
          },
        ]);
      });
    }

    const acceptedAmounts: Array<[string, string]> = [
      ["0.00", "0.00"],
      ["0.01", "0.01"],
      ["10", "10.00"],
      ["10.5", "10.50"],
      ["10.50", "10.50"],
      ["24999.99", "24999.99"],
      ["25000", "25000.00"],
      ["£25,000.00", "25000.00"],
    ];

    for (const [input, expected] of acceptedAmounts) {
      it(`accepts ${input} within the £25,000 maximum`, () => {
        const form = new DisbursementDetailsForm(costType);

        form.validate({
          ...validBody,
          actualNetValue: input,
        });

        expect(
          expectSuccess(form.validation).value.actualNetValue,
        ).to.equal(expected);
      });
    }

    for (const input of ["25000.01", " £25,000.01 ", "25001"]) {
      it(`rejects ${JSON.stringify(input)} above the £25,000 maximum`, () => {
        const form = new DisbursementDetailsForm(costType);

        form.validate({
          ...validBody,
          actualNetValue: input,
        });

        const errors = expectFailure(form.validation).errors;

        expect(errors).to.have.length(1);
        expect(errors[0].href).to.equal("#actual-net-value");
        expect(errors[0].text).to.deep.equal({
          key: `${prefix}.actualNetValue.errors.maximum`,
          args: { maximum: "£25,000.00" },
        });
        expect(form.fields.actualNetValue.getValue()).to.equal(input);

        expect(form.getErrorSummary()?.errorList).to.deep.equal([
          {
            href: errors[0].href,
            text: errors[0].text,
          },
        ]);
      });
    }
  });
}