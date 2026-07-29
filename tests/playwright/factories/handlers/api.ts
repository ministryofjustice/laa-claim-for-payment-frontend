import { http, HttpResponse } from "msw";
import { UUID } from "uuidv7";

export const claim1Id = UUID.parse("019f5ba6-1dfc-7caf-b276-75ac6373525a");
export const claim2Id = UUID.parse("019f5ba6-4c9f-7b54-9f44-a625db7adeab");
export const claim3Id = UUID.parse("019f5ba6-6849-7214-9436-af6269d2d0fd");
export const lineItemId = UUID.parse("019f6098-0f50-7f43-9508-7f5da5817a72");
export const evidenceId = UUID.parse("019f6098-3305-70be-82c6-e4b74c5749d0");

export const profitCostDraftClaim1Id = UUID.parse(
  "019faf99-e88a-71f7-b467-cd3aa9f643aa",
);

/**
 * create a stub claim helper method
 * @param { UUID } id id of the claim to create
 * @param { object } overrides any overrides to be
 * @returns { object } object for stubbed API response
 */
function makeFakeClaim(id: UUID, overrides = {}): object {
  return {
    id,
    client: "Giordano",
    category: "Family",
    concluded: "2025-03-18",
    feeType: "Escape",
    claimed: 234.56,
    submissionId: "550e8400-e29b-41d4-a716-446655440000",
    lineItems: [
      {
        id: lineItemId,
        title: "Interim hearing on 20 December 2023",
        category: "Work Item",
        date: "2024-01-04",
        evidenceItems: [],
      },
    ],
    evidence: [],
    ...overrides,
  };
}

const profitCostDraftClaim1: object = {
  id: profitCostDraftClaim1Id.toString(),
  costType: "PROFIT_COST",
  courtType: "COUNTY_COURT",
  clientPartyStatus: "CHILD",
  firstActingSolicitorFlag: true,
  transferOfSolicitorFlag: false,
  clientsRetainedCount: "ZERO",
  clientsStartCount: "ONE",
  multiClientHearingFlag: true,
  escaped: true,
  lineItems: [],
  evidence: [],
};

/**
 * API handlers that intercept outbound requests from the Express app
 */
export const apiHandlers = [
  // match any host or protocol
  http.get("/api/v1/claims", ({ request }) => {
    const url = new URL(request.url, "http://localhost:8080");
    const page = Number(url.searchParams.get("page"));
    const limit = Number(url.searchParams.get("limit"));

    console.log("🧩 MSW matched: GET /api/v1/claims");
    const claims = [
      makeFakeClaim(claim1Id),
      makeFakeClaim(claim2Id),
      makeFakeClaim(claim3Id),
    ];

    return HttpResponse.json({
      claims,
      page,
      limit,
      total: 3,
      totalPages: 1,
    });
  }),

  http.get("/api/v1/claims/:claimId", ({ params }) => {
    const { claimId } = params;
    if (typeof claimId !== "string") {
      throw new Error("URL missing a valid string id param.");
    }
    console.log("🧩 MSW matched: GET /api/v1/claims/%s", claimId);
    if (claimId === claim2Id.toString()) {
      return HttpResponse.error();
    } else if (claimId === profitCostDraftClaim1Id.toString()) {
      return HttpResponse.json(profitCostDraftClaim1);
    } else {
      const claim = makeFakeClaim(UUID.parse(claimId));
      return HttpResponse.json(claim);
    }
  }),

  http.post(
    "/api/v1/claims/:claimId/line-items/:lineItemId/upload-evidence",
    ({ params }) => {
      const { claimId, lineItemId } = params;
      if (typeof claimId !== "string" || typeof lineItemId !== "string") {
        throw new Error("URL missing valid string id params.");
      }
      console.log(
        "🧩 MSW matched: POST /api/v1/claims/%s/line-items/%s/upload-evidence",
        claimId,
        lineItemId,
      );

      const response = {
        type: "success",
        evidenceId,
        file: {
          filename: "test.pdf",
          originalname: "test.pdf",
          filesize: 12345,
        },
        message: `File uploaded with ID: ${evidenceId.toString()}`,
      };

      return HttpResponse.json(response, { status: 201 });
    },
  ),

  http.delete(
    "/api/v1/claims/:claimId/line-items/:lineItemId/evidence/:evidenceId",
    ({ params }) => {
      const { claimId, lineItemId, evidenceId } = params;
      if (
        typeof claimId !== "string" ||
        typeof lineItemId !== "string" ||
        typeof evidenceId !== "string"
      ) {
        throw new Error("URL missing valid string id params.");
      }
      console.log(
        "🧩 MSW matched: DELETE /api/v1/claims/%s/line-items/%s/evidence/%s",
        claimId,
        lineItemId,
        evidenceId,
      );

      return HttpResponse.json(null, { status: 204 });
    },
  ),
];
