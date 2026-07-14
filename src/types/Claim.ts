import { z } from "zod";
import { UUID } from "uuidv7";

export const EvidenceItemSchema = z.object({
  id: z.uuidv7().transform(val => UUID.parse(val)),
  fileKey: z.string(),
  fileSize: z.number(),
  submittedOn: z.string().pipe(z.coerce.date()),
});

export type EvidenceItem = z.infer<typeof EvidenceItemSchema>;

export enum Category {
  BILL_NARRATIVE = "Bill Narrative",
  WORK_ITEM = "Work Item",
  DISBURSEMENT = "Disbursement",
}

export const CategorySchema = z.enum(Category);

export const LineItemSchema = z.object({
  id: z.uuidv7().transform(val => UUID.parse(val)),
  title: z.string(),
  category: CategorySchema,
  date: z.string().pipe(z.coerce.date()),
  evidenceItems: z.array(z.uuidv7()).transform(x => x.map(val => UUID.parse(val))),
});

export type LineItem = z.infer<typeof LineItemSchema>;

export const ClaimResponseSchema = z.object({
  id: z.uuidv7().transform(val => UUID.parse(val)),
  ufn: z.string().nullish(),
  providerUserId: z.string().nullish(),
  client: z.string().nullish(),
  category: z.string().nullish(),
  concluded: z.string().pipe(z.coerce.date()).nullish(),
  feeType: z.string().nullish(),
  claimed: z.number().nullish(),
  lineItems: z.array(LineItemSchema).nullish(),
  evidence: z.array(EvidenceItemSchema).nullish(),
});

export type Claim = z.infer<typeof ClaimResponseSchema>;

export const ClaimsResponseSchema = z.object({
  claims: z.array(ClaimResponseSchema),
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});
