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

export const clientStatusFieldName = "clientStatusChoice" as const;

export const ClientStatusChoice = {
  Child: "child",
  JoinedParty: "joined-party",
  Parent: "parent",
} as const;

export type ClientStatusChoice =
  (typeof ClientStatusChoice)[keyof typeof ClientStatusChoice];

export const clientStatusChoices = [
  {
    value: ClientStatusChoice.Child,
    text: "pages.profitCostDetails.clientStatus.child.text",
  },
  {
    value: ClientStatusChoice.JoinedParty,
    text: "pages.profitCostDetails.clientStatus.joinedParty.text",
  },
  {
    value: ClientStatusChoice.Parent,
    text: "pages.profitCostDetails.clientStatus.parent.text",
  },
] as const;

export const firstSolicitorFieldName = "firstSolicitorChoice" as const;

export const transferOfSolicitorFieldName = "transferOfSolicitorChoice" as const;