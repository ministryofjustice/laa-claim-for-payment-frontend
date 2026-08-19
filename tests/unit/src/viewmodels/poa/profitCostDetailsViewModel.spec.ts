import { expect } from "chai";
import {
  ProfitCostDetailsViewModel,
  ProfitCostDetailsViewModelParams,
} from "#src/viewmodels/poa/profitCostDetailsViewModel.js";
import {
  buildProfitCostDetailsForm,
  validateProfitCostDetails,
} from "#src/helpers/profitCostDetailsValidation.js";
import { ClientPartyStatus, CourtType } from "#src/types/Claim.js";

describe("ProfitCostDetailsViewModel", () => {
  it("constructs view model when empty form", () => {
    const form = buildProfitCostDetailsForm(undefined);

    const params: ProfitCostDetailsViewModelParams = { form };

    const result = new ProfitCostDetailsViewModel(params);

    expect(result.courtTypeRadios.items[0].checked).to.equal(false);
    expect(result.courtTypeRadios.items[1].checked).to.equal(false);
    expect(result.courtTypeRadios.items[2].checked).to.equal(false);
    expect(result.courtTypeRadios.items[3].checked).to.equal(false);

    expect(result.clientStatusRadios.items[0].checked).to.equal(false);
    expect(result.clientStatusRadios.items[1].checked).to.equal(false);
    expect(result.clientStatusRadios.items[2].checked).to.equal(false);

    expect(result.firstSolicitorRadios.items[0].checked).to.equal(false);
    expect(result.firstSolicitorRadios.items[1].checked).to.equal(false);

    expect(result.transferOfSolicitorRadios.items[0].checked).to.equal(false);
    expect(result.transferOfSolicitorRadios.items[1].checked).to.equal(false);
  });

  it("constructs view model when populated form", () => {
    const form = buildProfitCostDetailsForm({
      courtType: CourtType.COUNTY_COURT,
      clientStatus: ClientPartyStatus.CHILD,
      firstSolicitor: true,
      transferOfSolicitor: true,
    });

    const params: ProfitCostDetailsViewModelParams = { form };

    const result = new ProfitCostDetailsViewModel(params);

    expect(result.courtTypeRadios.items[0].checked).to.equal(true);
    expect(result.courtTypeRadios.items[1].checked).to.equal(false);
    expect(result.courtTypeRadios.items[2].checked).to.equal(false);
    expect(result.courtTypeRadios.items[3].checked).to.equal(false);

    expect(result.clientStatusRadios.items[0].checked).to.equal(true);
    expect(result.clientStatusRadios.items[1].checked).to.equal(false);
    expect(result.clientStatusRadios.items[2].checked).to.equal(false);

    expect(result.firstSolicitorRadios.items[0].checked).to.equal(true);
    expect(result.firstSolicitorRadios.items[1].checked).to.equal(false);

    expect(result.transferOfSolicitorRadios.items[0].checked).to.equal(true);
    expect(result.transferOfSolicitorRadios.items[1].checked).to.equal(false);
  });

  it("constructs view model when form has errors", () => {
    const form = validateProfitCostDetails({
      courtTypeChoice: "",
      clientStatusChoice: "",
      firstSolicitorChoice: "",
      transferOfSolicitorChoice: "",
    });

    const params: ProfitCostDetailsViewModelParams = { form };

    const result = new ProfitCostDetailsViewModel(params);

    expect(result.errorSummary?.errorList).to.have.length(4);
  });
});
