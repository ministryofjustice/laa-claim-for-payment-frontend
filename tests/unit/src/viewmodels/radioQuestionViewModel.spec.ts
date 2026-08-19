/**
 * @description Tests for the choose file upload view model
 */

import {
  radioQuestionForm,
  RadioQuestionOptions,
  RadioQuestionViewModel,
} from "#src/viewmodels/radioQuestionViewModel.js";
import { expect } from "chai";
import { RadioField } from "#src/helpers/fields.js";

const testFieldName = "test" as const;

const TestChoice = {
  First: "first",
  Second: "second",
} as const;

type TestChoice = (typeof TestChoice)[keyof typeof TestChoice];

const testChoices: RadioQuestionOptions<TestChoice>[] = [
  {
    value: TestChoice.First,
    text: {
      key: "first text",
    },
  },
  {
    value: TestChoice.Second,
    text: {
      key: "second text",
    },
  },
] as const;

const testField: RadioField<TestChoice, TestChoice> = new RadioField(
  "prefix",
  testFieldName,
  "id",
  testChoices,
  (value) => value,
);

describe("radioQuestionViewModel()", () => {
  it("creates the radios", () => {
    const form = radioQuestionForm(testField);

    const viewModel = new RadioQuestionViewModel({
      title: "test",
      form,
      isLegendPageHeading: true,
    });

    expect(viewModel.title.key).to.equal("test");
    expect(viewModel.radios.idPrefix).to.equal("id");
    expect(viewModel.radios.items[0].checked).to.equal(false);
    expect(viewModel.radios.items[1].checked).to.equal(false);
  });

  it("creates the radios when value selected", () => {
    testField.validate("first");
    const form = radioQuestionForm(testField);

    const viewModel = new RadioQuestionViewModel({
      title: "test",
      form,
      isLegendPageHeading: true,
    });

    expect(viewModel.title.key).to.equal("test");
    expect(viewModel.radios.idPrefix).to.equal("id");
    expect(viewModel.radios.items[0].checked).to.equal(true);
    expect(viewModel.radios.items[1].checked).to.equal(false);
  });

  it("creates the radios when invalid value", () => {
    testField.validate("");
    const form = radioQuestionForm(testField);

    const viewModel = new RadioQuestionViewModel({
      title: "test",
      form,
      isLegendPageHeading: true,
    });

    expect(viewModel.title.key).to.equal("test");
    expect(viewModel.radios.idPrefix).to.equal("id");
    expect(viewModel.radios.errorMessage?.text.key).to.equal("prefix.errors.empty");
    expect(viewModel.errorSummary?.errorList).to.have.length(1);
  });
});
