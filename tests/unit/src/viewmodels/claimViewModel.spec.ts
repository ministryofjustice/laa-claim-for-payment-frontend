import { ClaimViewModel } from "#src/viewmodels/claimViewModel.js";
import type { ClaimDto } from "#src/types/Claim.js";
import { getClaimsSuccessResponseData } from "#tests/assets/getClaimsResponseData.js";
import { expect } from "chai";
import {
  formatDate,
  formatClaimed,
} from "#src/helpers/index.js";

describe("ClaimViewModel constructor()", () => {
  it("builds the title and summary rows", () => {
    const claim: ClaimDto = getClaimsSuccessResponseData.body!.data![0]!;
    const vm = new ClaimViewModel(claim);

    expect(vm.title).to.equal("TODO");

    const byKey = Object.fromEntries(
      vm.rows.map((r) => [r.key.text, r.value.text ?? r.value.html]),
    );

    expect(byKey["Claim ID"]).to.equal(String(claim.id));
    expect(byKey["Client"]).to.equal(claim.client);
    expect(byKey["Category"]).to.equal(claim.category);
    expect(byKey["Concluded"]).to.equal("18/03/2025");
    expect(byKey["Fee type"]).to.equal(claim.feeType);
    expect(byKey["Claimed"]).to.equal("£234.56");
  });
});
