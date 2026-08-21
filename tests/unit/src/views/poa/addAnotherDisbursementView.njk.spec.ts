import { config as chaiConfig, expect } from "chai";
import { CheerioAPI } from "cheerio";
import { renderView } from "#tests/unit/src/views/base/renderView.js";
import { V7Generator } from "uuidv7";
import {
  AddAnotherDisbursementViewModel,
  AddAnotherDisbursementViewModelParams,
} from "#src/viewmodels/poa/addAnotherLineItemViewModel.js";
import { Category } from "#src/types/Claim.js";
import { LocalDate } from "#src/types/date.js";
import { BooleanField } from "#src/helpers/fields.js";
import { YesNoQuestionForm } from "#src/helpers/radioQuestionValidation.js";

chaiConfig.truncateThreshold = 0;

describe("views/main/poa/addAnotherDisbursementView.njk", () => {
  let $: CheerioAPI;

  const claimId = new V7Generator().generate();
  const lineItemId = new V7Generator().generate();

  const field = new BooleanField("prefix", "name", "id");

  const form = new YesNoQuestionForm(field);

  const params: AddAnotherDisbursementViewModelParams = {
    claimId: claimId.toString(),
    lineItems: [
      {
        id: lineItemId.toString(),
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
    ],
    form,
  };

  const viewModel = new AddAnotherDisbursementViewModel(params);

  beforeEach(async () => {
    $ = await renderView("main/poa/addAnotherDisbursementView.njk", {
      vm: viewModel,
    });
  });

  it("renders a Back link", () => {
    const back = $("a.govuk-back-link");

    expect(back).to.have.length(1);
    expect(back.text().trim()).to.equal("common.back");
    expect(back.attr("href")).to.equal("#");
  });

  it("renders an h1", () => {
    const h1s = $("#main-content h1");
    expect(h1s).to.have.length(1);
    const h1 = h1s.first();
    expect(h1.text().trim()).to.equal("prefix.title.singular");
  });

  it("renders a GOV.UK summary list", () => {
    const sl = $(".govuk-summary-list");
    expect(sl).to.have.length(1);
  });

  it("renders a yes/no input", () => {
    const yesInput = $("#main-content .govuk-radios__input#id");
    expect(yesInput).to.have.length(1);
    const noInput = $("#main-content .govuk-radios__input#id-2");
    expect(noInput).to.have.length(1);
  });

  it("renders a Save and continue button", () => {
    const buttons = $(".govuk-button");
    const button = buttons.first();
    expect(button.text().trim()).to.equal("common.saveAndContinue");
  });
});