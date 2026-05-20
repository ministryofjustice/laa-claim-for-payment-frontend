/**
 * Helpers Index
 *
 * Central export point for all helper utilities.
 * This allows for cleaner imports throughout the application.
 *
 * Usage:
 * import { devLog, safeString, formatDate } from '#src/scripts/helpers';
 */

// Data transformation utilities
export {
  safeString,
  safeOptionalString,
  booleanToString,
  isRecord,
  safeStringFromRecord,
  hasProperty,
  capitaliseFirst,
  safeBodyString,
  extractFormFields,
  safeApiField,
  safeNestedField,
  extractCurrentFields,
  normaliseSelectedCheckbox,
  isYes
} from './dataTransformers.js';

// Session helpers
export {
  storeSessionData,
  getSessionData,
  clearSessionData,
  clearAllOriginalFormData,
  storeOriginalFormData
} from './sessionHelpers.js';

export {
  initializeI18nextSync,
  i18n,
  t,
  nunjucksT,
  type ExpressLocaleLoader
} from './i18nLoader.js';
