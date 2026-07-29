import { z } from "zod";
import type { ProfitCostDetails } from "#src/types/poa.js";

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

export enum CourtType {
  COUNTY_COURT = 'COUNTY_COURT',
  HIGH_COURT = 'HIGH_COURT',
  MAGISTRATES_COURT = 'MAGISTRATES_COURT',
  OTHER_JUDGE = 'OTHER_JUDGE',
}

export enum Count {
  ZERO = 'ZERO',
  ONE = 'ONE',
  TWO_OR_MORE = 'TWO_OR_MORE',
}

export enum ClientPartyStatus {
  CHILD = 'CHILD',
  JOINED_PARTY = 'JOINED_PARTY',
  PARENT = 'PARENT',
}

const NullOrUndefinedSchema = z.union([z.null(), z.undefined()]);

const BaseLineItemSchema = z.object({
  id: z.uuidv7(),
  title: z.string(),
  category: z.enum(Category),
  date: z.string().pipe(z.coerce.date()),
  evidenceItems: z.array(z.uuidv7()),
});

// TODO - needed for backwards compatibility. Eventually remove.
export const StubLineItemSchema = BaseLineItemSchema;

const PoaLineItemSchema = BaseLineItemSchema.extend({
  feeEarnerName: z.string(),
  vatApplicable: z.boolean(),
});

export const ExpertCostLineItemSchema = PoaLineItemSchema.extend({
  actualNetValue: z.number(),
  netProfitCostAmount: NullOrUndefinedSchema,
  netAdvocacyCostAmount: NullOrUndefinedSchema,
}).strict();

export const ProfitCostBillLineItemSchema = PoaLineItemSchema.extend({
  netProfitCostAmount: z.number(),
  netAdvocacyCostAmount: z.number(),
  actualNetValue: NullOrUndefinedSchema,
}).strict();

export const LineItemSchema = z.union([
  ExpertCostLineItemSchema,
  ProfitCostBillLineItemSchema,
  StubLineItemSchema, // must go last
]);

export type ExpertCostLineItem = z.infer<typeof ExpertCostLineItemSchema>;
export type ProfitCostBillLineItem = z.infer<typeof ProfitCostBillLineItemSchema>;
export type StubLineItem = z.infer<typeof StubLineItemSchema>;
export type LineItem = z.infer<typeof LineItemSchema>;

export const ClaimResponseSchema = z.object({
  id: z.uuidv7(),
  costType: z.enum(CostType).nullish(),
  courtType: z.enum(CourtType).nullish(),
  clientPartyStatus: z.enum(ClientPartyStatus).nullish(),
  firstActingSolicitorFlag: z.boolean().nullish(),
  transferOfSolicitorFlag: z.boolean().nullish(),
  clientsRetainedCount: z.enum(Count).nullish(),
  clientsStartCount: z.enum(Count).nullish(),
  multiClientHearingFlag: z.boolean().nullish(),
  escaped: z.boolean().nullish(),
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
   * Gets the court type.
   *
   * @returns {CourtType | null | undefined} the court type.
   */
  get courtType(): CourtType | null | undefined {
    return this.data.courtType;
  }

  /**
   * Gets the client party status.
   *
   * @returns {ClientPartyStatus | null | undefined} the client party status.
   */
  get clientPartyStatus(): ClientPartyStatus | null | undefined {
    return this.data.clientPartyStatus;
  }

  /**
   * Gets the first acting solicitor flag.
   *
   * @returns {boolean | null | undefined} the first acting solicitor flag.
   */
  get firstActingSolicitorFlag(): boolean | null | undefined {
    return this.data.firstActingSolicitorFlag;
  }

  /**
   * Gets the transfer of solicitor flag.
   *
   * @returns {boolean | null | undefined} the transfer of solicitor flag.
   */
  get transferOfSolicitorFlag(): boolean | null | undefined {
    return this.data.transferOfSolicitorFlag;
  }

  /**
   * Gets the clients retained count.
   *
   * @returns {Count | null | undefined} the clients retained count.
   */
  get clientsRetainedCount(): Count | null | undefined {
    return this.data.clientsRetainedCount;
  }

  /**
   * Gets the clients start count.
   *
   * @returns {Count | null | undefined} the clients start count.
   */
  get clientsStartCount(): Count | null | undefined {
    return this.data.clientsStartCount;
  }

  /**
   * Gets the multi-client hearing flag.
   *
   * @returns {boolean | null | undefined} the multi-client hearing flag.
   */
  get multiClientHearingFlag(): boolean | null | undefined {
    return this.data.multiClientHearingFlag;
  }

  /**
   * Gets the escaped flag.
   *
   * @returns {boolean | null | undefined} the escaped flag.
   */
  get escapedFlag(): boolean | null | undefined {
    return this.data.escaped;
  }

  /**
   * Gets the line items.
   *
   * @returns {LineItem[] | null | undefined} the line items.
   */
  get lineItems(): LineItem[] | null | undefined {
    return this.data.lineItems;
  }

  /**
   * Sets the cost type.
   *
   * @param {CostType} value cost type
   * @returns {Claim} updated claim
   */
  setCostType(value: CostType): this {
    this.data.costType = value;
    // cleanup logic here
    return this;
  }

  /**
   * Sets the profit cost details.
   *
   * @param {ProfitCostDetails} value profit cost details
   * @returns {Claim} updated claim
   */
  setProfitCostDetails(value: ProfitCostDetails): this {
    this.setCourtType(value.courtType);
    this.setClientPartyStatus(value.clientStatus);
    this.setFirstActingSolicitorFlag(value.firstSolicitor);
    this.setTransferOfSolicitorFlag(value.transferOfSolicitor);
    return this;
  }

  /**
   * Sets the court type.
   *
   * @param {CourtType | undefined} value court type
   * @returns {Claim} updated claim
   */
  setCourtType(value: CourtType | undefined): this {
    this.data.courtType = value;
    return this;
  }

  /**
   * Sets the client party status.
   *
   * @param {ClientPartyStatus | undefined} value client party status
   * @returns {Claim} updated claim
   */
  setClientPartyStatus(value: ClientPartyStatus | undefined): this {
    this.data.clientPartyStatus = value;
    return this;
  }

  /**
   * Sets the first acting solicitor flag.
   *
   * @param {boolean | undefined} value first acting solicitor flag
   * @returns {Claim} updated claim
   */
  setFirstActingSolicitorFlag(value: boolean | undefined): this {
    this.data.firstActingSolicitorFlag = value;
    return this;
  }

  /**
   * Sets the transfer of solicitor flag.
   *
   * @param {boolean | undefined} value transfer of solicitor flag
   * @returns {Claim} updated claim
   */
  setTransferOfSolicitorFlag(value: boolean | undefined): this {
    if (value === false) {
      this.setClientsRetainedCount(undefined);
    }
    this.data.transferOfSolicitorFlag = value;
    return this;
  }

  /**
   * Sets the clients retained count.
   *
   * @param {Count | undefined} value clients retained count
   * @returns {Claim} updated claim
   */
  setClientsRetainedCount(value: Count | undefined): this {
    if (value === Count.ONE || value === Count.TWO_OR_MORE) {
      this.setClientsStartCount(undefined);
    }
    this.data.clientsRetainedCount = value;
    return this;
  }

  /**
   * Sets the clients start count.
   *
   * @param {Count | undefined} value clients start count
   * @returns {Claim} updated claim
   */
  setClientsStartCount(value: Count | undefined): this {
    this.data.clientsStartCount = value;
    return this;
  }

  /**
   * Sets the multi-client hearing flag.
   *
   * @param {boolean | undefined} value multi-client hearing flag
   * @returns {Claim} updated claim
   */
  setMultiClientHearingFlag(value: boolean | undefined): this {
    this.data.multiClientHearingFlag = value;
    return this;
  }

  /**
   * Sets the escaped flag.
   *
   * @param {boolean | undefined} value escaped flag
   * @returns {Claim} updated claim
   */
  setEscapedFlag(value: boolean | undefined): this {
    this.data.escaped = value;
    return this;
  }
}
