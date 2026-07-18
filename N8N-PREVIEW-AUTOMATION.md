# n8n Dealership Preview Automation

This repository is prepared to be used as the GitHub template for the Platrik dealership cold-email workflow.

The automation must not edit React components, styles, animation files, page layouts or the theme. For every lead, it should change only the lead configuration and optional branding assets described below.

## One-time setup after transferring the repository

1. Keep the default branch named `main`.
2. Open **GitHub repository Settings → General** and enable **Template repository**.
3. Keep GitHub Actions enabled for the repository.
4. Connect the new GitHub account to n8n with permission to create repositories, update repository contents and manage Actions secrets.
5. Prepare one Cloudflare API token and the Cloudflare account ID for the generated preview repositories.

After these one-time steps, n8n can create every lead repository from this template without changing the template code again.

## Files the workflow may change

```text
src/config/lead.json
public/branding/dealer-logo.<extension>
public/dealer-favicon.<extension>
```

The logo and favicon filenames may use PNG, WebP, JPG, ICO or SVG when the downloaded file is valid for that format. The paths inside `lead.json` must match the uploaded filenames exactly.

## Required lead configuration

Replace the complete contents of `src/config/lead.json` with valid JSON:

```json
{
  "companyName": "Example Motors",
  "website": "https://www.examplemotors.co.uk",
  "email": "sales@examplemotors.co.uk",
  "address": "Example Road, London, United Kingdom",
  "phoneDisplay": "+44 20 1234 5678",
  "phoneLink": "tel:+442012345678",
  "whatsappLink": "https://wa.me/442012345678",
  "mapsLink": "https://www.google.com/maps/search/?api=1&query=Example%20Motors",
  "logoPath": "/branding/dealer-logo.png",
  "faviconPath": "/dealer-favicon.ico",
  "instagram": "",
  "facebook": "",
  "allowIndexing": false
}
```

Only `companyName`, `website`, `email` and `address` are essential. The other fields may be empty. Safe fallbacks are applied automatically.

Keep `allowIndexing` set to `false` for cold-email previews. Change it to `true` only when a finished client website should be indexed by search engines.

## Recommended workflow order

1. Read one pending row from Google Sheets.
2. Mark the row as `Processing`.
3. Download the dealership homepage HTML.
4. Extract the company name, address, logo URL, favicon URL and optional telephone number.
5. Generate a safe lowercase repository name using letters, numbers and hyphens.
6. Create a new repository from this GitHub template.
7. Add the two GitHub Actions secrets listed below to the new repository.
8. Replace `src/config/lead.json`.
9. Upload the logo and favicon only when valid files were found.
10. Commit all dealership changes to `main`.
11. Wait for the Cloudflare deployment workflow to finish.
12. Confirm that `https://REPOSITORY-NAME.pages.dev` returns a successful response.
13. Insert that URL into the cold-email template.
14. Send the email.
15. Mark the sheet row as `Sent` and store the repository name and preview URL.

The workflow should process one lead at a time. It must not send an email until the preview URL is live.

## Cloudflare repository secrets

Every generated repository needs these GitHub Actions secrets:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

The included deployment workflow builds the React/Vite website, derives a valid Cloudflare Pages project name from the GitHub repository name, creates the Pages project when needed and deploys the `dist` directory.

When the secrets are absent, deployment is skipped instead of producing a failed build. After adding the secrets, trigger the workflow manually or push the dealership configuration commit.

## Extraction fallbacks

Use these fallbacks so one difficult website cannot stop the batch:

- Missing company name: use the Google Sheets company name.
- Missing logo: keep `logoPath` empty so the built-in animated text mark appears.
- Missing favicon: keep `faviconPath` set to `/favicon.svg`.
- Missing address: use `United Kingdom` or send the row to manual review.
- Missing telephone: leave the telephone fields empty.
- Website blocked or invalid: mark the row `Needs Review` and do not send the email.

Do not invent contact details.

## Files the workflow must not edit

```text
src/components/
src/pages/
src/styles.css
src/config/theme.js
src/data/
```

Those files contain the stable design, UI/UX, animations and demo inventory.

## Local check

```bash
npm install
npm run build
```

A generated preview is ready for emailing only after the production build succeeds and the Cloudflare URL responds successfully.
