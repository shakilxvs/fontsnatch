# FontSnatch — Font Thief

> Drop a URL. Detect every font on any website — name, foundry, license, download link.

Built with **Next.js 14**, deployed for free on **Vercel**.

---

## Features

- Detects Google Fonts, Adobe Fonts (Typekit), Bunny Fonts, self-hosted, and system fonts
- Shows font weight & style variants in use
- Direct download links for open-source fonts
- Purchase links for paid fonts  
- Live font preview (click to edit preview text)
- Copy CSS `font-family` or full `@import` in one click
- Filter results by font source
- Responsive, dark-mode UI

---

## Free Tech Stack

| Tool | Purpose | Cost |
|------|---------|------|
| [Next.js](https://nextjs.org) | Framework + API routes | Free |
| [Vercel](https://vercel.com) | Hosting + serverless | Free (Hobby) |
| [GitHub](https://github.com) | Source code hosting | Free |
| Google Fonts API | Preview loading | Free |

**No database. No auth. No paid services.**

---

## Deploy in 5 Minutes

### Step 1 — Push to GitHub

```bash
# 1. Create a new repo on github.com
# 2. Then:
cd fontsnatch
git init
git add .
git commit -m "Initial commit — FontSnatch"
git remote add origin https://github.com/YOUR_USERNAME/fontsnatch.git
git branch -M main
git push -u origin main
```

### Step 2 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → Sign up free with GitHub
2. Click **"New Project"**
3. Import your `fontsnatch` repository
4. Keep all settings as default (Vercel auto-detects Next.js)
5. Click **Deploy**

That's it. Your app is live at `https://fontsnatch.vercel.app` (or similar).

---

## Local Development

```bash
npm install
npm run dev
# → http://localhost:3000
```

---

## How It Works

The `/api/detect` serverless function:

1. Fetches the target page's HTML
2. Scans for Google Fonts `<link>` tags → parses family names & weights
3. Detects Adobe Fonts / Typekit script tags
4. Finds all `<link rel="stylesheet">` files → fetches up to 8 CSS files
5. Parses every `@font-face` declaration
6. Scans `font-family:` usage in CSS
7. Enriches results with a curated font database (foundry, license, links)

**Limitations:**
- Sites that block server-side requests (Cloudflare, etc.) may not yield results
- JavaScript-rendered fonts (loaded via JS after page load) aren't detected
- Adobe Fonts kits often block external access

---

## Project Structure

```
fontsnatch/
├── app/
│   ├── layout.tsx          # Root layout + fonts
│   ├── page.tsx            # Main UI
│   ├── globals.css         # Design system + animations
│   └── api/detect/
│       └── route.ts        # Detection API endpoint
├── components/
│   └── FontCard.tsx        # Individual font result card
├── lib/
│   ├── types.ts            # TypeScript types
│   ├── fontDetector.ts     # Core detection engine
│   └── fontDatabase.ts     # Font metadata database
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## Extending the Font Database

Add entries to `lib/fontDatabase.ts`:

```ts
'Your Font Name': {
  foundry: 'Foundry Name',
  category: 'sans-serif',
  license: 'paid',
  description: 'A brief description',
  purchaseUrl: 'https://myfonts.com/...',
},
```

---

## License

MIT — use it however you like.
