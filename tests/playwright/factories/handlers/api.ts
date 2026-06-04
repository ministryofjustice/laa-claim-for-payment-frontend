import { http, HttpResponse } from 'msw';

/**
 * create a stub claim helper method
 * @param { number } id id of the claim to create
 * @param { object } overrides any overrides to be 
 * @returns { object } object for stubbed API response
 */
export function makeFakeClaim(id: number, overrides = {}): object {
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
        id: 1,
        title: "Interim hearing on 20 December 2023",
        category: "Work Item",
        date: "2024-01-04",
        evidenceItems: [],
      },
    ],
    evidence: [],
    ...overrides
  }
}

/**
 * API handlers that intercept outbound requests from the Express app
 */
export const apiHandlers = [
  // match any host or protocol
  http.get('/api/v1/claims', ({ request }) => {
    const url = new URL(request.url, 'http://localhost:8080');
    const page = Number(url.searchParams.get('page'));
    const limit = Number(url.searchParams.get('limit'));

    console.log('🧩 MSW matched: GET /api/v1/claims');
    const claims = [makeFakeClaim(1), makeFakeClaim(2), makeFakeClaim(3)];

    return HttpResponse.json({
      claims,
      page,
      limit,
      total: 3,
      totalPages: 1,
    });
  }),

  http.get('/api/v1/claims/:claimId', ({ params }) => {
    const { claimId } = params;
    if (typeof claimId !== 'string') {
      throw new Error('URL missing a valid string id param.');
    }
    console.log('🧩 MSW matched: GET /api/v1/claims/%s', claimId);
    if (claimId === '2') {
      return HttpResponse.error();
    } else {
      const claim = makeFakeClaim(Number(claimId));
      return HttpResponse.json(claim);
    }
  }),

  http.post('/api/v1/claims/:claimId/line-items/:lineItemId/upload-evidence', ({ params }) => {
    const { claimId, lineItemId } = params;
    if (typeof claimId !== 'string' || typeof lineItemId !== 'string') {
      throw new Error('URL missing valid string id params.');
    }
    console.log('🧩 MSW matched: POST /api/v1/claims/%s/line-items/%s/upload-evidence', claimId, lineItemId);

    const response = {
      type: "success",
      evidenceId: 1,
      file: {
        filename: "test.pdf",
        originalname: "test.pdf",
        filesize: 12345
      },
      message: "File uploaded with ID: 1"
    };

    return HttpResponse.json(response, { status: 201 });
  }),

  http.delete('/api/v1/claims/:claimId/line-items/:lineItemId/evidence/:evidenceId', ({ params }) => {
    const { claimId, lineItemId, evidenceId } = params;
    if (typeof claimId !== 'string' || typeof lineItemId !== 'string' || typeof evidenceId !== 'string') {
      throw new Error('URL missing valid string id params.');
    }
    console.log('🧩 MSW matched: DELETE /api/v1/claims/%s/line-items/%s/evidence/%s', claimId, lineItemId, evidenceId);

    return HttpResponse.json(null, { status: 204 });
  }),
];
