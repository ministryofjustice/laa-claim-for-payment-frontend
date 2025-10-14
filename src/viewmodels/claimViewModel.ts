import type { Claim } from "#src/types/Claim.js";
import {
  formatClaimed,
  formatClaimId,
  formatDate,
  formatOptionalString,
} from "#src/helpers/index.js";
import { SummaryListRow } from "./components/summaryList.js";

export class ClaimViewModel {
  readonly rows: SummaryListRow[];
  readonly title: string;
  readonly backLink: string = "/"; // todo make "javascript:history.back()" - CSP blocks this currently
  readonly amendLink: string;

  constructor(claim: Claim) {
    this.title = formatClaimId(claim.id);
    this.amendLink = `/claim/${claim.id}/amend`
    const rows: SummaryListRow[] = [];

    rows.push({ key: { text: "Claim ID" }, value: { text: String(claim.id) } });

    if (claim.ufn)
      rows.push({ key: { text: "UFN" }, value: { text: claim.ufn } });

    if (claim.client)
      rows.push({ key: { text: "Client" }, value: { text: formatOptionalString(claim.client) } });

    if (claim.category)
      rows.push({ key: { text: "Category" }, value: { text: formatOptionalString(claim.category) } });

    if (claim.concluded)
      rows.push({ key: { text: "Concluded" }, value: { text: formatDate(new Date(claim.concluded)) } });

    if (claim.feeType)
      rows.push({ key: { text: "Fee type" }, value: { text: claim.feeType } });

    if (claim.claimed != null)
      rows.push({ key: { text: "Claimed" }, value: { text: formatClaimed(claim.claimed) } });

    if (claim.submissionId) {
      const href = `/submissions/${encodeURIComponent(claim.submissionId)}`;
      rows.push({
        key: { text: "Submission" },
        value: {
          html:
            `<a class="govuk-link" href="${href}">` +
            `View submission<span class="govuk-visually-hidden"> for claim ${this.title}</span>` +
            `</a>`
        }
      });
    }

    this.rows = rows;
  }
}
