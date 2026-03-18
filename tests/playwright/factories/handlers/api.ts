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

  http.get('/api/v1/claims/:id', ({ params }) => {
    console.log('🧩 MSW matched: GET /api/v1/claims/:id', params.id);
    const claim = makeFakeClaim(Number(params.id));
    return HttpResponse.json(claim);
  }),
];
