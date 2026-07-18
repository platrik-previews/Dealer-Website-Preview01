# GitHub workflow and deployment

# Part E — Edit and commit directly on GitHub.com

This method requires no command line.

## 16. Edit a file in GitHub

1. Open the repository on GitHub.
2. Open `src`.
3. Open `config`.
4. Open `business.js` or `theme.js`.
5. Click the pencil icon labelled **Edit this file**.
6. Change only the required values.
7. Click **Commit changes…**.

## 17. Commit message format

Use a clear, small message such as:

```text
Update Gul Motors business details
```

or:

```text
Switch client theme to racing red
```

For a client repository you control alone, select:

```text
Commit directly to the main branch
```

Then click **Commit changes**.

Cloudflare Pages will normally detect the commit and deploy it automatically.

## 18. Upload a logo through GitHub

1. Open the `public` folder.
2. Open `branding`.
3. Click **Add file → Upload files**.
4. Upload the logo.
5. Use a simple lowercase filename such as `logo.svg`.
6. Commit the upload.
7. Edit `src/config/business.js`.
8. Set:

```js
logoImage: '/branding/logo.svg',
```

9. Commit that second change.

## 19. Replace several files at once

GitHub’s browser editor is best for small text changes. For a full redesign or a code patch, use one of:

- GitHub Desktop
- VS Code with Git
- Upload files through GitHub

Do not upload `node_modules` or `dist`.

---

# Part F — Commit from Windows CMD

From the project folder:

```bat
git status
```

Review the changed files, then:

```bat
git add src/config/business.js src/config/theme.js
```

For a larger approved update:

```bat
git add .
```

Commit:

```bat
git commit -m "Update dealership details and theme"
```

Push:

```bat
git push
```

Use `git add .` only when every changed file belongs in the update.

---

# Part G — Duplicate for another lead

Recommended workflow:

1. Duplicate the repository or create a new repository from the template.
2. Change `src/config/business.js`.
3. Select or customize `src/config/theme.js`.
4. Replace the logo and favicon.
5. Change sample inventory if the lead needs a tailored demo.
6. Run `npm run build`.
7. Connect a separate Firebase project for the paying client.
8. Connect the repository to a separate Cloudflare Pages project.
9. Add the client’s domain.

Never share one production Firebase inventory database between unrelated dealerships.

---

# Part H — Files that should not be committed

The included `.gitignore` should keep these out of GitHub:

```text
node_modules/
dist/
.env
.env.local
```

Never commit Firebase environment files containing project credentials.

Firebase Web configuration is not treated like a server secret, but keeping environments outside source control makes client duplication and deployment safer.

---

## Animated inspection metric

The inspection number in the circular section counts upward once when it first enters the visitor's viewport.

Change it in:

```js
home: {
  inspection: {
    metric: '200+',
    metricLabel: 'inspection points',
  },
},
```

Supported examples include:

```js
metric: '150',
metric: '200+',
metric: '1,000+',
```

Keep the number first. Any text or symbol after the number is treated as the suffix and remains visible while the number animates.

---

## Stock card interactions

The public inventory cards use two lightweight interaction modes:

- **Desktop/laptop:** cursor-relative perspective tilt, depth layers and a click-origin ripple.
- **Touch devices:** a small press response, touch-origin glow and a diagonal scanner sweep before opening the vehicle.

The listing image does not zoom on hover. These effects use CSS transforms, CSS variables and `requestAnimationFrame`; no 3D or animation library is installed.

The interaction logic is in:

```text
src/components/VehicleCard.jsx
```

The appearance and animation strength are in:

```text
src/styles.css
```

Search the stylesheet for:

```text
.vehicle-card
vehicleCardWave
mobileCardResponse
mobileCardScan
```

For accessibility, all card motion is disabled automatically when the visitor has **Reduce motion** enabled in their device settings.

---

# Part H — Modern navigation bar

The template uses a split-island navigation system:

- The dealership logo is in its own floating panel.
- Desktop navigation sits in a central rounded capsule.
- The active page or section moves inside a light animated pill.
- The call action is separated into its own panel.
- On mobile, the normal dropdown is replaced by a full-screen editorial menu.

## Change the navigation links

Open:

```text
src/config/business.js
```

Find:

```js
navigation: [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about', sectionId: 'about' },
  { label: 'Stock', href: '/inventory', sectionId: 'stock' },
  { label: 'Services', href: '/#services', sectionId: 'services' },
  { label: 'Contact', href: '/#contact', sectionId: 'contact' },
],
```

Change only the labels when the same sections are being used. Keep each `href` unchanged unless you also add or rename a matching page or section in the React code. `sectionId` powers the homepage scroll indicator, including the Stock preview even though the Stock link opens the full inventory page. The tracker is directional: it switches as soon as the next section enters from the bottom while scrolling down, and as soon as the previous section re-enters from the top while scrolling up.

## Change the navigation font

The navigation currently loads the free Manrope variable font from Google Fonts. Its link is inside:

```text
index.html
```

The CSS fallback remains active if Google Fonts is blocked, so the website still works normally.

## Change navigation colours

The navbar automatically uses the selected values from:

```text
src/config/theme.js
```

The active navigation pill intentionally uses an off-white neutral colour to stay readable across every included theme. Advanced visual changes are located near `.site-header`, `.site-nav`, `.header-cta`, and `.mobile-nav` inside:

```text
src/styles.css
```

Normally, those CSS rules should not need to be changed when duplicating the template for a new dealership.
