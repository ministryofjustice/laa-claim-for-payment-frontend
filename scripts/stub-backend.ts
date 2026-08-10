/* eslint-disable
  @typescript-eslint/no-explicit-any,
  @typescript-eslint/no-unsafe-assignment,
  @typescript-eslint/no-unsafe-call,
  @typescript-eslint/no-unsafe-member-access,
  @typescript-eslint/no-unsafe-return,
  @typescript-eslint/no-unsafe-type-assertion,
  @typescript-eslint/no-unsafe-argument,
  @typescript-eslint/explicit-function-return-type,
  @typescript-eslint/init-declarations,
  @typescript-eslint/prefer-destructuring -- test helper: dynamic MSW→Express adapter, intentionally loose types
*/

import {
  createApiHandlers,
  createGate,
} from "#tests/playwright/factories/handlers/api.js";
import express from 'express'

const VALID_METHODS = ['get', 'post', 'put', 'patch', 'delete'] as const
type ValidMethod = (typeof VALID_METHODS)[number]

// Utility to convert MSW handlers into Express routes
function applyHandlers(app: express.Express, handlers: any[]) {
   
  for (const handler of handlers) {
    const method = handler.info.method.toLowerCase()

    if (!VALID_METHODS.includes(method)) continue
    const path = new URL(handler.info.path, 'http://localhost:8080').pathname

    app[method as ValidMethod](path, async (req, res) => {
      const mswRes = await handler.resolver({ request: req, params: req.params})
      res.status(mswRes.status ?? 200)

      let body: any

      if (typeof mswRes.text === 'function') {
        body = await mswRes.json().catch(() => mswRes.text())
      } else {
        body = mswRes.body ?? ''
      }

      if (typeof body === 'object') {
        res.json(body)
      } else {
        res.send(body)
      }
    })
  }
}

const app = express()
app.use(express.json())

const uploadGate = createGate();

applyHandlers(app, createApiHandlers(uploadGate));

app.post("/test/release-upload", (_req, res) => {
  uploadGate.release();
  res.sendStatus(204);
});

app.post("/test/reset-upload", (_req, res) => {
  uploadGate.reset();
  res.sendStatus(204);
});

const PORT = 8080
app.listen(PORT, () => { console.log(`🟢 Mock backend running on port ${PORT}`); })
