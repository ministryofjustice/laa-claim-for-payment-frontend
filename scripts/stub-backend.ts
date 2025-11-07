import express from 'express'
import { apiHandlers } from '../tests/playwright/factories/handlers/api.ts';

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

      // New MSW v2 Response format
      if (typeof mswRes.text === 'function') {
        // it's a Response-like object
        body = await mswRes.json().catch(() => mswRes.text())
      } else {
        // fallback for older or stub objects
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

applyHandlers(app, apiHandlers)

const PORT = 8080
app.listen(PORT, () => console.log(`🟢 Mock backend running on port ${PORT}`))
