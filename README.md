# DiscordHub AI

AI-powered Discord server management platform built with Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Prisma, and PostgreSQL.

## Features

- Discord OAuth2 authentication (manage only your own servers)
- AI Moderation — toxicity, spam, scams, phishing, hate speech detection
- Advanced Analytics — member growth, retention cohorts, hourly heatmaps
- Ticket System — full lifecycle: categories, priorities, staff assignment, auto-close
- AI Insights — weekly summaries and server recommendations
- Subscription Tiers — Free / Pro €15/mo / Enterprise with Stripe
- Premium UI — glassmorphism, liquid-glass, Framer Motion animations

## Quick Start

```bash
cp .env.example .env
# Fill in your Discord OAuth credentials and DATABASE_URL

npm install
npx prisma generate
npx prisma db push
npm run dev
```

Open http://localhost:3000

## Discord Setup

1. Create app at https://discord.com/developers/applications
2. OAuth2 → copy Client ID + Client Secret
3. Add redirect: `http://localhost:3000/api/auth/callback/discord`
4. Scopes: `identify email guilds`
5. (Optional) Create a Bot and copy the token for live server data

## Deploy to Vercel

```bash
vercel
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add DISCORD_CLIENT_ID
vercel env add DISCORD_CLIENT_SECRET
```

Update `NEXTAUTH_URL` and Discord redirect URI to your production domain.

## Stack

- Next.js 15 + TypeScript + App Router
- Tailwind CSS + Framer Motion
- Recharts
- PostgreSQL + Prisma ORM
- NextAuth.js + Discord OAuth2
- Vercel deployment ready

Made with love by [Loridan Varta](https://github.com/LoridanV)
