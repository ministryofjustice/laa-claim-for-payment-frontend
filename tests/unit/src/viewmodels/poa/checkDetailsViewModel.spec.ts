import { expect } from "chai";
import type { Claim } from "#src/types/Claim.js";
import { getClaimsSuccessResponseData } from "#tests/assets/getClaimsResponseData.js";
import { CheckDetailsViewModel } from "#src/viewmodels/poa/checkDetailsViewModel.js";

describe("CheckDetailsViewModel constructor()", () => {
  it("builds the assessment summary table", () => {
    const claim: Claim = getClaimsSuccessResponseData.body!.data![0]!;
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
    const claim: Claim = getClaimsSuccessResponseData.body!.data![0]!;
    const vm = new CheckDetailsViewModel(claim);

    expect(vm.profitCostDetailsSummaryList.card?.title.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.profitCostDetails.title",
    });
    expect(vm.profitCostDetailsSummaryList.card?.actions).to.not.exist;
    expect(vm.profitCostDetailsSummaryList.attributes.id).to.equal(
      "profit-cost-details-rows",
    );
    expect(vm.profitCostDetailsSummaryList.rows.length).to.equal(7);

    expect(vm.profitCostDetailsSummaryList.rows[0].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.profitCostDetails.courtType",
    });
    expect(vm.profitCostDetailsSummaryList.rows[0].value.text).to.equal(
      "Circuit/district judge",
    );
    expect(
      vm.profitCostDetailsSummaryList.rows[0].actions?.items.length,
    ).to.equal(1);
    expect(
      vm.profitCostDetailsSummaryList.rows[0].actions?.items[0].text,
    ).to.deep.equal({ key: "common.change" });
    expect(
      vm.profitCostDetailsSummaryList.rows[0].actions?.items[0].href,
    ).to.equal("/claims/1/poa/profit-cost-details#courtTypeChoice");

    expect(vm.profitCostDetailsSummaryList.rows[1].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.profitCostDetails.clientPartyStatus",
    });
    expect(vm.profitCostDetailsSummaryList.rows[1].value.text).to.equal(
      "Child",
    );
    expect(
      vm.profitCostDetailsSummaryList.rows[1].actions?.items.length,
    ).to.equal(1);
    expect(
      vm.profitCostDetailsSummaryList.rows[1].actions?.items[0].text,
    ).to.deep.equal({ key: "common.change" });
    expect(
      vm.profitCostDetailsSummaryList.rows[1].actions?.items[0].href,
    ).to.equal("/claims/1/poa/profit-cost-details#clientStatusChoice");

    expect(vm.profitCostDetailsSummaryList.rows[2].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.profitCostDetails.firstSolicitor",
    });
    expect(vm.profitCostDetailsSummaryList.rows[2].value.text).to.equal("Yes");
    expect(
      vm.profitCostDetailsSummaryList.rows[2].actions?.items.length,
    ).to.equal(1);
    expect(
      vm.profitCostDetailsSummaryList.rows[2].actions?.items[0].text,
    ).to.deep.equal({ key: "common.change" });
    expect(
      vm.profitCostDetailsSummaryList.rows[2].actions?.items[0].href,
    ).to.equal("/claims/1/poa/profit-cost-details#firstSolicitorChoice");

    expect(vm.profitCostDetailsSummaryList.rows[3].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.profitCostDetails.transferOfSolicitor",
    });
    expect(vm.profitCostDetailsSummaryList.rows[3].value.text).to.equal("Yes");
    expect(
      vm.profitCostDetailsSummaryList.rows[3].actions?.items.length,
    ).to.equal(1);
    expect(
      vm.profitCostDetailsSummaryList.rows[3].actions?.items[0].text,
    ).to.deep.equal({ key: "common.change" });
    expect(
      vm.profitCostDetailsSummaryList.rows[3].actions?.items[0].href,
    ).to.equal("/claims/1/poa/profit-cost-details#transferOfSolicitorChoice");

    expect(vm.profitCostDetailsSummaryList.rows[4].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.profitCostDetails.clientsRetained",
    });
    expect(vm.profitCostDetailsSummaryList.rows[4].value.text).to.equal("1");
    expect(
      vm.profitCostDetailsSummaryList.rows[4].actions?.items.length,
    ).to.equal(1);
    expect(
      vm.profitCostDetailsSummaryList.rows[4].actions?.items[0].text,
    ).to.deep.equal({ key: "common.change" });
    expect(
      vm.profitCostDetailsSummaryList.rows[4].actions?.items[0].href,
    ).to.equal("/claims/1/poa/how-many-clients-retained");

    expect(vm.profitCostDetailsSummaryList.rows[5].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.profitCostDetails.attendedHearings",
    });
    expect(vm.profitCostDetailsSummaryList.rows[5].value.text).to.equal("Yes");
    expect(
      vm.profitCostDetailsSummaryList.rows[5].actions?.items.length,
    ).to.equal(1);
    expect(
      vm.profitCostDetailsSummaryList.rows[5].actions?.items[0].text,
    ).to.deep.equal({ key: "common.change" });
    expect(
      vm.profitCostDetailsSummaryList.rows[5].actions?.items[0].href,
    ).to.equal("/claims/1/poa/multiple-client-hearings");

    expect(vm.profitCostDetailsSummaryList.rows[6].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.profitCostDetails.escapedStandardFixedFee",
    });
    expect(vm.profitCostDetailsSummaryList.rows[6].value.text).to.equal("No");
    expect(
      vm.profitCostDetailsSummaryList.rows[6].actions?.items.length,
    ).to.equal(1);
    expect(
      vm.profitCostDetailsSummaryList.rows[6].actions?.items[0].text,
    ).to.deep.equal({ key: "common.change" });
    expect(
      vm.profitCostDetailsSummaryList.rows[6].actions?.items[0].href,
    ).to.equal("/claims/1/poa/escaping-standard-fixed-fee");
  });

  it("builds the profit cost bill line summary list", () => {
    const claim: Claim = getClaimsSuccessResponseData.body!.data![0]!;
    const vm = new CheckDetailsViewModel(claim);

    expect(vm.profitCostBillLineSummaryList.card?.title.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.profitCostBillLine.title",
    });
    expect(
      vm.profitCostBillLineSummaryList.card?.actions?.items.length,
    ).to.equal(1);
    expect(
      vm.profitCostBillLineSummaryList.card?.actions?.items[0].text
    ).to.deep.equal({ key: "common.change" });
    expect(
      vm.profitCostBillLineSummaryList.card?.actions?.items[0].href
    ).to.equal("/claims/1/poa/cpgfs-profit-cost-bill-line");
    expect(vm.profitCostBillLineSummaryList.attributes.id).to.equal(
      "profit-cost-bill-line-rows",
    );
    expect(vm.profitCostBillLineSummaryList.rows.length).to.equal(5);

    expect(vm.profitCostBillLineSummaryList.rows[0].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.profitCostBillLine.date",
    });
    expect(vm.profitCostBillLineSummaryList.rows[0].value.text).to.equal(
      "20 December 2023",
    );
    expect(vm.profitCostBillLineSummaryList.rows[0].actions).to.not.exist;

    expect(vm.profitCostBillLineSummaryList.rows[1].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.profitCostBillLine.netProfitCost",
    });
    expect(vm.profitCostBillLineSummaryList.rows[1].value.text).to.equal(
      "£150",
    );
    expect(vm.profitCostBillLineSummaryList.rows[1].actions).to.not.exist;

    expect(vm.profitCostBillLineSummaryList.rows[2].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.profitCostBillLine.netAdvocacyCost",
    });
    expect(vm.profitCostBillLineSummaryList.rows[2].value.text).to.equal(
      "£150",
    );
    expect(vm.profitCostBillLineSummaryList.rows[2].actions).to.not.exist;

    expect(vm.profitCostBillLineSummaryList.rows[3].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.profitCostBillLine.doesVatApply",
    });
    expect(vm.profitCostBillLineSummaryList.rows[3].value.text).to.equal("Yes");
    expect(vm.profitCostBillLineSummaryList.rows[3].actions).to.not.exist;

    expect(vm.profitCostBillLineSummaryList.rows[4].key.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.profitCostBillLine.feeEarnerName",
    });
    expect(vm.profitCostBillLineSummaryList.rows[4].value.text).to.equal(
      "Carol Spencer",
    );
    expect(vm.profitCostBillLineSummaryList.rows[4].actions).to.not.exist;
  });

  it("builds the evidence summary list", () => {
    const claim: Claim = getClaimsSuccessResponseData.body!.data![0]!;
    const vm = new CheckDetailsViewModel(claim);

    expect(vm.evidenceSummaryList.card?.title.text).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.evidence.title",
    });
    expect(vm.evidenceSummaryList.card?.actions?.items.length).to.equal(1);
    expect(vm.evidenceSummaryList.attributes.id).to.equal("evidence-rows");
    expect(vm.evidenceSummaryList.rows.length).to.equal(1);
    expect(
      vm.evidenceSummaryList.card?.actions?.items[0].text
    ).to.deep.equal({ key: "common.change" });
    expect(
      vm.evidenceSummaryList.card?.actions?.items[0].href
    ).to.equal("#");

    expect(vm.evidenceSummaryList.rows[0].key.text).to.equal("evidence1.pdf");
    expect(vm.evidenceSummaryList.rows[0].value.html).to.deep.equal({
      key: "pages.poa.checkYourDetails.cya.evidence.value",
      args: { fileSize: "1KB", submittedOn: "17 June 2026" },
    });
    expect(vm.evidenceSummaryList.rows[0].actions).to.not.exist;
  });
});