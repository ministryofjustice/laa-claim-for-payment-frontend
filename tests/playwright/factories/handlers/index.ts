/**
 * MSW Handlers Index
 * 
 * Composes all domain-specific handlers into a single array for MSW server.
 * Following MSW best practices for modular handler organization.
 * 
 * @see https://mswjs.io/docs/best-practices/structuring-handlers
 */

import { http, HttpResponse, passthrough } from 'msw';
import { apiHandlers } from './api.js';

const debugHandler = http.all('*', ({ request }) => 
  passthrough()
);

/**
 * Combined handlers array
 * Using the comprehensive API handlers that match the application's real API calls
 */
export const handlers = [
  debugHandler,
  ...apiHandlers,
  
  // Health check endpoint for testing
  http.get('/health', () => HttpResponse.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      msw: 'active'
    }))
];
