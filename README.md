# 🔥 Home Gas Plan Comparator

A Next.js web app for comparing Australian residential gas plans.

## Features

- **Postcode input** — enter your 4-digit postcode (default 2500) to filter plans for your area. If no plans match, all demo plans are shown with a clear warning.
- **Current Plan** — enter your retailer name, plan name, supply charge (¢/day) and usage rate (¢/MJ).
- **Usage Input** — enter your average gas consumption in MJ/day, MJ/year, or via a **Bill period** (total MJ over a billing period ÷ days → daily MJ).
- **Comparison Table** — shows all available plans sorted cheapest first with estimated annual costs, potential savings vs your current plan, and links to each retailer's plan page and Energy Made Easy.
- **Pluggable data layer** — swap the mock dataset for the [Energy Made Easy API](https://www.energymadeeasy.gov.au) when ready.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Run locally

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx         # Root layout & metadata
│   └── page.tsx           # Main app page (wires all sections together)
├── components/
│   ├── CurrentPlanForm.tsx  # Section 1: enter your current plan rates
│   ├── UsageInput.tsx       # Section 2: enter your gas usage
│   └── ComparisonTable.tsx  # Section 3: ranked comparison results table
├── data/
│   └── plans.ts           # Pluggable data layer (mock dataset today)
└── lib/
    ├── calculator.ts      # Annual cost estimation logic (supports tiered rates)
    └── types.ts           # Shared TypeScript interfaces
```

## How the cost estimate works

```
Annual cost = (supply charge ¢/day × 365 ÷ 100)
            + (daily usage MJ × usage rate ¢/MJ × 365 ÷ 100)
```

Tiered (step) rate plans are supported — the calculation applies each tier's rate up to its consumption threshold.

## Deploying to Vercel

1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the GitHub repo.
3. Vercel auto-detects Next.js — click **Deploy**.
4. Done! Vercel re-deploys automatically on every push to `main`.

No environment variables are required for the mocked dataset. When you integrate a real API, add any API keys via **Vercel → Project Settings → Environment Variables**.

## Connecting real plan data

Replace (or extend) the `getPlansByPostcode` function in `src/data/plans.ts`:

```ts
// src/data/plans.ts
export async function getPlansByPostcode(postcode: string): Promise<GasPlan[]> {
  // TODO: fetch from AER Energy Made Easy API
  const res = await fetch(`https://api.energymadeeasy.gov.au/gas/plans?postcode=${postcode}`);
  const data = await res.json();
  return data.plans.map(mapAERPlanToGasPlan);
}
```

The rest of the app (calculator, UI) requires no changes.

## License

MIT
