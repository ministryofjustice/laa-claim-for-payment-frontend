/**
 * @description Tests for the choose file upload view model
 */


import { isValidChoice, RadioQuestionViewModel } from "#src/viewmodels/radioQuestionViewModel.js";
import { expect } from "chai";

const testFieldName = "test" as const;

  const TestChoice = {
    First: "first",
    Second: "second",
  } as const;

  type TestChoice =
    (typeof TestChoice)[keyof typeof TestChoice];

  const testChoices = [
    {
      value: TestChoice.First,
      text: "first text",
    },
      {
      value: TestChoice.Second,
      text: "second text",
    },
  ] as const;

describe("radioQuestionViewModel()", () => {

  it("creates the form field name", () => {
    const viewModel = new RadioQuestionViewModel({
      title: "test title",
      fieldName: testFieldName,
      choices: testChoices
    });

    expect(viewModel.form.fieldName).to.equal(testFieldName);
    expect(viewModel.form.fieldName).to.equal("test");
  });

  it("creates the radio choices", () => {
    const viewModel = new RadioQuestionViewModel({
      title: "test title",
      fieldName: testFieldName,
      choices: testChoices
    });

    expect(viewModel.form.choices).to.have.length(2);

    expect(viewModel.form.choices[0].value).to.equal("first");
    expect(viewModel.form.choices[0].text).to.equal("first text");
    expect(viewModel.form.choices[0].checked).to.equal(false);

    expect(viewModel.form.choices[1].value).to.equal("second");
    expect(viewModel.form.choices[1].text).to.equal("second text");
    expect(viewModel.form.choices[1].checked).to.equal(false);
  });

  it("creates the radio choices with hints", () => {
    const testChoices = [
      {
        value: TestChoice.First,
        text: "first text",
        hint: {
          text: "hint 1"
        }
      },
        {
        value: TestChoice.Second,
        text: "second text",
        hint: {
          text: "hint 2"
        }
      },
    ] as const;

    const viewModel = new RadioQuestionViewModel({
      title: "test title",
      fieldName: testFieldName,
      choices: testChoices
    });


    expect(viewModel.form.choices[0].hint?.text).to.equal("hint 1");
    expect(viewModel.form.choices[1].hint?.text).to.equal("hint 2");
  });

  it("marks the selected choice as checked", () => {
    const viewModel = new RadioQuestionViewModel({
      title: "test title",
      fieldName: testFieldName,
      choices: testChoices,
      selectedValue: TestChoice.Second,
    });

    expect(viewModel.form.choices[0].checked).to.equal(false);
    expect(viewModel.form.choices[1].checked).to.equal(true);
  });

  it("adds an error when provided", () => {
    const viewModel = new RadioQuestionViewModel({
      title: "test title",
      fieldName: testFieldName,
      choices: testChoices,
      selectedValue: TestChoice.First,
      error: {
        text: "some.error.empty",
      },
    });

    expect(viewModel.form.error?.text).to.equal("some.error.empty");
  });
});

describe("isValidChoice()", () => {
  it("returns true for valid choices", () => {
    expect(isValidChoice(testChoices, "first")).to.equal(true);
    expect(isValidChoice(testChoices, "second")).to.equal(true);
  });

  it("returns false for invalid choices", () => {
    expect(isValidChoice(testChoices, undefined)).to.equal(false);
    expect(isValidChoice(testChoices, "")).to.equal(false);
    expect(isValidChoice(testChoices, "invalid")).to.equal(false);
  });
});