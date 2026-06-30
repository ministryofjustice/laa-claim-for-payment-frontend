/**
 * @description Tests for the choose file upload view model
 */

import {
  RadioQuestionOptions,
  RadioQuestionViewModel,
} from "#src/viewmodels/radioQuestionViewModel.js";
import { expect } from "chai";

const testFieldName = "test" as const;

  const TestChoice = {
    First: "first",
    Second: "second",
  } as const;

  type TestChoice =
    (typeof TestChoice)[keyof typeof TestChoice];

  const testChoices: RadioQuestionOptions<TestChoice>[] = [
    {
      value: TestChoice.First,
      text: {
        key: "first text"
      },
    },
      {
      value: TestChoice.Second,
      text: {
        key: "second text"
      },
    },
  ] as const;

describe("radioQuestionViewModel()", () => {

  it("creates the form field name", () => {
    const viewModel = new RadioQuestionViewModel({
      title: {
        key: "test title"
      },
      fieldName: testFieldName,
      choices: testChoices
    });

    expect(viewModel.form.fieldName).to.equal(testFieldName);
    expect(viewModel.form.fieldName).to.equal("test");
  });

  it("creates the radio choices", () => {
    const viewModel = new RadioQuestionViewModel({
      title: {
        key: "test title"
      },
      fieldName: testFieldName,
      choices: testChoices
    });

    expect(viewModel.form.choices).to.have.length(2);

    expect(viewModel.form.choices[0].value).to.equal("first");
    expect(viewModel.form.choices[0].text).to.deep.equal({
      key: "first text"
    });
    expect(viewModel.form.choices[0].checked).to.equal(false);

    expect(viewModel.form.choices[1].value).to.equal("second");
    expect(viewModel.form.choices[1].text).to.deep.equal({
      key: "second text"
    });
    expect(viewModel.form.choices[1].checked).to.equal(false);
  });

  it("creates the radio choices with hints", () => {
    const testChoices: RadioQuestionOptions<TestChoice>[] = [
      {
        value: TestChoice.First,
        text: {
          key: "first text"
        },
        hint: {
          text: {
            key: "hint 1"
          }
        }
      },
        {
        value: TestChoice.Second,
        text: {
          key: "second text"
        },
        hint: {
          text: {
            key: "hint 2"
          }
        }
      },
    ] as const;

    const viewModel = new RadioQuestionViewModel({
      title: {
        key: "test title"
      },
      fieldName: testFieldName,
      choices: testChoices
    });


    expect(viewModel.form.choices[0].hint?.text).to.deep.equal({
      key: "hint 1"
    });
    expect(viewModel.form.choices[1].hint?.text).to.deep.equal({
      key: "hint 2"
    });
  });

  it("marks the selected choice as checked", () => {
    const viewModel = new RadioQuestionViewModel({
      title: {
        key: "test title"
      },
      fieldName: testFieldName,
      choices: testChoices,
      selectedValue: TestChoice.Second,
    });

    expect(viewModel.form.choices[0].checked).to.equal(false);
    expect(viewModel.form.choices[1].checked).to.equal(true);
  });

  it("adds an error when provided", () => {
    const viewModel = new RadioQuestionViewModel({
      title: {
        key: "test title"
      },
      fieldName: testFieldName,
      choices: testChoices,
      selectedValue: TestChoice.First,
      errors: [
        {
          fieldName: testFieldName,
          href: "#field-name",
          text: {
            key: "some.errors.empty"
          },
        }
      ],
    });

    expect(viewModel.form.error?.text).to.deep.equal({
      key: "some.errors.empty"
    });
  });
});
