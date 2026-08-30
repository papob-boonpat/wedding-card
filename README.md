# Wedding Invitation Card + RSVP

Next.js (App Router) · Tailwind CSS v4 · Framer Motion · Supabase · Vercel.

## Setup

```bash
npm install
cp .env.local.example .env.local   # then fill in your Supabase values
npm run dev
```

`.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## Database

The schema creates the `rsvps` table, enables RLS, and adds an **insert-only**
policy for the `anon` role — the public site can submit but cannot read anyone's
RSVP.

### Local (Docker)

Start Docker Desktop, then:

```bash
npx supabase start      # boots Postgres + Studio, applies supabase/migrations/
```

It prints an `API URL` (http://127.0.0.1:54321) and `anon key` — put those in
`.env.local`. Studio: http://127.0.0.1:54323. Stop with `npx supabase stop`.
After editing the schema: `npx supabase db reset` re-applies migrations.

### Hosted

Paste `supabase/schema.sql` into the Supabase SQL editor. View submissions in
the Table Editor.

## Card images

Replace `public/card-front.jpg` and `public/card-back.jpg` with your artwork.
Both must share the **same aspect ratio**; update `CARD_ASPECT` in
`src/components/Card.tsx` (width ÷ height) to match.

## The envelope

Pure CSS/SVG, no assets — layered in `src/components/Envelope.tsx`
(back pocket → card slot → front pocket/fold → flap) with z-index so the card
slides out from between the fold and the flap.

## Structure

| Path | Purpose |
|---|---|
| `src/app/page.tsx` | Home — renders `InvitationScene` |
| `src/components/InvitationScene.tsx` | Phase state machine (`sealed → opening → card-out`) + flip |
| `src/components/Envelope.tsx` | CSS envelope layers + flap animation |
| `src/components/Card.tsx` | Front/back faces, 3D `rotateY` flip, swipe/tap/keyboard |
| `src/app/rsvp/page.tsx` | RSVP form (loading / success / error states) |
| `src/lib/rsvp.ts` | Zod schema + `submitRsvp()` |
| `src/lib/supabase.ts` | Lazy browser client (`getSupabase()`) |

Reduced-motion is respected throughout via `useReducedMotion`.

## Deploy (Vercel)

1. Push to GitHub, import the repo in Vercel.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in
   Project → Settings → Environment Variables.
3. Deploy. Verify: an RSVP insert succeeds; running
   `supabase.from('rsvps').select('*')` in the browser console returns `[]`.
