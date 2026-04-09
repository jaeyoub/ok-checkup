# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server on port 8080
npm run build        # Production build
npm run build:dev    # Development build
npm run lint         # ESLint
npm test             # Run Vitest once
npm run test:watch   # Vitest watch mode
npm run preview      # Preview built output
```

To run a single test file: `npx vitest run src/path/to/file.test.ts`

## Architecture

This is a React + TypeScript checklist management app ("OK금융 업무 점검") built with Vite and backed by Supabase.

**Stack**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, TanStack React Query, React Hook Form + Zod, Supabase, Lovable cloud-auth (Google OAuth).

**Source layout**:
- `src/pages/` — Route-level components. `Index.tsx` is the main checklist page.
- `src/components/` — Feature components (`ChecklistCard`, `AddItemForm`, `FilterTabs`, `ProgressHeader`, `LoginPage`). `src/components/ui/` contains shadcn/ui primitives — do not edit these manually; use the shadcn CLI.
- `src/hooks/` — Custom hooks. `useChecklist.ts` is the core hook wrapping all Supabase queries and mutations via React Query.
- `src/contexts/AuthContext.tsx` — Global auth state (current user session).
- `src/integrations/supabase/` — Supabase client and auto-generated DB types (`types.ts`). Do not manually edit `types.ts`; regenerate it via Supabase CLI when the schema changes.
- `supabase/migrations/` — Database migration files.

**Data flow**: Auth state lives in `AuthContext`. Server state (checklist items) is managed by TanStack React Query via hooks in `useChecklist.ts`. All DB operations go through the Supabase client in `src/integrations/supabase/client.ts`.

**Path alias**: `@/` maps to `src/`.

**Styling**: Tailwind CSS with HSL CSS variables for theming (defined in `index.css`). Use `cn()` from `@/lib/utils` for conditional classnames.

## Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_PROJECT_ID=
```

## Testing

- Unit/integration tests: Vitest with JSDOM, `@testing-library/react`. Setup file at `src/test/setup.ts`.
- E2E tests: Playwright (`playwright.config.ts`, `playwright-fixture.ts`).
