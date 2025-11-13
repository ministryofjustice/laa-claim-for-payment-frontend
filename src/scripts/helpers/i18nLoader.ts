/* eslint-disable
  @typescript-eslint/no-unsafe-assignment,
  @typescript-eslint/no-unsafe-argument -- JSON locale loader; data shape is trusted static content
*/
/**
 * Simple i18next loader following official best practices
 * Provides i18next.t("common.back") syntax in TypeScript
 * and {{ t("common.back") }} syntax in Nunjucks templates
 */

import i18next, { type i18n as I18nInstance } from 'i18next';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { LanguageDetector } from '#node_modules/i18next-http-middleware/esm/index.js';

/**
 * Initialise i18next synchronously using Node.js fs methods
 * This ensures i18next is ready before any modules that use translations are loaded
 */
export function initializeI18nextSync(): void {
  const enPath = path.join(process.cwd(), 'locales', 'en.json');
  const cyPath = path.join(process.cwd(), 'locales', 'cy.json');

  const en = JSON.parse(readFileSync(enPath, 'utf8'));
  const cy = JSON.parse(readFileSync(cyPath, 'utf8'));

  void i18next
    .use(LanguageDetector)
    .init({
      fallbackLng: 'en',
      debug: process.env.NODE_ENV === 'development',

      detection: {
        order: ['querystring', 'cookie'],
        lookupQuerystring: 'lng',
        lookupCookie: 'i18next',
        caches: ['cookie'],
        cookieSecure: false
      },

      ns: Object.keys(en),
      defaultNS: 'common',
      nsSeparator: '.',
      keySeparator: '.',

      interpolation: {
        escapeValue: false,
        prefix: '{',
        suffix: '}',
      },

      resources: {
        en,
        cy
      }
    });
}


/**
 * Get the i18next instance for direct use
 */
export const i18n: I18nInstance = i18next;

/**
 * Translation function wrapper that ensures i18next is ready
 * Usage: t("common.back") or t("pages.caseDetails.tabs.clientDetails")
 * @param {string} key - Translation key with dot notation for namespaces
 * @param {Record<string, unknown>} [options] - Optional interpolation values
 * @returns {string} The translated string
 */
export const t = (key: string, options?: Record<string, unknown>): string => {
  // Ensure i18next is initialised before calling translation
  if (!i18next.isInitialized) {
    console.warn(`i18next not initialised when translating: ${key}`);
    return key; // Return the key as fallback
  }

  return i18next.t(key, options);
};

/**
 * Express locale loader interface for backwards compatibility
 */
export interface ExpressLocaleLoader {
  t: (key: string, options?: Record<string, unknown>) => string;
}

/**
 * Nunjucks global function for templates
 * Usage in templates: {{ t("common.back") }} or {{ t("pages.caseDetails.tabs.clientDetails") }}
 * @param {string} key - Translation key
 * @param {Record<string, unknown>} [options] - Optional interpolation values
 * @returns {string} The translated string
 */
export const nunjucksT = (key: string, options?: Record<string, unknown>): string =>
  t(key, options);
