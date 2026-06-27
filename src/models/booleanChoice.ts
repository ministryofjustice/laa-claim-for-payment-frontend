import type { RadioQuestionOptions } from "#src/viewmodels/radioQuestionViewModel.js";

export const BooleanChoice = {
  Yes: "yes",
  No: "no",
} as const;

export type BooleanChoice = (typeof BooleanChoice)[keyof typeof BooleanChoice];

export const booleanChoices: Array<RadioQuestionOptions<BooleanChoice>> = [
  {
    value: BooleanChoice.Yes,
    text: {
      key: "common.yes"
    },
  },
  {
    value: BooleanChoice.No,
    text: {
      key: "common.no"
    },
  },
] as const;

