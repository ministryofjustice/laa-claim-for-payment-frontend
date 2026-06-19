import { expect } from "chai";
import {
  isValidClientStatusChoice,
  isValidCourtTypeChoice,
  ProfitCostDetailsViewModel,
} from "#src/viewmodels/profitCostDetails/profitCostDetailsViewModel.js";

describe("ProfitCostDetailsViewModel", () => {
  describe("court type field", () => {
    it("creates the form field name for court type", () => {
      const vm = new ProfitCostDetailsViewModel();

      expect(vm.form.courtTypeFieldName).to.equal("courtTypeChoice");
    });

    it("creates the radio choices for court type", () => {
      const vm = new ProfitCostDetailsViewModel();

      expect(vm.form.courtTypeChoices).to.have.length(4);
    });

    it("marks the selected choice as checked", () => {
      const vm = new ProfitCostDetailsViewModel({
        courtTypeSelectedValue: "high-court",
      });

      const selected = vm.form.courtTypeChoices.find(
        (c: any) => c.value === "high-court",
      );

      expect(selected?.checked).to.be.true;
    });

    it("adds an error when provided", () => {
      const vm = new ProfitCostDetailsViewModel({
        error: {
          courtTypeError: { text: "error.key" },
        },
      });

      expect(vm.errorList).to.have.length(1);
      expect(vm.errorList[0].text).to.equal("error.key");
      expect(vm.errorList[0].href).to.equal("#courtTypeChoice");
    });
  });

  describe("client status field", () => {
    it("creates the form field name for client status", () => {
      const vm = new ProfitCostDetailsViewModel();

      expect(vm.form.clientStatusFieldName).to.equal("clientStatusChoice");
    });

    it("creates the radio choices for client status", () => {
      const vm = new ProfitCostDetailsViewModel();

      expect(vm.form.clientStatusChoices).to.have.length(3);
    });

    it("marks the selected choice as checked", () => {
      const vm = new ProfitCostDetailsViewModel({
        clientStatusSelectedValue: "child",
      });

      const selected = vm.form.clientStatusChoices.find(
        (c: any) => c.value === "child",
      );

      expect(selected?.checked).to.be.true;
    });

    it("adds an error when provided", () => {
      const vm = new ProfitCostDetailsViewModel({
        error: {
          clientStatusError: { text: "error.key" },
        },
      });

      expect(vm.errorList).to.have.length(1);
      expect(vm.errorList[0].text).to.equal("error.key");
      expect(vm.errorList[0].href).to.equal("#clientStatusChoice");
    });
  });

  describe("first solicitor field", () => {
    it("creates the form field name for first solicitor", () => {
      const vm = new ProfitCostDetailsViewModel();

      expect(vm.form.firstSolicitorFieldName).to.equal("firstSolicitorChoice");
    });

    it("creates the radio choices for first solicitor", () => {
      const vm = new ProfitCostDetailsViewModel();

      expect(vm.form.firstSolicitorChoices).to.have.length(2);
    });

    it("marks the selected choice as checked", () => {
      const vm = new ProfitCostDetailsViewModel({
        firstSolicitorSelectedValue: "yes",
      });

      const selected = vm.form.firstSolicitorChoices.find(
        (c: any) => c.value === "yes",
      );

      expect(selected?.checked).to.be.true;
    });

    it("adds an error when provided", () => {
      const vm = new ProfitCostDetailsViewModel({
        error: {
          firstSolicitorError: { text: "error.key" },
        },
      });

      expect(vm.errorList).to.have.length(1);
      expect(vm.errorList[0].text).to.equal("error.key");
      expect(vm.errorList[0].href).to.equal("#firstSolicitorChoice");
    });
  });

  describe("transfer of solicitor field", () => {
    it("creates the form field name for transfer of solicitor", () => {
      const vm = new ProfitCostDetailsViewModel();

      expect(vm.form.transferOfSolicitorFieldName).to.equal(
        "transferOfSolicitorChoice",
      );
    });

    it("creates the radio choices for transfer of solicitor", () => {
      const vm = new ProfitCostDetailsViewModel();

      expect(vm.form.transferOfSolicitorChoices).to.have.length(2);
    });

    it("marks the selected choice as checked", () => {
      const vm = new ProfitCostDetailsViewModel({
        transferOfSolicitorSelectedValue: "yes",
      });

      const selected = vm.form.transferOfSolicitorChoices.find(
        (c: any) => c.value === "yes",
      );

      expect(selected?.checked).to.be.true;
    });
    it("adds an error when provided", () => {
      const vm = new ProfitCostDetailsViewModel({
        error: {
          transferOfSolicitorError: { text: "error.key" },
        },
      });

      expect(vm.errorList).to.have.length(1);
      expect(vm.errorList[0].text).to.equal("error.key");
      expect(vm.errorList[0].href).to.equal("#transferOfSolicitorChoice");
    });
  });

  it("adds multiple errors to the error list", () => {
    const vm = new ProfitCostDetailsViewModel({
      error: {
        courtTypeError: { text: "court.error" },
        clientStatusError: { text: "client.error" },
      },
    });

    expect(vm.errorList).to.have.length(2);

    expect(vm.errorList[0].text).to.equal("court.error");
    expect(vm.errorList[1].text).to.equal("client.error");
  });

  describe("isValidCourtTypeChoice()", () => {
    it("returns true for valid choices", () => {
      expect(isValidCourtTypeChoice("county-court")).to.equal(true);
      expect(isValidCourtTypeChoice("high-court")).to.equal(true);
      expect(isValidCourtTypeChoice("magistrates-court")).to.equal(true);
      expect(isValidCourtTypeChoice("other-judge")).to.equal(true);
    });

    it("returns false for invalid choices", () => {
      expect(isValidCourtTypeChoice(undefined)).to.equal(false);
      expect(isValidCourtTypeChoice("")).to.equal(false);
      expect(isValidCourtTypeChoice("invalid")).to.equal(false);
    });
  });

  describe("isValidClientStatusChoice()", () => {
    it("returns true for valid choices", () => {
      expect(isValidClientStatusChoice("child")).to.equal(true);
      expect(isValidClientStatusChoice("joined-party")).to.equal(true);
      expect(isValidClientStatusChoice("parent")).to.equal(true);
    });

    it("returns false for invalid choices", () => {
      expect(isValidClientStatusChoice(undefined)).to.equal(false);
      expect(isValidClientStatusChoice("")).to.equal(false);
      expect(isValidClientStatusChoice("invalid")).to.equal(false);
    });
  });
});
