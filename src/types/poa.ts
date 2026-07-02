import { z } from 'zod';

export const EvidenceSchema = z.object({
  fileKey: z.string(),
  fileSize: z.number(),
  submittedOn: z.string().pipe(z.coerce.date()),
});

export type Evidence = z.infer<typeof EvidenceSchema>;

export const HowManyClientsRetainedChoice = {
  None: "none",
  One: "one",
  MoreThanTwo: "more-than-two",
} as const;

export const HowManyClientsRetainedChoiceSchema = z.enum(
  HowManyClientsRetainedChoice,
);

export type HowManyClientsRetainedChoice = z.infer<
  typeof HowManyClientsRetainedChoiceSchema
>;

export const NumberOfClientsStartOfCaseChoice = {
  None: "none",
  One: "one",
  MoreThanTwo: "more-than-two",
} as const;

export const NumberOfClientsStartOfCaseChoiceSchema = z.enum(
  NumberOfClientsStartOfCaseChoice,
);

export type NumberOfClientsStartOfCaseChoice = z.infer<
  typeof NumberOfClientsStartOfCaseChoiceSchema
>;

export const PoaClaimTypeChoice = {
  ProfitCost: "profit-cost",
  ExpertCost: "expert-cost",
  NonExpertDisbursement: "non-expert-disbursement",
} as const;

export const PoaClaimTypeChoiceSchema = z.enum(PoaClaimTypeChoice);

export type PoaClaimTypeChoice = z.infer<typeof PoaClaimTypeChoiceSchema>;

export const ClientStatusChoice = {
  Child: "child",
  JoinedParty: "joined-party",
  Parent: "parent",
} as const;

export const ClientStatusChoiceSchema = z.enum(ClientStatusChoice);

export type ClientStatusChoice = z.infer<typeof ClientStatusChoiceSchema>;

export const CourtTypeChoice = {
  CountyCourt: "county-court",
  HighCourt: "high-court",
  MagistratesCourt: "magistrates-court",
  OtherJudge: "other-judge",
} as const;

export const CourtTypeChoiceSchema = z.enum(CourtTypeChoice);

export type CourtTypeChoice = z.infer<typeof CourtTypeChoiceSchema>;

export const ProfitCostDetailsSchema = z.object({
  courtType: CourtTypeChoiceSchema,
  clientStatus: ClientStatusChoiceSchema,
  firstSolicitor: z.boolean(),
  transferOfSolicitor: z.boolean(),
});

export type ProfitCostDetails = z.infer<typeof ProfitCostDetailsSchema>;

export const ProfitCostBillLineSchema = z.object({
  activityDate: z.string().pipe(z.coerce.date()),
  actualNetProfitCostExcludingAdvocacy: z.number(),
  actualNetAdvocacyCosts: z.number(),
  vatApplies: z.boolean(),
  feeEarnerName: z.string(),
});

export type ProfitCostBillLine = z.infer<typeof ProfitCostBillLineSchema>;

export const ExpertCostDetailsSchema = z.object({
  activityDate: z.string().pipe(z.coerce.date()),
  actualNetValue: z.number(),
  vatApplies: z.boolean(),
  feeEarnerName: z.string(),
  description: z.string(),
});

export type ExpertCostDetails = z.infer<typeof ExpertCostDetailsSchema>;

export const ProfitCostPoaSchema = z.object({
  type: z.literal(PoaClaimTypeChoice.ProfitCost),
  details: ProfitCostDetailsSchema,
  howManyClientsRetained: HowManyClientsRetainedChoiceSchema.optional(),
  numberOfClientsStartOfCase: NumberOfClientsStartOfCaseChoiceSchema.optional(),
  multipleClientHearings: z.boolean(),
  escapingFixedFee: z.boolean(),
  profitCostBillLine: ProfitCostBillLineSchema,
  evidence: z.array(EvidenceSchema).optional(),
});

export type ProfitCostPoa = z.infer<typeof ProfitCostPoaSchema>;

export const ExpertCostPoaSchema = z.object({
  type: z.literal(PoaClaimTypeChoice.ExpertCost),
  details: z.array(ExpertCostDetailsSchema),
  evidence: z.array(EvidenceSchema).optional(),
});

export type ExpertCostPoa = z.infer<typeof ExpertCostPoaSchema>;

export const NonExpertDisbursementPoaSchema = z.object({
  type: z.literal(PoaClaimTypeChoice.NonExpertDisbursement),
});

export type NonExpertDisbursementPoa = z.infer<
  typeof NonExpertDisbursementPoaSchema
>;

export const PoaSchema = z.discriminatedUnion("type", [
  ProfitCostPoaSchema,
  ExpertCostPoaSchema,
  NonExpertDisbursementPoaSchema,
]);

export type Poa = z.infer<typeof PoaSchema>;
