# Montis Mobile — Architecture

## Folder layout

```
app/                    # Expo Router — routes only (re-exports or legacy redirects)
src/features/<domain>/  # Screens, hooks, API, types per product area
src/shared/             # UI kit, theme, HTTP client, storage
assets/                 # Images, fonts
data/                   # Static JSON consumed by features
```

## Where to put new code

| Kind | Location |
|------|----------|
| New screen | `src/features/<domain>/views/` + one line in `app/...` |
| Shared button/input | `src/shared/components/` |
| API call | `src/features/<domain>/api.ts` using `request` / `requestAuth` from `@/shared/api/client` |
| Auth/session | `@/features/auth/context/AuthProvider` |
| Onboarding draft state | `@/features/onboarding/context/OnboardingProvider` |

## Imports

- Prefer `@/features/...` and `@/shared/...`
- Do **not** use removed paths: `components/`, `contexts/`, `services/api`
- `app/*` should re-export views, not import hooks from other features

## Routes

Canonical URLs use **kebab-case English** (no legacy redirect routes).

| Tab / area | Route |
|------------|-------|
| Home | `/(tabs)/home` |
| Groups | `/(tabs)/groups` |
| Crisis | `/(tabs)/crisis` |
| Agenda | `/(tabs)/agenda` |
| Services | `/(tabs)/services` |
| Settings menu | `/settings` |
| Daily tracking | `/tracking/[date]` |
| Register | `/(auth)/register` |

## Crisis vs crisisSupport

- **`crisis`** — Tab UI and emergency actions. See [`src/features/crisis/README.md`](src/features/crisis/README.md).
- **`crisisSupport`** — Config-stack tools: log, coping tools, resources (`/(config)/crisis-*`).

## Data layer

- **REST** via NestJS (`API_URL` in `.env`, `npm run api:url` for LAN IP).
- **Auth token:** Firebase **ID token** from login/register, stored in SecureStore; attach with `requestAuth`.
- **Daily tracking:** `GET/PUT /auth/tracking/:date`, `GET /auth/tracking/month?year=&month=` (month 1–12).
- **Crisis log:** `GET/POST/PUT/DELETE /crisis-log`.
- **Sobriety:** `GET /sobriety/data` (home counter prefers API, falls back to onboarding dates).

## Shared contracts

Type-only interfaces live in [`../contracts/`](../contracts/) and are imported as `@montis/contracts/*` (e.g. `@montis/contracts/crisisLog`). Mobile feature types should stay aligned with these shapes; Nest DTOs use class-validator but match the same fields.

## State

- **Server state:** TanStack Query (`useQuery` / `useMutation` + per-feature `queryKeys.ts`) for auth, emergency contacts, crisis log, sobriety, groups, settings, tracking, and agenda.
- **Onboarding draft:** `OnboardingProvider` + SecureStore until completion POST.

## Tooling

- Node **≥ 20.19.4** (`.nvmrc`)
- `npx tsc --noEmit`, `npm test`, `npm run lint`
- API tests use a fetch mock in `src/test/mockApi.ts` (jest setup)
