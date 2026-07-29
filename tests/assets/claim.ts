import  { Category, type ClaimDto, ClientPartyStatus, CostType, Count, CourtType } from "#src/types/Claim.js";
import {
  billNarrativeLineItem,
  disbursementLineItem,
  evidenceItem,
  workItemLineItem1,
  workItemLineItem2,
  workItemLineItem3,
} from "./lineItems.js";

export const claim1: ClaimDto = {
  id: "019f5fa1-dd58-7456-bf6f-73dd0b58eeb5",
  client: "Giordano",
  category: "Family",
  concluded: new Date("2025-03-18"),
  feeType: "Escape",
  claimed: 234.56,
  ufn: "someUFN",
  providerUserId: "someProviderUserId",
  lineItems: [
    billNarrativeLineItem,
    workItemLineItem1
  ],
  evidence: [
    evidenceItem
  ]
};

export const claim2: ClaimDto = {
  id: "019f5fa2-7e10-7b2d-953b-8074b2597e94",
  client: "Amoto",
  category: "Immigration and Asylum",
  concluded: new Date("2025-03-14"),
  feeType: "Fixed",
  claimed: 56,
  ufn: "someUFN",
  providerUserId: "someProviderUserId",
  lineItems: [
    billNarrativeLineItem
  ],
  evidence: [
    evidenceItem
  ]
};

export const claim3: ClaimDto = {
  id: "019f5fa2-bd18-7dd9-b31c-0f320487cd8b",
  client: "DeMello",
  category: "Immigration and Asylum",
  concluded: new Date("2025-03-13"),
  feeType: "Hourly",
  claimed: 456.01,
  ufn: "someUFN",
  providerUserId: "someProviderUserId",
  lineItems: [
    workItemLineItem1
  ],
  evidence: []
};


export const claim4: ClaimDto = {
  id: "019f5fa2-e7c8-71e8-93ef-eaadfdac3814",
  client: "Omar",
  category: "Immigration and Asylum",
  concluded: new Date("2025-03-12"),
  feeType: "Hourly",
  claimed: 456.01,
  ufn: "someUFN",
  providerUserId: "someProviderUserId",
  lineItems: [
    workItemLineItem1
  ],
  evidence: []
};

export const claim5: ClaimDto = {
  id: "019f5fa3-11d3-76e4-b71e-6666f7c873f4",
  client: "Omar",
  category: "Immigration and Asylum",
  concluded: new Date("2025-03-12"),
  feeType: "Hourly",
  claimed: 456.01,
  ufn: "someUFN",
  providerUserId: "someProviderUserId",
  lineItems: [
    billNarrativeLineItem,
    workItemLineItem1,
    disbursementLineItem
  ],
  evidence: [
    evidenceItem
  ]
};

export const claim6: ClaimDto = {
  id: "019f5fa3-39a5-7e0e-aa34-69a7fc3dbacb",
  client: "Omar",
  category: "Immigration and Asylum",
  concluded: new Date("2025-03-12"),
  feeType: "Hourly",
  claimed: 456.01,
  ufn: "someUFN",
  providerUserId: "someProviderUserId",
  lineItems: [
    billNarrativeLineItem,
    workItemLineItem2
  ],
  evidence: [
    evidenceItem
  ]
};

export const claim7: ClaimDto = {
  id: "019f5fa3-5c9a-7e20-9c2c-434733f04142",
  client: "Omar",
  category: "Immigration and Asylum",
  concluded: new Date("2025-03-12"),
  feeType: "Hourly",
  claimed: 456.01,
  ufn: "someUFN",
  providerUserId: "someProviderUserId",
  lineItems: [
    workItemLineItem1,
    workItemLineItem2,
    workItemLineItem3
  ],
  evidence: [
    evidenceItem
  ]
};

export const claim8: ClaimDto = {
  id: "019f5fa3-8679-7b1a-9b04-e2fc2d6a4050",
  client: "Omar",
  category: "Immigration and Asylum",
  concluded: new Date("2025-03-12"),
  feeType: "Hourly",
  claimed: 456.01,
  ufn: "someUFN",
  providerUserId: "someProviderUserId",
  lineItems: [
    disbursementLineItem
  ],
  evidence: [
    evidenceItem
  ]
};

/**
 * Draft claim with profit cost bill line item
 */
export const claim9: ClaimDto = {
  id: "019fae76-b6bd-76ec-ae50-38d76da01631",
  costType: CostType.PROFIT_COST,
  courtType: CourtType.COUNTY_COURT,
  clientPartyStatus: ClientPartyStatus.CHILD,
  firstActingSolicitorFlag: true,
  transferOfSolicitorFlag: false,
  clientsRetainedCount: Count.ZERO,
  clientsStartCount: Count.TWO_OR_MORE,
  multiClientHearingFlag: true,
  escaped: true,
  lineItems: [
    {
      id: "019fae73-5288-76ac-aa2d-e88859c5960a",
      title: "Line item",
      category: Category.DISBURSEMENT,
      date: new Date("2026-07-29"),
      netProfitCostAmount: 123,
      netAdvocacyCostAmount: 456,
      vatApplicable: false,
      feeEarnerName: "John Smith",
      evidenceItems: []
    }
  ],
  evidence: [
    {
      id: "019f5fa3-e258-7583-9626-eb7febb94b62",
      fileKey: "evidence1.pdf",
      fileSize: 1000,
      submittedOn: new Date("2026-06-17T14:34:01.226855Z"),
    }
  ]
};

/**
 * Draft claim with expert cost bill line items
 */
export const claim10: ClaimDto = {
  id: "019fae76-cf01-7487-99d5-8920f857df7f",
  costType: CostType.EXPERT_COST,
  lineItems: [
    {
      id: "019fae76-e8a7-73bc-af8d-990543ec4a65",
      title: "Cost of petrol",
      category: Category.DISBURSEMENT,
      date: new Date("2023-12-20"),
      actualNetValue: 150,
      vatApplicable: true,
      feeEarnerName: "Carol Spencer",
      evidenceItems: []
    },
    {
      id: "019fae77-87c3-734c-a38d-54624d48d7e5",
      title: "Line item 2",
      category: Category.DISBURSEMENT,
      date: new Date("2026-07-30"),
      actualNetValue: 456,
      vatApplicable: true,
      feeEarnerName: "Joe Bloggs",
      evidenceItems: []
    }
  ],
  evidence: [
    {
      id: "019f5fa3-e258-7583-9626-eb7febb94b62",
      fileKey: "evidence1.pdf",
      fileSize: 1000,
      submittedOn: new Date("2026-06-17T14:34:01.226855Z"),
    },
    {
      id: "019fae78-414c-71e8-b4a7-d1cc65cabee1",
      fileKey: "evidence2.pdf",
      fileSize: 2000,
      submittedOn: new Date("2026-06-18T14:34:01.226855Z"),
    }
  ]
};
