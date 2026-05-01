# Project Rules — Claude Code Must Follow These Always

## Pre-flight checklist (run through this before writing ANY code)

1. Does a similar util/hook/component already exist in the codebase? Search first.
2. Will this file exceed 250 lines? If yes, plan the split before starting.
3. Is this a server or client component? Default to server. Add `"use client"` only when needed.
4. Does this belong in `components/`, `lib/`, or `services/`? Place it correctly.
5. Will this require a new npm package? Ask the user before installing anything new.

---

## Hard rules — never violate these

### File size

- **Never create a file longer than 250 lines.** If approaching the limit, split into smaller modules before continuing.
- One component per file. No exceptions.
- **Exception: `prisma/schema.prisma` has no line limit.** The schema grows with the data model and must not be split.

### Functions

- **Max 3 parameters per function.** Beyond 3, use an options object: `function foo({ a, b, c, d }: FooOptions)`
- **Max 40 lines per function body.** Extract helpers if needed.
- Always declare explicit return types on functions.

### TypeScript

- **Never use `any`.** Use `unknown` and narrow it, or define a proper type.
- Always define prop interfaces above the component in the same file.
- Use `type` for unions/primitives, `interface` for object shapes.

### Imports & exports

- **No default exports** — except in `app/` page and layout files (Next.js requires it).
- Named exports everywhere else.
- Import order: builtin → external → internal (`@/`) → relative (`./`)

### Forbidden patterns

- **Never `fetch()` directly inside a component.** All data fetching goes through `src/services/`.
- **Never use `console.log`.** Use the pino logger from `src/lib/logger.ts`.
- **Never prop-drill more than 2 levels.** Use Context or Zustand instead.
- **Never hardcode secrets or API URLs.** Use env vars validated by `src/env.ts`.
- No `// @ts-ignore` or `// @ts-nocheck` comments.
- No `!` non-null assertions unless you add a comment explaining why it's safe.

---

## Folder structure — always follow this

```
app/                  # Next.js App Router pages & layouts only
components/           # All React components — shared primitives + domain folders
├── ui/               # Primitive UI elements (Button, Input, Modal...)
├── [domain]/         # Domain folders, flat (e.g. campaigns/, dsp/, ssp/, onboarding/)
│   ├── *.tsx         # Components for this domain — no nested components/ folder
│   └── types.ts      # Types for this domain (optional)
└── *.tsx             # Top-level shared components used across domains
hooks/                # Shared hooks used across multiple domains
lib/                  # Shared utilities (logger, dates, formatting...)
services/             # All external API calls — typed, never in components
stores/               # Zustand stores
env.ts                # Type-safe env vars (t3-oss/env-nextjs)
```

- **No `features/` folder.** All components live under `components/`. Domain components go in flat domain folders (e.g. `components/campaigns/CampaignForm.tsx`, not `features/campaigns/components/CampaignForm.tsx`).
- Domain folders are flat — no nested `components/` subfolder. Files sit directly inside the domain folder.
- Domain folders can import from each other when it genuinely makes sense, but if two domains share something, lift it to a top-level `components/` file or to `lib/`.
- Imports use `@/components/<domain>/<File>` (e.g. `@/components/dsp/DspCTA`). For shared primitives use `@/components/<file>` (e.g. `@/components/page-elements`).

---

## Naming conventions

| Thing            | Convention                        | Example                          |
| ---------------- | --------------------------------- | -------------------------------- |
| React components | PascalCase                        | `UserCard.tsx`                   |
| Hooks            | camelCase, `use` prefix           | `useUserData.ts`                 |
| Utils/helpers    | camelCase                         | `formatDate.ts`                  |
| Types/interfaces | PascalCase                        | `UserCardProps`, `ApiResponse`   |
| Zustand stores   | camelCase, `use` prefix + `Store` | `useAuthStore.ts`                |
| Server actions   | camelCase, verb first             | `createUser.ts`, `deletePost.ts` |
| Constants        | SCREAMING_SNAKE_CASE              | `MAX_FILE_SIZE`                  |

---

## State management rules

- Local UI state → `useState`
- Shared client state → Zustand (in `src/stores/`)
- Server state / async → TanStack Query
- Forms → React Hook Form + Zod resolver
- Never mix Zustand and React Query for the same data

---

## Validation rules

- **All external data must be validated with Zod** — API responses, form inputs, env vars, URL params
- Define Zod schemas in the same file as the type, or in `components/<domain>/types.ts`
- Infer TypeScript types from Zod schemas: `type User = z.infer<typeof UserSchema>`

---

## After every code change

1. Run `pnpm lint` and fix ALL errors before saying the task is done.
2. Run `pnpm type-check` (`tsc --noEmit`) and fix all type errors.
3. If you modified a component, check that its props interface is still accurate.
4. If you created a new file, confirm it's in the right folder per the structure above.

---

## Server vs client components

- **Default: server component.** No `"use client"` directive.
- Add `"use client"` only when the component uses: `useState`, `useEffect`, browser APIs, event handlers, or third-party client-only libs.
- Never fetch data in a client component — use server components or React Query.
- Keep `"use client"` components as leaf nodes — push them down the tree as far as possible.

---

## What NOT to do (common AI mistakes to avoid)

- Don't create a new `utils.ts` at the root — check if `lib/` already has what you need
- Don't install new packages without asking — we have a curated dep list
- Don't create barrel files (`index.ts`) — import each component directly from its file
- Don't add `useEffect` for data that can be fetched server-side
- Don't create a new Context when Zustand already handles that state
- Don't write inline styles — use Tailwind classes
- Don't generate placeholder/TODO code and leave it — finish what you start
- **Never import icons from `lucide-react`.** All icons must be custom SVG components in `icons/` following the established pattern (18×18 viewBox, `IconProps` type, `fill` + `secondaryfill` at 0.4 opacity). Add new icons to `icons/index.ts` and export them as named exports.
