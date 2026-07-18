# Dealership Customization and GitHub Editing Guide

This guide is written for duplicating the template for different leads and changing it without rebuilding the React application.

---

## 1. Files you should edit

For normal client changes, use only:

```text
src/config/business.js
src/config/theme.js
```

You do not need to edit `App.jsx`, components or CSS for ordinary branding and copy changes.

---

# Part A — Change the business information

Open:

```text
src/config/business.js
```

Keep every property name exactly as it is. Replace only the text between quotes, numbers and list items.

## 2. Dealership name and logo

Find:

```js
identity: {
  legalName: 'Northline Motors',
  displayName: 'Northline Motors',
  shortName: 'Northline',
  logoLine1: 'Northline',
  logoLine2: 'Motors',
  logoImage: '',
  logoAlt: 'Northline Motors',
  eyebrow: 'Independent dealership · Established 2011',
},
```

### Built-in text logo

Keep `logoImage` empty and edit:

```js
logoLine1: 'Gul',
logoLine2: 'Motors',
```

### Uploaded logo

1. Add the client logo to:

```text
public/branding/logo.svg
```

PNG and WebP also work.

2. Change:

```js
logoImage: '/branding/logo.svg',
```

3. Set meaningful alternative text:

```js
logoAlt: 'Gul Motors logo',
```

When `logoImage` contains a path, the built-in text logo is automatically replaced.

---

## 3. SEO title and description

Find:

```js
seo: {
  title: 'Northline Motors | Quality Used Cars in Dublin',
  description: '...',
},
```

Recommended format:

```js
title: 'Business Name | Main Service in Location',
```

Keep the description natural and around one or two short sentences.

---

## 4. Currency, region and mileage unit

Find:

```js
regional: {
  locale: 'en-IE',
  currency: 'EUR',
  currencySymbol: '€',
  distanceUnit: 'km',
},
```

Examples:

### United Kingdom

```js
locale: 'en-GB',
currency: 'GBP',
currencySymbol: '£',
distanceUnit: 'miles',
```

### United States

```js
locale: 'en-US',
currency: 'USD',
currencySymbol: '$',
distanceUnit: 'miles',
```

### Ireland or Europe

```js
locale: 'en-IE',
currency: 'EUR',
currencySymbol: '€',
distanceUnit: 'km',
```

The price formatter, cards, vehicle page and dashboard use these values automatically.

---

## 5. Contact details

Find:

```js
contact: {
  phoneDisplay: '+353 1 555 0188',
  phoneLink: 'tel:+35315550188',
  whatsappLink: 'https://wa.me/35315550188',
  email: 'hello@northlinemotors.ie',
  address: '18 Harbour Road, Dublin, Ireland',
  mapsLink: 'https://maps.google.com',
},
```

Rules:

- `phoneDisplay` is what visitors see.
- `phoneLink` should start with `tel:` and contain no spaces.
- `whatsappLink` should use the international number without `+`, spaces or brackets.
- `mapsLink` can be the client’s Google Maps listing URL.

Example:

```js
phoneDisplay: '+44 20 1234 5678',
phoneLink: 'tel:+442012345678',
whatsappLink: 'https://wa.me/442012345678',
```

---

## 6. Opening hours

Edit the rows:

```js
openingHours: [
  ['Monday–Friday', '09:00–18:00'],
  ['Saturday', '10:00–16:00'],
  ['Sunday', 'By appointment'],
],
```

Add or remove rows as needed. Keep each row in this format:

```js
['Day label', 'Hours'],
```

---

## 7. Navigation

Edit:

```js
navigation: [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about', sectionId: 'about' },
  { label: 'Stock', href: '/inventory', sectionId: 'stock' },
  { label: 'Services', href: '/#services', sectionId: 'services' },
  { label: 'Contact', href: '/#contact', sectionId: 'contact' },
],
```

Do not change the route values unless you are intentionally changing the website structure. `sectionId` tells the homepage scroll tracker which section should activate that navigation item. Keep it matched to the corresponding section ID.

---

## 8. Hero animation text

Find:

```js
home: {
  hero: {
    introLines: ['Find', 'what', 'moves you.'],
    scrollLabel: 'Scroll to enter',
    kineticWord: 'Drive',
    portalLabel: 'Northline / 01',
    inspectionSteps: ['History checked', 'Condition verified', 'Ready to drive'],
    finalEyebrow: 'Selected. Checked. Prepared.',
    finalTitleLines: ['Drive', 'something', 'worth remembering.'],
    finalBody: '...',
    primaryButton: 'Explore current stock',
    secondaryButton: 'Message the dealer',
    progressLabels: ['Discover', 'Inspect', 'Drive'],
  },
},
```

Keep these limits for good layout:

- `introLines`: exactly three short lines.
- `kineticWord`: preferably one short word.
- `inspectionSteps`: exactly three short items.
- `finalTitleLines`: exactly three lines.
- `progressLabels`: exactly three short words.

---

## 9. Homepage sections

Inside `home`, edit:

- `trustPoints`
- `about`
- `stockPreview`
- `inspection`
- `servicesHeading`

For standard trust points, keep this format:

```js
['12+', 'Years trading'],
```

To make a numeric trust point count up once when the visitor scrolls it into view, add `true` as the third item:

```js
['200+', 'Point inspection', true],
```

The counter supports values such as `150`, `200+` and `1,000+`. Leave the third item out when you want the value to remain static.

For headings stored as arrays, each item becomes a new line.

---

## 10. Services

Edit:

```js
services: [
  {
    number: '01',
    title: 'Vehicle sourcing',
    text: '...',
  },
],
```

You can add or remove services. Give every service a unique `number`.

---

## 11. Inventory and vehicle-page copy

Edit these groups when needed:

```js
inventoryPage: { ... }
vehiclePage: { ... }
footer: { ... }
```

In this WhatsApp message:

```js
whatsappMessage: 'Hi, I am interested in the {vehicle}.',
```

Keep `{vehicle}` exactly as written. The website replaces it with the listing title automatically.

---

## 12. Dashboard demo credentials

Find:

```js
dashboard: {
  demoEmail: 'admin@demo.local',
  demoPassword: 'demo123',
},
```

These values affect local demo mode only. Production Firebase users are created inside Firebase Authentication.

Do not treat the demo password as production security.

---

## 13. Inventory dropdown choices

Edit:

```js
inventoryOptions: {
  maxImages: 12,
  statuses: ['Available', 'Reserved', 'Sold'],
  fuels: [...],
  transmissions: [...],
  bodyTypes: [...],
},
```

The dashboard form reads these arrays automatically.

Avoid renaming `Available`, `Reserved` and `Sold` unless you also update any business workflow that relies on those statuses.

---

