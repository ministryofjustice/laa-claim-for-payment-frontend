import { expect } from "chai";
import { ProfitCostDetailsViewModel } from "#src/viewmodels/poa/profitCostDetailsViewModel.js";
import { ProfitCostDetailsForm } from "#src/helpers/profitCostDetailsValidation.js";

describe("ProfitCostDetailsViewModel", () => {
  describe("court type field", () => {
    it("creates the form field name for court type", () => {
      const vm = new ProfitCostDetailsViewModel();

      expect(vm.form.courtType.fieldName).to.equal("courtTypeChoice");
    });

    it("creates the radio choices for court type", () => {
      const vm = new ProfitCostDetailsViewModel();

      expect(vm.form.courtType.choices).to.have.length(4);
    });

    it("marks the selected choice as checked", () => {
      const form: ProfitCostDetailsForm = {
        courtTypeChoice: "high-court",
      };
      const vm = new ProfitCostDetailsViewModel({
        form: form,
      });

      const selected = vm.form.courtType.choices.find(
        (c: any) => c.value === "high-court",
      );

      expect(selected?.checked).to.be.true;
    });

    it("adds an error when provided", () => {
      const vm = new ProfitCostDetailsViewModel({
        errors: [
          {
            fieldName: "courtTypeChoice",
            text: {
              key: "error.key",
            },
            href: "#courtTypeChoice",
          },
        ],
      });

      expect(vm.errorSummary.errorList).to.have.length(1);
      expect(vm.errorSummary.errorList[0].text).to.deep.equal({
        key: "error.key",
      });
      expect(vm.errorSummary.errorList[0].href).to.equal("#courtTypeChoice");
    });
  });

  describe("client status field", () => {
    it("creates the form field name for client status", () => {
      const vm = new ProfitCostDetailsViewModel();

      expect(vm.form.clientStatus.fieldName).to.equal("clientStatusChoice");
    });

    it("creates the radio choices for client status", () => {
      const vm = new ProfitCostDetailsViewModel();

      expect(vm.form.clientStatus.choices).to.have.length(3);
    });

    it("marks the selected choice as checked", () => {
      const form: ProfitCostDetailsForm = {
        clientStatusChoice: "child",
      };
      const vm = new ProfitCostDetailsViewModel({
        form: form,
      });

      const selected = vm.form.clientStatus.choices.find(
        (c: any) => c.value === "child",
      );

      expect(selected?.checked).to.be.true;
    });

    it("adds an error when provided", () => {
      const vm = new ProfitCostDetailsViewModel({
        errors: [
          {
            fieldName: "clientStatusChoice",
            text: {
              key: "error.key",
            },
            href: "#clientStatusChoice",
          },
        ],
      });

      expect(vm.errorSummary.errorList).to.have.length(1);
      expect(vm.errorSummary.errorList[0].text).to.deep.equal({
        key: "error.key",
      });
      expect(vm.errorSummary.errorList[0].href).to.equal("#clientStatusChoice");
    });
  });

  describe("first solicitor field", () => {
    it("creates the form field name for first solicitor", () => {
      const vm = new ProfitCostDetailsViewModel();

      expect(vm.form.firstSolicitor.fieldName).to.equal("firstSolicitorChoice");
    });

    it("creates the radio choices for first solicitor", () => {
      const vm = new ProfitCostDetailsViewModel();

      expect(vm.form.firstSolicitor.choices).to.have.length(2);
    });

    it("marks the selected choice as checked", () => {
      const form: ProfitCostDetailsForm = {
        firstSolicitorChoice: "yes",
      };
      const vm = new ProfitCostDetailsViewModel({
        form: form,
      });

      const selected = vm.form.firstSolicitor.choices.find(
        (c: any) => c.value === "yes",
      );

      expect(selected?.checked).to.be.true;
    });

    it("adds an error when provided", () => {
      const vm = new ProfitCostDetailsViewModel({
        errors: [
          {
            fieldName: "firstSolicitorChoice",
            text: {
              key: "error.key",
            },
            href: "#firstSolicitorChoice",
          },
        ],
      });

      expect(vm.errorSummary.errorList).to.have.length(1);
      expect(vm.errorSummary.errorList[0].text).to.deep.equal({
        key: "error.key",
      });
      expect(vm.errorSummary.errorList[0].href).to.equal(
        "#firstSolicitorChoice",
      );
    });
  });

  describe("transfer of solicitor field", () => {
    it("creates the form field name for transfer of solicitor", () => {
      const vm = new ProfitCostDetailsViewModel();

      expect(vm.form.transferOfSolicitor.fieldName).to.equal(
        "transferOfSolicitorChoice",
      );
    });

    it("creates the radio choices for transfer of solicitor", () => {
      const vm = new ProfitCostDetailsViewModel();

      expect(vm.form.transferOfSolicitor.choices).to.have.length(2);
    });

    it("marks the selected choice as checked", () => {
      const form: ProfitCostDetailsForm = {
        transferOfSolicitorChoice: "yes",
      };
      const vm = new ProfitCostDetailsViewModel({
        form: form,
      });

      const selected = vm.form.transferOfSolicitor.choices.find(
        (c: any) => c.value === "yes",
      );

      expect(selected?.checked).to.be.true;
    });
    it("adds an error when provided", () => {
      const vm = new ProfitCostDetailsViewModel({
        errors: [
          {
            fieldName: "transferOfSolicitorChoice",
            text: {
              key: "error.key",
            },
            href: "#transferOfSolicitorChoice",
          },
        ],
      });

      expect(vm.errorSummary.errorList).to.have.length(1);
      expect(vm.errorSummary.errorList[0].text).to.deep.equal({
        key: "error.key",
      });
      expect(vm.errorSummary.errorList[0].href).to.equal(
        "#transferOfSolicitorChoice",
      );
    });
  });

  it("adds multiple errors to the error list", () => {
    const vm = new ProfitCostDetailsViewModel({
      errors: [
        {
          fieldName: "court",
          href: "#",
          text: {
            key: "court.error",
          },
        },
        {
          fieldName: "client",
          href: "#",
          text: {
            key: "client.error",
          },
        },
      ],
    });

    expect(vm.errorSummary.errorList).to.have.length(2);

    expect(vm.errorSummary.errorList[0].text).to.deep.equal({
      key: "court.error",
    });
    expect(vm.errorSummary.errorList[1].text).to.deep.equal({
      key: "client.error",
    });
  });
});
