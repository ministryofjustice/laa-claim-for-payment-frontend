import type { Claim } from "#src/types/Claim.js";
import {
  billNarrativeLineItem,
  disbursementLineItem,
  evidenceItem,
  workItemLineItem1,
  workItemLineItem2,
  workItemLineItem3,
} from "./lineItems.js";
import { UUID } from "uuidv7";

export const claim1: Claim = {
  id: UUID.parse("019f5fa1-dd58-7456-bf6f-73dd0b58eeb5"),
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

export const claim2: Claim = {
  id: UUID.parse("019f5fa2-7e10-7b2d-953b-8074b2597e94"),
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

export const claim3: Claim = {
  id: UUID.parse("019f5fa2-bd18-7dd9-b31c-0f320487cd8b"),
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


export const claim4: Claim = {
  id: UUID.parse("019f5fa2-e7c8-71e8-93ef-eaadfdac3814"),
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

export const claim5: Claim = {
  id: UUID.parse("019f5fa3-11d3-76e4-b71e-6666f7c873f4"),
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

export const claim6: Claim = {
  id: UUID.parse("019f5fa3-39a5-7e0e-aa34-69a7fc3dbacb"),
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

export const claim7: Claim = {
  id: UUID.parse("019f5fa3-5c9a-7e20-9c2c-434733f04142"),
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

export const claim8: Claim = {
  id: UUID.parse("019f5fa3-8679-7b1a-9b04-e2fc2d6a4050"),
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