export const fileUploadFieldName = "fileUploadChoice" as const;

export const FileUploadChoice = {
  AllAtOnce: "all-at-once",
  AssociatedToLineItems: "associated-to-line-items",
} as const;

export type FileUploadChoice =
  (typeof FileUploadChoice)[keyof typeof FileUploadChoice];

export const fileUploadChoices = [
  {
    value: FileUploadChoice.AllAtOnce,
    text: "pages.chooseUpload.allAtOnce.text",
    hint: {
      text: "pages.chooseUpload.allAtOnce.hint",
    },
  },
  {
    value: FileUploadChoice.AssociatedToLineItems,
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
export function isValidFileUploadChoice(value: unknown): value is FileUploadChoice {
  return fileUploadChoices.some((choice) => choice.value === value);
}