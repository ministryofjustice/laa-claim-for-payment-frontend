#!/usr/bin/env bash
set -euo pipefail

yarn redis:start

cleanup() {
  yarn redis:stop
}

trap cleanup EXIT

yarn playwright test --config=playwright.config.ts