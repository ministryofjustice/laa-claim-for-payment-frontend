import { Category, type EvidenceItem, type LineItem } from "#src/types/Claim.js";

export const evidenceItem: EvidenceItem = {
  id: 1,
  fileKey: "evidence1.pdf",
  fileSize: 1000,
  submittedOn: new Date("2026-06-17T14:34:01.226855Z"),
}

export const billNarrativeLineItem: LineItem = {
  id: 1,
  title: "Bill narrative",
  category: Category.BILL_NARRATIVE,
  date: new Date("2026-06-19"),
  evidenceItems: [1],
}

export const workItemLineItem1: LineItem = {
  id: 2,
  title: "Interim hearing",
  category: Category.WORK_ITEM,
  date: new Date("2023-12-20"),
  evidenceItems: [],
}

export const workItemLineItem2: LineItem = {
  id: 4,
  title: "Interim hearing",
  category: Category.WORK_ITEM,
  date: new Date("2023-12-21"),
  evidenceItems: [1],
}

export const workItemLineItem3: LineItem = {
  id: 5,
  title: "Interim hearing",
  category: Category.WORK_ITEM,
  date: new Date("2023-12-21"),
  evidenceItems: [1],
}

export const disbursementLineItem: LineItem = {
  id: 3,
  title: "Enquiry agent",
  category: Category.DISBURSEMENT,
  date: new Date("2023-01-13"),
  evidenceItems: [],
}



