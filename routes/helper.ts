export const ROUTES = {
  CLAIMS: '/',
  CHOOSE_UPLOAD: '/claims/:claimId/choose-upload',
  UPLOAD_EVIDENCE_INDIVIDUALLY: "/claims/:claimId/upload-evidence-individually",
  UPLOAD_FILE_FOR_LINE_ITEM: "/claims/:claimId/upload-evidence-individually/:lineItemId/file-upload",
  VIEW_CLAIM: '/claims/:claimId',
} as const;

/**
 * Builds a route by replacing named parameters with encoded values.
 *
 * @param {string} route The route pattern containing named parameters.
 * @param {Record<string, string | number>} params The parameter values to insert into the route.
 * @returns {string} The route with parameters replaced.
 */
export function buildRoute(
  route: string,
  params: Record<string, string | number>
): string {
  return Object.entries(params).reduce(
    (path, [key, value]) =>
      path.replace(`:${key}`, encodeURIComponent(String(value))),
    route
  );
}
