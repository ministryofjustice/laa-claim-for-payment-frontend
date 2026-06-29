import type { RadioQuestionOptions } from "#src/viewmodels/radioQuestionViewModel.js";

export const courtTypeFieldName = "courtTypeChoice" as const;

export const CourtTypeChoice = {
  CountyCourt: "county-court",
  HighCourt: "high-court",
  MagistratesCourt: "magistrates-court",
  OtherJudge: "other-judge",
} as const;

export type CourtTypeChoice =
  (typeof CourtTypeChoice)[keyof typeof CourtTypeChoice];

export const courtTypeChoices: ReadonlyArray<RadioQuestionOptions<CourtTypeChoice>> = [
  {
    value: CourtTypeChoice.CountyCourt,
    text: {
      key: "pages.profitCostDetails.courtType.countyCourt.text"
    },
  },
  {
    value: CourtTypeChoice.HighCourt,
    text: {
      key: "pages.profitCostDetails.courtType.highCourt.text"
    },
  },
  {
    value: CourtTypeChoice.MagistratesCourt,
    text: {
      key: "pages.profitCostDetails.courtType.magistratesCourt.text"
    },
  },
  {
    value: CourtTypeChoice.OtherJudge,
    text: {
      key: "pages.profitCostDetails.courtType.otherJudge.text"
    },
  },
] as const;

export const clientStatusFieldName = "clientStatusChoice" as const;

export const ClientStatusChoice = {
  Child: "child",
  JoinedParty: "joined-party",
  Parent: "parent",
} as const;

export type ClientStatusChoice =
  (typeof ClientStatusChoice)[keyof typeof ClientStatusChoice];

export const clientStatusChoices: ReadonlyArray<RadioQuestionOptions<ClientStatusChoice>> = [
  {
    value: ClientStatusChoice.Child,
    text: {
      key: "pages.profitCostDetails.clientStatus.child.text"
    },
  },
  {
    value: ClientStatusChoice.JoinedParty,
    text: {
      key: "pages.profitCostDetails.clientStatus.joinedParty.text"
    },
  },
  {
    value: ClientStatusChoice.Parent,
    text: {
      key: "pages.profitCostDetails.clientStatus.parent.text"
    },
  },
] as const;

export const firstSolicitorFieldName = "firstSolicitorChoice" as const;

export const transferOfSolicitorFieldName =
  "transferOfSolicitorChoice" as const;