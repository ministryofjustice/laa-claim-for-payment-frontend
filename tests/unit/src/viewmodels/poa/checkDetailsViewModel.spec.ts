import { expect } from "chai";
import { Claim } from "#src/types/Claim.js";
import { CheckDetailsViewModel } from "#src/viewmodels/poa/checkDetailsViewModel.js";
import { claim11, claim9 } from "#tests/assets/claim.js";
import { AnswerMissingError } from "#src/types/errors.js";
import { expectLocalizedText } from "#tests/unit/src/viewmodels/base/base.spec.js";
import { Message } from "#src/viewmodels/components/message.js";

describe("CheckDetailsViewModel constructor()", () => {
  it("throws for an empty claim", () => {
    const claim: Claim = new Claim({
      id: "019fae76-b6bd-76ec-ae50-38d76da01631",
    });
    expect(() => new CheckDetailsViewModel(claim)).to.throw(AnswerMissingError);
  });

  it("builds the assessment summary table", () => {
    const claim: Claim = new Claim({
      ...claim9,
    });
    const vm = new CheckDetailsViewModel(claim);

    expect(vm.assessmentSummaryTable.head.length).to.equal(2);
    expect(vm.assessmentSummaryTable.head[0].text).to.deep.equal({
      key: "pages.poa.checkYourDetails.assessmentSummary.item",
    });
    expect(vm.assessmentSummaryTable.head[1].text).to.deep.equal({
      key: "pages.poa.checkYourDetails.assessmentSummary.cost",
    });

    expect(vm.assessmentSummaryTable.rows.length).to.equal(4);

    expect(vm.assessmentSummaryTable.rows[0].length).to.equal(2);
    expect(vm.assessmentSummaryTable.rows[0][0].text).to.deep.equal({
      key: "pages.poa.checkYourDetails.assessmentSummary.totalNetClaim",
    });
    expect(vm.assessmentSummaryTable.rows[0][1].text).to.equal("£0");

    expect(vm.assessmentSummaryTable.rows[1].length).to.equal(2);
    expect(vm.assessmentSummaryTable.rows[1][0].text).to.deep.equal({
      key: "pages.poa.checkYourDetails.assessmentSummary.totalVatClaim",
    });
    expect(vm.assessmentSummaryTable.rows[1][1].text).to.equal("£0");

    expect(vm.assessmentSummaryTable.rows[2].length).to.equal(2);
    expect(vm.assessmentSummaryTable.rows[2][0].text).to.deep.equal({
      key: "pages.poa.checkYourDetails.assessmentSummary.poaTotalNetClaim",
    });
    expect(vm.assessmentSummaryTable.rows[2][1].text).to.equal("£0");

    expect(vm.assessmentSummaryTable.rows[3].length).to.equal(2);
    expect(vm.assessmentSummaryTable.rows[3][0].text).to.deep.equal({
      key: "pages.poa.checkYourDetails.assessmentSummary.totalClaim",
    });
    expect(vm.assessmentSummaryTable.rows[3][1].text).to.equal("£0");
  });

  it("builds the profit cost details summary list", () => {
    const claim: Claim = new Claim({
      ...claim9,
    });
    const claimId = claim.id;
    const vm = new CheckDetailsViewModel(claim);

    expect(vm.profitCostDetailsSummaryList?.card?.title.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.profitCostDetails.title",
    });
    expect(vm.profitCostDetailsSummaryList?.card?.actions).to.not.exist;
    expect(vm.profitCostDetailsSummaryList?.attributes.id).to.equal(
      "profit-cost-details-rows",
    );
    expect(vm.profitCostDetailsSummaryList?.rows.length).to.equal(8);

    expect(vm.profitCostDetailsSummaryList?.rows[0].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.profitCostDetails.courtType",
    });
    expect(vm.profitCostDetailsSummaryList?.rows[0].value.text).to.deep.equal({
      key: "pages.profitCostDetails.courtType.COUNTY_COURT.text",
    });
    expect(
      vm.profitCostDetailsSummaryList?.rows[0].actions?.items.length,
    ).to.equal(1);
    expect(
      vm.profitCostDetailsSummaryList?.rows[0].actions?.items[0].text,
    ).to.deep.equal({ key: "common.change" });
    expect(
      vm.profitCostDetailsSummaryList?.rows[0].actions?.items[0].href,
    ).to.equal(
      `/claims/${claimId.toString()}/poa/profit-cost-details#courtTypeChoice`,
    );

    expect(vm.profitCostDetailsSummaryList?.rows[1].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.profitCostDetails.clientPartyStatus",
    });
    expect(vm.profitCostDetailsSummaryList?.rows[1].value.text).to.deep.equal({
      key: "pages.profitCostDetails.clientStatus.CHILD.text",
    });
    expect(
      vm.profitCostDetailsSummaryList?.rows[1].actions?.items.length,
    ).to.equal(1);
    expect(
      vm.profitCostDetailsSummaryList?.rows[1].actions?.items[0].text,
    ).to.deep.equal({ key: "common.change" });
    expect(
      vm.profitCostDetailsSummaryList?.rows[1].actions?.items[0].href,
    ).to.equal(
      `/claims/${claimId.toString()}/poa/profit-cost-details#clientStatusChoice`,
    );

    expect(vm.profitCostDetailsSummaryList?.rows[2].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.profitCostDetails.firstSolicitor",
    });
    expect(vm.profitCostDetailsSummaryList?.rows[2].value.text).to.deep.equal({
      key: "common.yes",
    });
    expect(
      vm.profitCostDetailsSummaryList?.rows[2].actions?.items.length,
    ).to.equal(1);
    expect(
      vm.profitCostDetailsSummaryList?.rows[2].actions?.items[0].text,
    ).to.deep.equal({ key: "common.change" });
    expect(
      vm.profitCostDetailsSummaryList?.rows[2].actions?.items[0].href,
    ).to.equal(
      `/claims/${claimId.toString()}/poa/profit-cost-details#firstSolicitorChoice`,
    );

    expect(vm.profitCostDetailsSummaryList?.rows[3].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.profitCostDetails.transferOfSolicitor",
    });
    expect(vm.profitCostDetailsSummaryList?.rows[3].value.text).to.deep.equal({
      key: "common.no",
    });
    expect(
      vm.profitCostDetailsSummaryList?.rows[3].actions?.items.length,
    ).to.equal(1);
    expect(
      vm.profitCostDetailsSummaryList?.rows[3].actions?.items[0].text,
    ).to.deep.equal({ key: "common.change" });
    expect(
      vm.profitCostDetailsSummaryList?.rows[3].actions?.items[0].href,
    ).to.equal(
      `/claims/${claimId.toString()}/poa/profit-cost-details#transferOfSolicitorChoice`,
    );

    expect(vm.profitCostDetailsSummaryList?.rows[4].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.profitCostDetails.clientsRetained",
    });
    expect(vm.profitCostDetailsSummaryList?.rows[4].value.text).to.deep.equal({
      key: "pages.howManyClientsRetained.ZERO.text",
    });
    expect(
      vm.profitCostDetailsSummaryList?.rows[4].actions?.items.length,
    ).to.equal(1);
    expect(
      vm.profitCostDetailsSummaryList?.rows[4].actions?.items[0].text,
    ).to.deep.equal({ key: "common.change" });
    expect(
      vm.profitCostDetailsSummaryList?.rows[4].actions?.items[0].href,
    ).to.equal(`/claims/${claimId.toString()}/poa/how-many-clients-retained`);

    expect(vm.profitCostDetailsSummaryList?.rows[5].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.profitCostDetails.clientsStart",
    });
    expect(vm.profitCostDetailsSummaryList?.rows[5].value.text).to.deep.equal({
      key: "pages.howManyClientsRetained.TWO_OR_MORE.text",
    });
    expect(
      vm.profitCostDetailsSummaryList?.rows[5].actions?.items.length,
    ).to.equal(1);
    expect(
      vm.profitCostDetailsSummaryList?.rows[5].actions?.items[0].text,
    ).to.deep.equal({ key: "common.change" });
    expect(
      vm.profitCostDetailsSummaryList?.rows[5].actions?.items[0].href,
    ).to.equal(
      `/claims/${claimId.toString()}/poa/number-of-clients-start-of-case`,
    );

    expect(vm.profitCostDetailsSummaryList?.rows[6].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.profitCostDetails.attendedHearings",
    });
    expect(vm.profitCostDetailsSummaryList?.rows[6].value.text).to.deep.equal({
      key: "common.yes",
    });
    expect(
      vm.profitCostDetailsSummaryList?.rows[6].actions?.items.length,
    ).to.equal(1);
    expect(
      vm.profitCostDetailsSummaryList?.rows[6].actions?.items[0].text,
    ).to.deep.equal({ key: "common.change" });
    expect(
      vm.profitCostDetailsSummaryList?.rows[6].actions?.items[0].href,
    ).to.equal(`/claims/${claimId.toString()}/poa/multiple-client-hearings`);

    expect(vm.profitCostDetailsSummaryList?.rows[7].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.profitCostDetails.escapedStandardFixedFee",
    });
    expect(vm.profitCostDetailsSummaryList?.rows[7].value.text).to.deep.equal({
      key: "common.yes",
    });
    expect(
      vm.profitCostDetailsSummaryList?.rows[7].actions?.items.length,
    ).to.equal(1);
    expect(
      vm.profitCostDetailsSummaryList?.rows[7].actions?.items[0].text,
    ).to.deep.equal({ key: "common.change" });
    expect(
      vm.profitCostDetailsSummaryList?.rows[7].actions?.items[0].href,
    ).to.equal(`/claims/${claimId.toString()}/poa/escaping-standard-fixed-fee`);
  });

  it("builds the profit cost bill line summary list", () => {
    const claim: Claim = new Claim({
      ...claim9,
    });
    const claimId = claim.id;
    const vm = new CheckDetailsViewModel(claim);

    expect(vm.lineItemSummaryLists[0].card?.title.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.profitCostBillLine.title",
    });
    expect(vm.lineItemSummaryLists[0].card?.actions?.items.length).to.equal(1);
    expect(
      vm.lineItemSummaryLists[0].card?.actions?.items[0].text,
    ).to.deep.equal({ key: "common.change" });
    expect(vm.lineItemSummaryLists[0].card?.actions?.items[0].href).to.equal(
      `/claims/${claimId.toString()}/poa/cpgfs-profit-cost-bill-line`,
    );
    expect(vm.lineItemSummaryLists[0].attributes.id).to.equal(
      "profit-cost-bill-line-rows",
    );
    expect(vm.lineItemSummaryLists[0].rows.length).to.equal(5);

    expect(vm.lineItemSummaryLists[0].rows[0].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.profitCostBillLine.date",
    });
    expectLocalizedText(
      vm.lineItemSummaryLists[0].rows[0].value.text!,
      "29 July 2026",
    );
    expect(vm.lineItemSummaryLists[0].rows[0].actions).to.not.exist;

    expect(vm.lineItemSummaryLists[0].rows[1].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.profitCostBillLine.netProfitCost",
    });
    expect(vm.lineItemSummaryLists[0].rows[1].value.text).to.equal("£123.00");
    expect(vm.lineItemSummaryLists[0].rows[1].actions).to.not.exist;

    expect(vm.lineItemSummaryLists[0].rows[2].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.profitCostBillLine.netAdvocacyCost",
    });
    expect(vm.lineItemSummaryLists[0].rows[2].value.text).to.equal("£456.00");
    expect(vm.lineItemSummaryLists[0].rows[2].actions).to.not.exist;

    expect(vm.lineItemSummaryLists[0].rows[3].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.profitCostBillLine.doesVatApply",
    });
    expect(vm.lineItemSummaryLists[0].rows[3].value.text).to.deep.equal({
      key: "common.no",
    });
    expect(vm.lineItemSummaryLists[0].rows[3].actions).to.not.exist;

    expect(vm.lineItemSummaryLists[0].rows[4].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.profitCostBillLine.feeEarnerName",
    });
    expect(vm.lineItemSummaryLists[0].rows[4].value.text).to.equal(
      "John Smith",
    );
    expect(vm.lineItemSummaryLists[0].rows[4].actions).to.not.exist;
  });

  it("builds the evidence summary list", () => {
    const claim: Claim = new Claim({
      ...claim9,
    });
    const claimId = claim.id;
    const vm = new CheckDetailsViewModel(claim);

    expect(vm.evidenceSummaryList.card?.title.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.evidence.title",
    });
    expect(vm.evidenceSummaryList.card?.actions?.items.length).to.equal(1);
    expect(vm.evidenceSummaryList.attributes.id).to.equal("evidence-rows");
    expect(vm.evidenceSummaryList.rows.length).to.equal(1);
    expect(vm.evidenceSummaryList.card?.actions?.items[0].text).to.deep.equal({
      key: "common.change",
    });
    expect(vm.evidenceSummaryList.card?.actions?.items[0].href).to.equal(
      `/claims/${claimId.toString()}/poa/evidence-upload`,
    );

    expect(vm.evidenceSummaryList.rows[0].key.text).to.equal("evidence1.pdf");
    const value = vm.evidenceSummaryList.rows[0].value.html as Message;
    expect(value.key).to.equal("pages.poa.checkYourDetails.cya.evidence.value");
    expect(value.args?.["fileSize"]).to.equal("1KB");
    expectLocalizedText(value.args?.["submittedOn"]!, "17 June 2026");
    expect(vm.evidenceSummaryList.rows[0].actions).to.not.exist;
  });

  it("builds the expert cost bill line summary lists", () => {
    const claim: Claim = new Claim({
      ...claim11,
    });
    const claimId = claim.id;
    const vm = new CheckDetailsViewModel(claim);

    expect(vm.lineItemSummaryLists).to.have.length(2);

    const firstSummaryList = vm.lineItemSummaryLists[0];
    const secondSummaryList = vm.lineItemSummaryLists[1];

    expect(firstSummaryList.card?.title.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.expertCostBillLine.title",
    });

    expect(firstSummaryList.card?.actions?.items).to.have.length(2);
    expect(firstSummaryList.card?.actions?.items[0].text).to.deep.equal({
      key: "common.delete",
    });
    expect(firstSummaryList.card?.actions?.items[0].href).to.equal(
      `/claims/${claimId.toString()}/poa/expert-cost-details/019fae76-e8a7-73bc-af8d-990543ec4a65/remove`,
    );
    expect(firstSummaryList.card?.actions?.items[1].text).to.deep.equal({
      key: "common.change",
    });
    expect(firstSummaryList.card?.actions?.items[1].href).to.equal(
      `/claims/${claimId.toString()}/poa/expert-cost-details?lineItemId=019fae76-e8a7-73bc-af8d-990543ec4a65`,
    );

    expect(firstSummaryList.attributes.id).to.equal(
      "expert-cost-bill-line-1-rows",
    );

    expect(firstSummaryList.rows).to.have.length(5);

    expect(firstSummaryList.rows[0].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.expertCostBillLine.date",
    });
    expectLocalizedText(
      firstSummaryList.rows[0].value.text!,
      "20 December 2023",
    );

    expect(firstSummaryList.rows[1].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.expertCostBillLine.actualNetValue",
    });
    expect(firstSummaryList.rows[1].value.text).to.equal("£150.00");

    expect(firstSummaryList.rows[2].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.expertCostBillLine.doesVatApply",
    });
    expect(firstSummaryList.rows[2].value.text).to.deep.equal({
      key: "common.yes",
    });

    expect(firstSummaryList.rows[3].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.expertCostBillLine.feeEarnerName",
    });
    expect(firstSummaryList.rows[3].value.text).to.equal("Carol Spencer");

    expect(firstSummaryList.rows[4].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.expertCostBillLine.description",
    });
    expect(firstSummaryList.rows[4].value.text).to.equal("Cost of petrol");

    expect(secondSummaryList.card?.title.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.expertCostBillLine.title",
    });

    expect(secondSummaryList.card?.actions?.items).to.have.length(2);
    expect(secondSummaryList.card?.actions?.items[0].text).to.deep.equal({
      key: "common.delete",
    });
    expect(secondSummaryList.card?.actions?.items[0].href).to.equal(
      `/claims/${claimId.toString()}/poa/expert-cost-details/019fae77-87c3-734c-a38d-54624d48d7e5/remove`,
    );
    expect(secondSummaryList.card?.actions?.items[1].text).to.deep.equal({
      key: "common.change",
    });
    expect(secondSummaryList.card?.actions?.items[1].href).to.equal(
      `/claims/${claimId.toString()}/poa/expert-cost-details?lineItemId=019fae77-87c3-734c-a38d-54624d48d7e5`,
    );

    expect(secondSummaryList.attributes.id).to.equal(
      "expert-cost-bill-line-2-rows",
    );

    expect(secondSummaryList.rows).to.have.length(5);

    expect(secondSummaryList.rows[0].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.expertCostBillLine.date",
    });
    expectLocalizedText(secondSummaryList.rows[0].value.text!, "30 July 2026");

    expect(secondSummaryList.rows[1].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.expertCostBillLine.actualNetValue",
    });
    expect(secondSummaryList.rows[1].value.text).to.equal("£456.00");

    expect(secondSummaryList.rows[2].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.expertCostBillLine.doesVatApply",
    });
    expect(secondSummaryList.rows[2].value.text).to.deep.equal({
      key: "common.yes",
    });

    expect(secondSummaryList.rows[3].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.expertCostBillLine.feeEarnerName",
    });
    expect(secondSummaryList.rows[3].value.text).to.equal("Joe Bloggs");

    expect(secondSummaryList.rows[4].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.expertCostBillLine.description",
    });
    expect(secondSummaryList.rows[4].value.text).to.equal("Line item 2");
  });
});
