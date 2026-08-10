import { z } from 'zod';
import {
  ClientPartyStatus,
  CostType,
  Count,
  CourtType,
  IsoDateSchema,
} from "#src/types/Claim.js";

export const EvidenceSchema = z.object({
  fileKey: z.string(),
  fileSize: z.number(),
  submittedOn: z.iso.datetime(),
});

export type Evidence = z.infer<typeof EvidenceSchema>;

export const ProfitCostDetailsSchema = z.object({
  courtType: z.enum(CourtType),
  clientStatus: z.enum(ClientPartyStatus),
  firstSolicitor: z.boolean(),
  transferOfSolicitor: z.boolean(),
});

export type ProfitCostDetails = z.infer<typeof ProfitCostDetailsSchema>;

export const ProfitCostBillLineSchema = z.object({
  activityDate: IsoDateSchema,
  actualNetProfitCostExcludingAdvocacy: z.number(),
  actualNetAdvocacyCosts: z.number(),
  vatApplies: z.boolean(),
  feeEarnerName: z.string(),
});

export type ProfitCostBillLine = z.infer<typeof ProfitCostBillLineSchema>;

export const ExpertCostDetailsSchema = z.object({
  activityDate: IsoDateSchema,
  actualNetValue: z.number(),
  vatApplies: z.boolean(),
  feeEarnerName: z.string(),
  description: z.string(),
});

export type ExpertCostDetails = z.infer<typeof ExpertCostDetailsSchema>;

export const ProfitCostPoaSchema = z.object({
  type: z.literal(CostType.PROFIT_COST),
  details: ProfitCostDetailsSchema,
  howManyClientsRetained: z.enum(Count).optional(),
  numberOfClientsStartOfCase: z.enum(Count).optional(),
  multipleClientHearings: z.boolean(),
  escapingFixedFee: z.boolean(),
  profitCostBillLine: ProfitCostBillLineSchema,
  evidence: z.array(EvidenceSchema).optional(),
});

export type ProfitCostPoa = z.infer<typeof ProfitCostPoaSchema>;

export const ExpertCostPoaSchema = z.object({
  type: z.literal(CostType.EXPERT_COST),
  details: z.array(ExpertCostDetailsSchema),
  evidence: z.array(EvidenceSchema).optional(),
});

export type ExpertCostPoa = z.infer<typeof ExpertCostPoaSchema>;

export const NonExpertDisbursementPoaSchema = z.object({
  type: z.literal(CostType.NON_EXPERT_DISBURSEMENT),
});

export type NonExpertDisbursementPoa = z.infer<
  typeof NonExpertDisbursementPoaSchema
>;

export type LineItemForm =
  | {
  type: CostType.EXPERT_COST;
  value: ExpertCostDetails;
}
  | {
  type: CostType.PROFIT_COST;
  value: ProfitCostBillLine;
};

export const PoaSchema = z.discriminatedUnion("type", [
  ProfitCostPoaSchema,
  ExpertCostPoaSchema,
  NonExpertDisbursementPoaSchema,
]);

export type Poa = z.infer<typeof PoaSchema>;
