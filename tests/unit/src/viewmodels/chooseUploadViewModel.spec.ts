/**
 * @description Tests for the choose file upload view model
 */

import { ChooseUploadViewModel, fileUploadFieldName, isValidFileUploadChoice } from "#src/viewmodels/chooseUploadViewModel.js";
import { expect } from "chai";

describe("chooseFileUploadViewModel()", () => {
  it("creates the form field name", () => {
    const viewModel = new ChooseUploadViewModel();

    expect(viewModel.form.fieldName).to.equal(fileUploadFieldName);
    expect(viewModel.form.fieldName).to.equal("fileUploadChoice");
  });

  it("creates the radio choices", () => {
    const viewModel = new ChooseUploadViewModel();

    expect(viewModel.form.choices).to.have.length(2);

    expect(viewModel.form.choices[0].value).to.equal("all-at-once");
    expect(viewModel.form.choices[0].text).to.equal("pages.chooseUpload.allAtOnce.text");
    expect(viewModel.form.choices[0].hint.text).to.equal("pages.chooseUpload.allAtOnce.hint");
    expect(viewModel.form.choices[0].checked).to.equal(false);

    expect(viewModel.form.choices[1].value).to.equal("associated-to-line-items");
    expect(viewModel.form.choices[1].text).to.equal("pages.chooseUpload.associatedToLineItems.text");
    expect(viewModel.form.choices[1].hint.text).to.equal("pages.chooseUpload.associatedToLineItems.hint");
    expect(viewModel.form.choices[1].checked).to.equal(false);
  });

  it("marks the selected choice as checked", () => {
    const viewModel = new ChooseUploadViewModel({
      selectedValue: "associated-to-line-items",
    });

    expect(viewModel.form.choices[0].checked).to.equal(false);
    expect(viewModel.form.choices[1].checked).to.equal(true);
  });

  it("adds an error when provided", () => {
    const viewModel = new ChooseUploadViewModel({
      error: {
        text: "pages.chooseUpload.error.empty",
      },
    });

    expect(viewModel.form.error?.text).to.equal("pages.chooseUpload.error.empty");
  });
});

describe("isValidFileUploadChoice()", () => {
  it("returns true for valid choices", () => {
    expect(isValidFileUploadChoice("all-at-once")).to.equal(true);
    expect(isValidFileUploadChoice("associated-to-line-items")).to.equal(true);
  });

  it("returns false for invalid choices", () => {
    expect(isValidFileUploadChoice(undefined)).to.equal(false);
    expect(isValidFileUploadChoice("")).to.equal(false);
    expect(isValidFileUploadChoice("invalid")).to.equal(false);
  });
});