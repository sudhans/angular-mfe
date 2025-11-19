# Angular MFE Example — shell + mfe-login + mfe-products

This repository contains a small Angular micro-frontends (MFE) example using Module Federation:

- `shell` — the host application (Angular router + UI shell)
- `mfe-login` — remote responsible for authentication UI
- `mfe-products` — remote that displays products (fetches from local API)
- `api/` — optional Express + lowdb API that serves products and simple login

Intent: provide a minimal, runnable example showing how to load remotes during local development (Module Federation enabled for `ng serve` via custom webpack), how the login remote can notify the host of authentication (CustomEvent / postMessage), and how a remote can fetch data from an API.

## Requirements

- Node.js (v16+ recommended; this workspace previously used Node v24+ successfully)
- npm (or yarn)
- Angular CLI available via `npx` (we use `npx ng serve` in examples)

Tested ports (defaults):

- Shell (host): 4200
- mfe-login: 4201
- mfe-products: 4202
- API: 3333

If these ports are in use on your machine, adjust the commands below.

## Default credentials

- username: `demo`
- password: `password`

Also included: `alice` / `pass`

## Quick start (recommended — foreground, easiest to debug)

1. Clone the repo and install dependencies:

```bash
git clone <repo-url>
cd angular-mfe/angular-mfe
npm install
```

2. Start the API (terminal 1):

```bash
cd api
node index.js
# API will listen on http://127.0.0.1:3333
```

3. Start the login remote (terminal 2):

```bash
cd /path/to/angular-mfe/angular-mfe
npx ng serve mfe-login --port 4201 --host 127.0.0.1 --configuration development
```

4. Start the products remote (terminal 3):

```bash
npx ng serve mfe-products --port 4202 --host 127.0.0.1 --configuration development
```

5. Start the shell (terminal 4):

```bash
npx ng serve shell --port 4200 --host 127.0.0.1 --configuration development
```

6. Open the host in your browser:

```bash
xdg-open http://127.0.0.1:4200
```

Notes:
- The project has been configured so `ng serve` emits `remoteEntry.mjs` for remotes (Module Federation) in development. The shell lazy-loads the remotes via those remoteEntry files.
- The host default route goes to `/login` so you should see the login screen first.

## Background (nohup) / single-terminal run (backgrounded)

If you prefer to run services in background and capture logs to `logs/` and `api/api.log`, run these from the workspace root:

```bash
mkdir -p logs

# start API in background
nohup node api/index.js > api/api.log 2>&1 &

# start remotes and host (disable live-reload to avoid auto-refresh during debugging)
nohup npx ng serve mfe-login --port 4201 --host 127.0.0.1 --live-reload=false --configuration development > logs/mfe-login.log 2>&1 &
nohup npx ng serve mfe-products --port 4202 --host 127.0.0.1 --live-reload=false --configuration development > logs/mfe-products.log 2>&1 &
nohup npx ng serve shell --port 4200 --host 127.0.0.1 --live-reload=false --configuration development > logs/shell.log 2>&1 &

# To open the host in your browser
xdg-open http://127.0.0.1:4200
```

## How the login → products flow works

- The `mfe-login` remote dispatches a `CustomEvent('mfe-auth', { detail: { type: 'login', user } })` and also posts a `postMessage` to parent/top for iframe scenarios.
- The host (`shell`) listens for the `mfe-auth` event and for `postMessage` messages. On login, the host stores the user in its `AuthService` and navigates to `/products`.
- The `mfe-products` remote requests product data from the API at `http://127.0.0.1:3333/products`.

## Verify Module Federation entries

You can check the remote entries directly in the browser or via curl:

```bash
# remoteEntry for login
curl http://127.0.0.1:4201/remoteEntry.mjs

# remoteEntry for products
curl http://127.0.0.1:4202/remoteEntry.mjs
```

If you receive the remoteEntry payloads, Module Federation is serving remotes.

## Logs

- Shell log: `logs/shell.log`
- login remote log: `logs/mfe-login.log`
- products remote log: `logs/mfe-products.log`
- API log: `api/api.log`

Client-side event tracing (recommended when diagnosing the 'flip' behavior):

- Open browser DevTools Console on the shell page. The demo adds console logs when the shell receives `mfe-auth` or `postMessage` messages and when it navigates to `/products`.

Expected console lines on a successful login:

- `[mfe-login] dispatching mfe-auth { type: 'login', user: { username: 'demo' } }`
- `[shell] received mfe-auth event { type: 'login', user: ... }`
- `[shell] navigating to /products after login`

If you see the first line but not the second, confirm you are on the same origin (127.0.0.1) and that no CSP / browser extension is blocking postMessage or custom events.

## Troubleshooting

- Port already in use: find and kill the process using the port

```bash
# inspect process listening on port
ss -ltnp | egrep ':4200|:4201|:4202|:3333' || true

# kill ng serve processes quickly (careful — kills all ng serve)
pkill -f "ng serve"

# kill node API if necessary
pkill -f "node index.js"
```

- If a dev server prompts to use a different port, it's usually because there is still a prior `ng serve` process bound to that port. Kill it (see above) and restart.
- If Module Federation remotes are not loading, confirm `remoteEntry.mjs` is reachable (see "Verify Module Federation entries"), and that `angular.json` uses `@angular-builders/custom-webpack` for dev servers (this repo is already configured for that).

