import { Page, Route, Request } from "@playwright/test";

export type ApiClaim = {
  id: number;
  client?: string;
  category?: string;
  concluded?: string; // ISO
  feeType?: string;
  claimed?: number;
  submissionId?: string;
};

export const defaultClaim: ApiClaim = {
    id: 1,
    client: "Giordano",
    category: "Family",
    concluded: "2025-03-18",
    feeType: "Escape",
    claimed: 234.56,
    submissionId: "550e8400-e29b-41d4-a716-446655440000",
}

export async function mockGetClaims(
  page: Page,
  claims: ApiClaim[] = [defaultClaim],
  { once = false }: { once?: boolean } = {}
) {
  const pattern = "**/api/v1/claims*";
  const handler = async (route: Route, _req: Request) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(claims),
    });
  };
  return once ? page.route(pattern, handler, { times: 1 }) : page.route(pattern, handler);
}

export async function mockGetClaim(
  page: Page,
  claim: ApiClaim = defaultClaim,
  { once = false }: { once?: boolean } = {}
) {
  const pattern = `**/api/v1/claims/${claim.id}`;
  const handler = async (route: Route, _req: Request) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(claim),
    });
  };
  return once ? page.route(pattern, handler, { times: 1 }) : page.route(pattern, handler);
}

export async function mockNetworkError(page: Page, urlPattern: string) {
  await page.route(urlPattern, (route) => route.abort("failed"));
}
