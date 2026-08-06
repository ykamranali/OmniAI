# Omni Agent — Frontend

Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS 4 client for
[Omni Agent](../README.md).

## Development

```bash
npm install
cp .env.local.example .env.local   # point at your backend
npm run dev
```

Requires the backend (see `../backend`) running at the URL configured in
`NEXT_PUBLIC_API_URL`.
