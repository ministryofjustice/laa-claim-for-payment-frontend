import { ClaimViewModel } from "#src/viewmodels/claimViewModel.js";
import type { Claim } from "#src/types/Claim.js";
import { getClaimsSuccessResponseData } from "#tests/assets/getClaimsResponseData.js";
import { expect } from "chai";
import { formatClaimId, formatDate, formatClaimed } from "#src/helpers/index.js";

describe("ClaimViewModel constructor()", () => {
  it("builds the title, back link and summary rows", () => {
    const claim: Claim = getClaimsSuccessResponseData.body!.data![0]!;
    const vm = new ClaimViewModel(claim);

    expect(vm.title).to.equal(formatClaimId(claim.id));
    expect(vm.backLink).to.equal("/");

    const byKey = Object.fromEntries(
      vm.rows.map(r => [r.key.text, r.value.text ?? r.value.html])
    );

    expect(byKey["Claim ID"]).to.equal(String(claim.id));
    if (claim.client) expect(byKey["Client"]).to.equal(claim.client);
    if (claim.category) expect(byKey["Category"]).to.equal(claim.category);
    if (claim.concluded) expect(byKey["Concluded"]).to.equal(formatDate(claim.concluded));
    if (claim.feeType) expect(byKey["Fee type"]).to.equal(claim.feeType);
    if (claim.claimed != null) expect(byKey["Claimed"]).to.equal(formatClaimed(claim.claimed));

    // Optional: Submission row is a link (if present)
    if (claim.submissionId && byKey["Submission"]) {
      expect(byKey["Submission"]).to.contain(`/submissions/${encodeURIComponent(claim.submissionId)}`);
    }
  });
});
