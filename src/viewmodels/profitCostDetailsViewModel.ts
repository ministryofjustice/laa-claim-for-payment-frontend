export const courtTypeFieldName = "courtTypeChoice" as const;

export const CourtTypeChoice = {
  CountyCourt: "county-court",
  HighCourt: "high-court",
  MagistratesCourt: "magistrates-court",
  OtherJudge: "other-judge",
} as const;

export type CourtTypeChoice =
  (typeof CourtTypeChoice)[keyof typeof CourtTypeChoice];

export const courtTypeChoices = [
  {
    value: CourtTypeChoice.CountyCourt,
    text: "pages.profitCostDetails.courtType.countyCourt.text",
    hint: {
      text: "pages.profitCostDetails.courtType.countyCourt.hint",
    },
  },
  {
    value: CourtTypeChoice.HighCourt,
    text: "pages.profitCostDetails.courtType.highCourt.text",
    hint: {
      text: "pages.profitCostDetails.courtType.highCourt.hint",
    },
  },
  {
    value: CourtTypeChoice.MagistratesCourt,
    text: "pages.profitCostDetails.courtType.magistratesCourt.text",
    hint: {
      text: "pages.profitCostDetails.courtType.magistratesCourt.hint",
    },
  },
  {
    value: CourtTypeChoice.OtherJudge,
    text: "pages.profitCostDetails.courtType.otherJudge.text",
    hint: {
      text: "pages.profitCostDetails.courtType.otherJudge.hint",
    },
  },
] as const;

interface ProfitCostDetailsViewModelParams {
  courtTypeSelectedValue?: string;
  error?: {
    text: string;
  };
}

/**
 *
 */
export class ProfitCostDetailsViewModel {
  readonly form;

  /**
   * Creates a choose upload page view model.
   * @param { ProfitCostDetailsViewModelParams } params The selected value and error state
   */
  constructor(params: ProfitCostDetailsViewModelParams = {}) {
    this.form = {
      courtTypeFieldName,
      courtTypeChoices: courtTypeChoices.map((choice) => ({
        ...choice,
        checked: choice.value === params.courtTypeSelectedValue,
      })),
      error: params.error,
    };
  }
}

/**
 * Checks whether the submitted court type choice is valid.
 *
 * @param {unknown} value The submitted court type choice.
 * @returns {boolean} Whether the submitted choice is valid.
 */
export function isValidCourtTypeChoice(value: unknown): value is CourtTypeChoice {
  return courtTypeChoices.some((choice) => choice.value === value);
}