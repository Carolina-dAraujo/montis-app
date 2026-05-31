# Montis Mobile

Expo (SDK 54) + Expo Router app for the Montis recovery companion.

## Setup

1. **Node:** `nvm use` (requires **20.19.4+**, see `.nvmrc`).
2. **Install:** `npm install`
3. **Environment:** copy `.env.example` → `.env`
4. **API URL (physical device):** start the [Nest server](../server) then run `npm run api:url` and set `API_URL` in `.env` to the printed LAN URL.
5. **Start:** `npx expo start` (use `-c` after dependency changes)

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Expo dev server |
| `npm run api:url` | Print suggested `API_URL` for `.env` |
| `npm test` | Jest unit tests |
| `npm run lint` | ESLint |

## Project structure

See [ARCHITECTURE.md](./ARCHITECTURE.md) for folder conventions, routing, and feature boundaries.

## Backend

The API runs from `../server` (`npm run start:dev`). Swagger: `http://localhost:3000/api`.
