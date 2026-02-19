# ForgeOS

ForgeOS is a wallet-native Kaspa dashboard for running an AI-assisted trading agent simulation.

It includes:
- Wallet connection (Kasware + demo mode)
- Agent creation wizard
- Decision engine panel (Kelly, Monte Carlo, risk/confidence gating)
- Action queue with manual/auto signing flows
- Treasury fee split and logs
- Wallet operations panel (balance, UTXOs, withdraw flow)

## Who This Is For
- Builders prototyping Kaspa-native agent workflows
- Operators who want transparent signing and execution controls
- Contributors who need a clean React/TypeScript codebase to extend

## Tech Stack
- React 18
- TypeScript
- Vite
- Recharts

## Project Layout
- `forgeos-ui.tsx`: stable app export entry (re-exports `src/ForgeOS.tsx`)
- `src/ForgeOS.tsx`: root shell/topbar + view routing
- `src/components/ui/*`: base UI primitives (`Card`, `Btn`, `Inp`, etc.)
- `src/components/WalletGate.tsx`: wallet connect gate
- `src/components/SigningModal.tsx`: signing confirmation modal
- `src/components/wizard/*`: agent setup/deploy flow
- `src/components/dashboard/*`: dashboard panels and core runtime UI
- `src/api/kaspaApi.ts`: Kaspa API calls
- `src/wallet/WalletAdapter.ts`: wallet mechanics (Kasware adapter)
- `src/quant/runQuantEngine.ts`: AI decision call + strict JSON parse
- `src/log/seedLog.ts`: seeded log data + log colors
- `src/constants.ts`, `src/tokens.ts`, `src/helpers.ts`: constants/design/helpers

## Prerequisites
- Node.js 18+
- npm 9+
- Optional: Kasware extension installed and unlocked

## Local Run
```bash
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

## Build and Preview
```bash
npm run build
npm run preview
```

Production assets are generated in `dist/`.

## How To Use
1. Launch app with `npm run dev`.
2. Connect wallet:
- `Kasware` for real extension flow
- `Demo Mode` for UI simulation without extension
3. Create agent in Wizard:
- name, ROI target, capital per cycle, risk, execution mode
4. Deploy agent (sign step appears).
5. In Dashboard:
- `Overview`: status, KPIs, quick controls
- `Intelligence`: decision output and rationale
- `Queue`: pending/signed/rejected actions
- `Treasury`: fee routing and ledger
- `Wallet`: balances/UTXOs/withdraw workflow
- `Log`: full runtime events
- `Controls`: execution and risk toggles

## Wallet Mechanics (Current Behavior)
- `WalletGate` detects providers via `WalletAdapter.detect()`
- Kasware connect uses:
- `requestAccounts()`
- `getNetwork()`
- Signing modal uses `sendKasware(toAddress, amountKas)` to broadcast
- Demo mode simulates tx IDs and signing flow without extension

## Execution Modes
- `manual`: every action requires signature
- `autonomous`: auto-signs actions below threshold; above threshold queues for manual sign
- `notify`: decisions generated, no execution broadcast

## Fee Routing
Defined in `src/constants.ts`:
- `FEE_RATE = 0.20`
- `TREASURY_SPLIT = 0.30`
- `AGENT_SPLIT = 0.70`

Dashboard logs and treasury panel display split accounting each cycle.

## AI Engine Notes
`src/quant/runQuantEngine.ts` sends a prompt to:
- `https://api.anthropic.com/v1/messages`

Important:
- Current code sends only `Content-Type` header.
- In real deployments, this endpoint requires authentication and should usually be called through a backend proxy (not directly from browser).
- If not configured, intelligence runs will error and appear in the log panel.

## Kaspa Data Sources
`src/api/kaspaApi.ts` uses:
- `GET /info/price`
- `GET /addresses/:address/balance`
- `GET /addresses/:address/utxos`
- `GET /info/blockdag`

On failure, dashboard falls back to simulated DAG data so UI remains usable.

## Release / Packaging
A release template exists at:
- `GITHUB_RELEASE_TEMPLATE.md`

Typical flow:
```bash
npm run build
zip -r forgeos-vX.Y.Z-dist.zip dist
```

Then create GitHub release and attach:
- `forgeos-vX.Y.Z-dist.zip`

## Troubleshooting
- App does not start:
- verify Node version (`node -v`)
- run `npm install` again
- Kasware not detected:
- install/unlock extension, refresh page
- AI errors in Intelligence panel:
- expected unless Anthropic auth/proxy is configured
- Build warning about chunk size:
- non-blocking for now; optimize later with code-splitting

## Security Notes
- Private keys are not handled by this app directly.
- Signing is delegated to wallet provider UI.
- For production, move external AI API calls server-side and store secrets in backend env vars.
