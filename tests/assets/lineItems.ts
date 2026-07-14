import { Category, type EvidenceItem, type LineItem } from "#src/types/Claim.js";

export const evidenceItem: EvidenceItem = {
  id: "019f5fa3-e258-7583-9626-eb7febb94b62",
  fileKey: "evidence1.pdf",
  fileSize: 1000,
  submittedOn: new Date("2026-06-17T14:34:01.226855Z"),
}

export const billNarrativeLineItem: LineItem = {
  id: "019f5fa4-0e78-712a-a6fd-51dd39005339",
  title: "Bill narrative",
  category: Category.BILL_NARRATIVE,
  date: new Date("2026-06-19"),
  evidenceItems: [
    "019f5fa3-e258-7583-9626-eb7febb94b62"
  ],
}

export const workItemLineItem1: LineItem = {
  id: "019f5fa4-7304-7ee5-9e1b-e692c26a0973",
  title: "Interim hearing",
  category: Category.WORK_ITEM,
  date: new Date("2023-12-20"),
  evidenceItems: [],
}

export const workItemLineItem2: LineItem = {
  id: "019f5fa5-0c77-701f-8f39-a294352f1cf4",
  title: "Interim hearing",
  category: Category.WORK_ITEM,
  date: new Date("2023-12-21"),
  evidenceItems: [
    "019f5fa3-e258-7583-9626-eb7febb94b62"
  ],
}

export const workItemLineItem3: LineItem = {
  id: "019f5fa5-35a9-7a70-ae42-24f3965d6476",
  title: "Interim hearing",
  category: Category.WORK_ITEM,
  date: new Date("2023-12-21"),
  evidenceItems: [
    "019f5fa3-e258-7583-9626-eb7febb94b62"
  ],
}

export const disbursementLineItem: LineItem = {
  id: "019f5fa5-5fb7-746d-946f-0ca18008570c",
  title: "Enquiry agent",
  category: Category.DISBURSEMENT,
  date: new Date("2023-01-13"),
  evidenceItems: [],
}
