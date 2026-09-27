#!/usr/bin/env bash
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT/backend"
exec "$ROOT/.venv/bin/uvicorn" main:app --reload --host 127.0.0.1 --port 8000