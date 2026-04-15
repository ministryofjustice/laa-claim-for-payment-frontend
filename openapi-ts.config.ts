import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'openapi/claim/v3/api-docs.json',
  output: 'src/generated/claim-api',
  plugins: ['@hey-api/client-axios'],
});