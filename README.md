# Dealer Motion Template

A reusable React + Vite dealership website with an immersive scroll-driven homepage, searchable inventory, individual vehicle pages, a protected dealer dashboard, browser-side image compression and optional Firebase persistence.

## Start here

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, normally:

```text
http://localhost:5173/
```

Dealer login:

```text
http://localhost:5173/dealer-login
```

Local demo credentials:

```text
Email: admin@demo.local
Password: demo123
```

## The two files you normally edit

For almost every new client, edit only these files:

```text
src/config/business.js
src/config/theme.js
```

- `business.js` controls dealership name, logo text, SEO, phone, WhatsApp, email, address, opening hours, homepage copy, services, currency, distance unit, dashboard credentials and inventory choices.
- `theme.js` controls the entire visual colour system. Change one preset name or create a custom palette.

Read the complete instructions before editing:

```text
CUSTOMIZATION-GUIDE.md
```

The guide links to detailed documents inside the `docs/` folder.

## Local dashboard behaviour

When Firebase is not configured, the dashboard uses a real browser-local IndexedDB database.

In local mode you can:

- Add listings
- Upload and compress listing images
- Edit listings
- Replace galleries
- Change Available, Reserved and Sold status
- Delete listings
- Refresh the browser without losing the records

The data exists only in that browser and on that device. It is intended for testing and demos, not production syncing.

To reset local demo data, open Chrome DevTools and go to:

```text
Application → Storage → Clear site data
```

Then refresh the website.

## Firebase production setup

1. Create a Firebase project and register a Web app.
2. Enable **Authentication → Sign-in method → Email/Password**.
3. Create the dealer account manually under **Authentication → Users**.
4. Create Firestore.
5. Create Cloud Storage.
6. Copy `.env.example` to `.env.local`.
7. Add the Firebase Web app values:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

8. Deploy the included rules:

```bash
npx firebase-tools deploy --only firestore:rules,storage
```

The included rules allow public inventory reads while requiring an authenticated account for writes and image changes.

## Image optimisation

Before an image is stored, the browser:

1. Corrects image orientation.
2. Resizes the full image to a maximum dimension of 1920 px.
3. Converts it to WebP when supported, otherwise JPEG.
4. Compresses toward roughly 520 KB.
5. Creates a separate 720 px thumbnail targeting roughly 120 KB.
6. Stores both versions locally or uploads both to Firebase Storage.

The exact output size depends on the photograph.

## Cloudflare Pages

Use these settings:

```text
Framework preset: Vite
Build command: npm run build
Build output directory: dist
```

Add all six `VITE_FIREBASE_*` variables in the Cloudflare Pages environment settings.

After deployment, add the generated Pages domain and the final custom domain to:

```text
Firebase Authentication → Settings → Authorized domains
```

The file `public/_redirects` makes direct visits to `/inventory`, `/vehicle/...`, `/dealer-login`, `/login` and `/dashboard` work correctly.

## Production checks

```bash
npm run build
npm run preview
```

Before client delivery, verify:

- Business details and spelling
- Currency and mileage unit
- Phone, WhatsApp, email and maps links
- Opening hours
- Desktop and mobile navigation
- Login and logout
- Add, edit, delete and status changes
- Image replacement
- Direct route refreshes
- Firebase rules
- Cloudflare environment variables

## Main project structure

```text
src/
├── components/          Reusable interface components
├── config/
│   ├── business.js      Main client information and website copy
│   └── theme.js         Colour themes and layout tokens
├── data/
│   └── sampleVehicles.js
├── hooks/
├── lib/
│   ├── demoDatabase.js  IndexedDB local testing database
│   ├── firebase.js
│   ├── images.js        Browser image compression
│   └── vehicles.js      Local/Firebase inventory operations
├── App.jsx
└── styles.css
```

## Important storage note

Cloud Storage for Firebase currently requires a Firebase project with billing enabled. Configure a strict Google Cloud budget alert before connecting a production storage bucket. The website itself can still be developed and tested locally without Firebase.
