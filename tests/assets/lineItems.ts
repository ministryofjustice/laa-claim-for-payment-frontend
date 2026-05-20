import { Category, type EvidenceItem, type LineItem } from "#src/types/Claim.js";

export const evidenceItem: EvidenceItem = {
  id: 1,
  fileKey: "evidence1.pdf",
  fileSize: 1000
} 

export const billNarrativeLineItem: LineItem = {
  id: 1,
  title: "Bill narrative",
  category: Category.BILL_NARRATIVE,
  date: new Date("2026-06-19"),
  evidenceItems: [
    evidenceItem
  ],
}

export const workItemLineItem: LineItem = {
  id: 2,
  title: "Interim hearing",
  category: Category.WORK_ITEM,
  date: new Date("2023-12-20"),
  evidenceItems: [],
}


export const disbursementLineItem: LineItem = {
  id: 3,
  title: "Enquiry agent",
  category: Category.DISBURSEMENT,
  date: new Date("2023-01-13"),
  evidenceItems: [],
}



