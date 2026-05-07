export const fileUploadFieldName = "fileUploadChoice" as const;

export const fileUploadChoices = [
  {
    value: "all-at-once",
    text: "pages.chooseUpload.allAtOnce.text",
    hint: {
      text: "pages.chooseUpload.allAtOnce.hint",
    },
  },
  {
    value: "associated-to-line-items",
    text: "pages.chooseUpload.associatedToLineItems.text",
    hint: {
      text: "pages.chooseUpload.associatedToLineItems.hint",
    },
  },
] as const;

interface ChooseUploadViewModelParams {
  selectedValue?: string;
  error?: {
    text: string;
  };
}

/**
 * View model for the choose upload page.
 */
export class ChooseUploadViewModel {
  readonly form;

  /**
   * Creates a choose upload page view model.
   *
   * @param {ChooseUploadViewModelParams} params The selected value and error state.
   */
  constructor(params: ChooseUploadViewModelParams = {}) {
    this.form = {
      fieldName: fileUploadFieldName,
      choices: fileUploadChoices.map((choice) => ({
        ...choice,
        checked: choice.value === params.selectedValue,
      })),
      error: params.error,
    };
  }
}

/**
 * Checks whether the submitted file upload choice is valid.
 *
 * @param {unknown} value The submitted file upload choice.
 * @returns {boolean} Whether the submitted choice is valid.
 */
export function isValidFileUploadChoice(value: unknown): boolean {
  return fileUploadChoices.some((choice) => choice.value === value);
}