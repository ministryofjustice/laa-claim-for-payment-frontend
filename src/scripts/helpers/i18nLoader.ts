/* eslint-disable
@typescript-eslint/no-unsafe-assignment -- JSON locale loader; data shape is trusted static content
*/

/**
 * Simple i18next loader following official best practices
 * Provides i18next.t('common.back') syntax in TypeScript
 * and {{ t('common.back') }} syntax in Nunjucks templates
 */

import i18next, {
  type i18n as I18nInstance,
  type Resource,
  type ResourceLanguage,
} from 'i18next';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { LanguageDetector } from 'i18next-http-middleware';

export const SUPPORTED_LANGUAGES: readonly string[] = ['en', 'cy'];

/**
 * Initialise i18next synchronously using Node.js fs methods
 * This ensures i18next is ready before any modules that use translations are loaded
 */
export function initializeI18nextSync(): void {
  const resources: Resource = {};

  for (const locale of SUPPORTED_LANGUAGES) {
    const localePath = path.join(
      process.cwd(),
      'locales',
      `${locale}.json`,
    );

    const localeResource: ResourceLanguage = JSON.parse(
      readFileSync(localePath, 'utf8'),
    );

    resources[locale] = localeResource;
  }

  const {en} = resources;

  void i18next
    .use(LanguageDetector)
    .init({
      fallbackLng: 'en',
      supportedLngs: SUPPORTED_LANGUAGES,
      debug: process.env.NODE_ENV === 'development',

      detection: {
        order: ['querystring', 'cookie'],
        lookupQuerystring: 'lng',
        lookupCookie: 'i18next',
        caches: ['cookie'],
        cookieSecure: process.env.NODE_ENV === 'production',
        cookieHttpOnly: true,
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

      resources,
    });
}

/**
 * Get the i18next instance for direct use
 */
export const i18n: I18nInstance = i18next;

/**
 * Translation function wrapper that ensures i18next is ready
 * Usage: t('common.back') or t('pages.caseDetails.tabs.clientDetails')
 *
 * @param {string} key Translation key with dot notation for namespaces.
 * @param {Record<string, unknown>} [options] Optional interpolation values.
 * @returns {string} The translated string.
 */
export const t = (
  key: string,
  options?: Record<string, unknown>,
): string => {
  if (!i18next.isInitialized) {
    console.warn(`i18next not initialised when translating: ${key}`);
    return key;
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
 * Usage in templates: {{ t('common.back') }} or {{ t('pages.caseDetails.tabs.clientDetails') }}
 *
 * @param {string} key Translation key.
 * @param {Record<string, unknown>} [options] Optional interpolation values.
 * @returns {string} The translated string.
 */
export const nunjucksT = (
  key: string,
  options?: Record<string, unknown>,
): string => t(key, options);