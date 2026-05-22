import type { Claim } from "#src/types/Claim.js";
import {
  billNarrativeLineItem,
  disbursementLineItem,
  evidenceItem,
  workItemLineItem1,
  workItemLineItem2,
  workItemLineItem3,
} from "./lineItems.js";

export const claim1: Claim = {
  id: 1,
  client: "Giordano",
  category: "Family",
  concluded: new Date("2025-03-18"),
  feeType: "Escape",
  claimed: 234.56,
  submissionId: "550e8400-e29b-41d4-a716-446655440000",
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

export const claim2: Claim = {
  id: 2,
  client: "Amoto",
  category: "Immigration and Asylum",
  concluded: new Date("2025-03-14"),
  feeType: "Fixed",
  claimed: 56,
  submissionId: "550e8400-e29b-41d4-a716-446655440000",
  ufn: "someUFN",
  providerUserId: "someProviderUserId",
  lineItems: [
    billNarrativeLineItem
  ],
  evidence: [
    evidenceItem
  ]
};

export const claim3: Claim = {
  id: 3,
  client: "DeMello",
  category: "Immigration and Asylum",
  concluded: new Date("2025-03-13"),
  feeType: "Hourly",
  claimed: 456.01,
  submissionId: "550e8400-e29b-41d4-a716-446655440000",
  ufn: "someUFN",
  providerUserId: "someProviderUserId",
  lineItems: [
    workItemLineItem1
  ],
  evidence: []
};


export const claim4: Claim = {
  id: 4,
  client: "Omar",
  category: "Immigration and Asylum",
  concluded: new Date("2025-03-12"),
  feeType: "Hourly",
  claimed: 456.01,
  submissionId: "550e8400-e29b-41d4-a716-446655440000",
  ufn: "someUFN",
  providerUserId: "someProviderUserId",
  lineItems: [
    workItemLineItem1
  ],
  evidence: []
};

export const claim5: Claim = {
  id: 5,
  client: "Omar",
  category: "Immigration and Asylum",
  concluded: new Date("2025-03-12"),
  feeType: "Hourly",
  claimed: 456.01,
  submissionId: "550e8400-e29b-41d4-a716-446655440000",
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

export const claim6: Claim = {
  id: 6,
  client: "Omar",
  category: "Immigration and Asylum",
  concluded: new Date("2025-03-12"),
  feeType: "Hourly",
  claimed: 456.01,
  submissionId: "550e8400-e29b-41d4-a716-446655440000",
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

export const claim7: Claim = {
  id: 7,
  client: "Omar",
  category: "Immigration and Asylum",
  concluded: new Date("2025-03-12"),
  feeType: "Hourly",
  claimed: 456.01,
  submissionId: "550e8400-e29b-41d4-a716-446655440000",
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

export const claim8: Claim = {
  id: 8,
  client: "Omar",
  category: "Immigration and Asylum",
  concluded: new Date("2025-03-12"),
  feeType: "Hourly",
  claimed: 456.01,
  submissionId: "550e8400-e29b-41d4-a716-446655440000",
  ufn: "someUFN",
  providerUserId: "someProviderUserId",
  lineItems: [
    disbursementLineItem
  ],
  evidence: [
    evidenceItem
  ]
};