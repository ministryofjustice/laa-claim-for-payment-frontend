import { z } from "zod";

export const EvidenceItemSchema = z.object({
  fileKey: z.string(),
  fileSize: z.number(),
  id: z.number(),
});

export type EvidenceItem = z.infer<typeof EvidenceItemSchema>;

export enum Category {
  BILL_NARRATIVE = "Bill Narrative",
  WORK_ITEM = "Work Item",
  DISBURSEMENT = "Disbursement",
}

export const CategorySchema = z.enum(Category);

export const LineItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  category: CategorySchema,
  date: z.string().transform(val => new Date(val)),
  evidenceItems: z.array(EvidenceItemSchema),
});

export type LineItem = z.infer<typeof LineItemSchema>;

export const ClaimResponseSchema = z.object({
  id: z.number(),
  ufn: z.string().optional(),
  providerUserId: z.string().optional(),
  client: z.string().optional(),
  category: z.string().optional(),
  concluded: z.string().optional().transform(val => (val == null ?  undefined : new Date(val))),
  feeType: z.string().optional(),
  claimed: z.number().optional(),
  submissionId: z.string().optional(),
  lineItems: z.array(LineItemSchema).optional(),
});

export type Claim = z.infer<typeof ClaimResponseSchema>;

export const ClaimsResponseSchema = z.object({
  claims: z.array(ClaimResponseSchema),
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});
