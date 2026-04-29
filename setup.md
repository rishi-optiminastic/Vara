# Production Setup — Installation Guide

Follow these steps in order to wire up all the rules in your existing `x` project.

---

## Step 1 — Copy files into your project root

Copy these files from this bundle to your project root (`x/`):

```
CLAUDE.md                          ← root of project
eslint.config.mjs                  ← replace your existing one
.prettierrc                        ← root of project
tsconfig.json                      ← replace your existing one
lint-staged.config.mjs             ← root of project
commitlint.config.mjs              ← root of project
.editorconfig                      ← root of project
.vscode/settings.json              ← create .vscode/ folder if missing
.vscode/extensions.json
.github/workflows/ci.yml           ← create .github/workflows/ if missing
.github/pull_request_template.md
src/env.ts                         ← in your src/ folder
src/lib/logger.ts                  ← in src/lib/
src/services/example.service.ts    ← shows the service pattern, can delete after reading
```

---

## Step 2 — Install new dev dependencies

```bash
pnpm add -D \
  @commitlint/cli \
  @commitlint/config-conventional \
  @eslint/eslintrc \
  @next/bundle-analyzer \
  @playwright/test \
  @testing-library/react \
  @testing-library/user-event \
  @trivago/prettier-plugin-sort-imports \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  @vitejs/plugin-react \
  eslint-plugin-import \
  eslint-plugin-prettier \
  husky \
  jsdom \
  knip \
  lint-staged \
  prettier \
  prettier-plugin-tailwindcss \
  vitest
```

## Step 3 — Install new prod dependencies

```bash
pnpm add \
  @sentry/nextjs \
  @t3-oss/env-nextjs \
  @tanstack/react-query \
  next-safe-action \
  pino \
  pino-pretty \
  zod \
  zustand
```

---

## Step 4 — Set up Husky (git hooks)

```bash
pnpm prepare           # initialises husky
npx husky add .husky/pre-commit "pnpm lint-staged"
npx husky add .husky/commit-msg "npx --no -- commitlint --edit \${1}"
```

---

## Step 5 — Add scripts to your package.json

Merge the `scripts` from `package.scripts.json` into your existing `package.json`:

```json
"lint": "eslint . --max-warnings 0",
"lint:fix": "eslint . --fix --max-warnings 0",
"type-check": "tsc --noEmit",
"format": "prettier --write .",
"format:check": "prettier --check .",
"test": "vitest",
"test:e2e": "playwright test",
"analyze": "ANALYZE=true next build",
"prepare": "husky",
"dead-code": "knip"
```

---

## Step 6 — Update src/env.ts with your actual env vars

Add your real env vars to `src/env.ts` following the pattern in the file.
Then add them to `.env.local` and a `.env.example` (committed, no real values).

---

## Step 7 — Verify everything works

```bash
pnpm lint          # should pass (or show existing violations to fix)
pnpm type-check    # should pass
pnpm build         # should succeed
```

---

## How Claude Code follows these rules automatically

`CLAUDE.md` is read by Claude Code at the start of **every session** automatically — you don't have to paste rules into the chat. It acts as standing instructions.

To make it even more reliable, also add this to your Claude Code settings (`.claude/settings.json`):

```json
{
  "permissions": {
    "allow": ["Bash(pnpm lint:*)", "Bash(pnpm type-check)", "Bash(pnpm test:*)"]
  }
}
```

This lets Claude Code run lint and type-check after every change without prompting you for permission each time.

---

## Folder structure to create if missing

```bash
mkdir -p src/features src/services src/stores src/lib src/components/ui
```
