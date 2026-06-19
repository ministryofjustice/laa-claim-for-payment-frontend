export const BooleanChoice = {
  Yes: "yes",
  No: "no",
} as const;

export type BooleanChoice =
  (typeof BooleanChoice)[keyof typeof BooleanChoice];

export const booleanChoices = [
  {
    value: BooleanChoice.Yes,
    text: "common.yes",
  },
    {
    value: BooleanChoice.No,
    text: "common.no",
  }
] as const;

/**
 * Checks whether the submitted boolean choice is valid.
 *
 * @param {unknown} value The submitted boolean choice.
 * @returns {boolean} Whether the submitted choice is valid.
 */
export function isValidBooleanChoice(
  value: unknown,
): value is BooleanChoice {
  return booleanChoices.some((choice) => choice.value === value);
}
