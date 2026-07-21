import { z } from "zod";

export const EvidenceItemSchema = z.object({
  id: z.uuidv7(),
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

export enum CostType {
  PROFIT_COST = 'PROFIT_COST',
  EXPERT_COST = 'EXPERT_COST',
  NON_EXPERT_DISBURSEMENT = 'NON_EXPERT_DISBURSEMENT',
}

export const LineItemSchema = z.object({
  id: z.uuidv7(),
  title: z.string(),
  category: z.enum(Category),
  date: z.string().pipe(z.coerce.date()),
  evidenceItems: z.array(z.uuidv7()),
});

export type LineItem = z.infer<typeof LineItemSchema>;

export const ClaimResponseSchema = z.object({
  id: z.uuidv7(),
  costType: z.enum(CostType).nullish(),
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

export type ClaimDto = z.infer<typeof ClaimResponseSchema>;

export const ClaimsResponseSchema = z.object({
  claims: z.array(ClaimResponseSchema),
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

/**
 * Wrapper class for claim DTO.
 */
export class Claim {
  /**
   * Constructor for the claim wrapper class.
   *
   * @param {ClaimDto} data claim DTO data
   */
  constructor(private readonly data: ClaimDto) {}

  /**
   * Gets the underlying claim DTO.
   *
   * @returns {ClaimDto} the underlying claim DTO.
   */
  get value(): ClaimDto {
    return this.data;
  }

  /**
   * Gets the claim ID.
   *
   * @returns {string} the claim ID.
   */
  get id(): string {
    return this.data.id;
  }

  /**
   * Gets the cost type.
   *
   * @returns {CostType | null | undefined} the cost type.
   */
  get costType(): CostType | null | undefined {
    return this.data.costType;
  }

  /**
   * Sets the cost type.
   *
   * @param {CostType | null | undefined} costType cost type
   * @returns {Claim} updated claim
   */
  setCostType(costType: CostType | null | undefined): this {
    this.data.costType = costType;
    // cleanup logic here
    return this;
  }
}
