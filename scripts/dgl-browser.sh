#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  printf 'Usage: %s <free|paid> [open|CLI command] [arguments...]\n' "$0" >&2
  exit 2
fi

account="$1"
shift
case "$account" in
  free|paid) ;;
  *) printf 'Account must be "free" or "paid".\n' >&2; exit 2 ;;
esac

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd -- "$script_dir/.." && pwd)"
cli_home="${CODEX_HOME:-$HOME/.codex}"
playwright_cli="${PLAYWRIGHT_CLI:-$cli_home/skills/playwright/scripts/playwright_cli.sh}"
base_url="${PLAYWRIGHT_BASE_URL:-http://localhost:5173}"
state_file="$repo_root/playwright/.auth/$account.json"
output_dir="$repo_root/output/playwright"
session="dgl-$account"
action="${1:-open}"
if [[ $# -gt 0 ]]; then shift; fi

if [[ ! -x "$playwright_cli" ]]; then
  printf 'Playwright CLI wrapper not found or not executable: %s\n' "$playwright_cli" >&2
  exit 1
fi
state_is_fresh() {
  [[ -f "$state_file" ]] || return 1
  node --input-type=module - "$state_file" >/dev/null 2>&1 <<'NODE'
import fs from "node:fs";
const state = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const cookie = state.cookies.find((item) => item.name === "__session");
const payload = cookie && JSON.parse(Buffer.from(cookie.value.split(".")[1], "base64url").toString());
process.exit(payload?.exp * 1000 > Date.now() + 15_000 ? 0 : 1);
NODE
}

mkdir -p "$output_dir"
cd "$output_dir"
if [[ "$action" == "open" ]]; then
  if ! state_is_fresh; then
    printf 'Refreshing expired or missing local Clerk states...\n'
    (cd "$repo_root" && npm run auth:setup)
  fi
  "$playwright_cli" --session "$session" open "$base_url" --browser chromium "$@"
  "$playwright_cli" --session "$session" state-load "$state_file"
  "$playwright_cli" --session "$session" goto "$base_url/app/dashboard"
  login_file="$output_dir/.dgl-login-$account.mjs"
  node "$repo_root/scripts/write-dgl-browser-login.mjs" "$account" "$base_url" "$login_file"
  "$playwright_cli" --session "$session" run-code --filename "$(basename "$login_file")"
  "$playwright_cli" --session "$session" state-save "$state_file"
  node --input-type=module -e 'import { unlinkSync } from "node:fs"; unlinkSync(process.argv[1])' "$login_file"
  "$playwright_cli" --session "$session" snapshot
else
  "$playwright_cli" --session "$session" "$action" "$@"
fi
