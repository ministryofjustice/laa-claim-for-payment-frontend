import type { AxiosInstanceWrapper } from "middleware-axios";
import type { ExpressLocaleLoader } from "#src/scripts/helpers/index.js";
import type { SessionOIDC } from "#utils/openidSetup.js"

declare module "express-serve-static-core" {
  interface Request {
    axiosMiddleware: AxiosInstanceWrapper;
    locale: ExpressLocaleLoader;
  }
}

// Extend the Express session interface to support dynamic namespaces
declare module 'express-session' {
  interface SessionData extends Record<string, Record<string, string> | string | undefined> {
    oidc?: SessionOIDC;
  }
}

declare module 'express-serve-static-core' {
  // csrfToken is already defined in Request by csrf-sync

  // Add csrfToken to Response locals
  interface Locals {
    csrfToken?: string;
  }
}

export {};
