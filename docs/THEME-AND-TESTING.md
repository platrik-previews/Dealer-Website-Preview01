# Theme, inventory and testing

# Part B — Change the colour theme

Open:

```text
src/config/theme.js
```

## 14. Use a ready-made preset

At the bottom, find:

```js
export const ACTIVE_THEME = 'oceanBlue';
```

Replace it with one of:

```js
'oceanBlue'
'racingRed'
'britishGreen'
'champagne'
'custom'
```

Example:

```js
export const ACTIVE_THEME = 'racingRed';
```

Save the file and refresh the website.

---

## 15. Make a custom theme

Edit the values inside:

```js
custom: {
  ...
}
```

Then select it:

```js
export const ACTIVE_THEME = 'custom';
```

### Important: accent and accentRgb must match

Example accent:

```js
accent: '#6c5ce7',
accentRgb: '108, 92, 231',
```

`accentRgb` is the same colour written as red, green and blue numbers. It powers transparent glows, borders and animation effects.

### Token meanings

- `background`: page background.
- `backgroundRgb`: RGB version of the background.
- `surface`: cards and dashboard panels.
- `surfaceAlt`: secondary cards and placeholders.
- `heroMid`: middle shade in the hero background gradient.
- `text`: primary light text.
- `muted`: secondary text.
- `accent`: primary brand colour.
- `accentRgb`: RGB version of the accent.
- `accentStrong`: stronger accent shade.
- `accentHover`: hover state for primary buttons.
- `accentContrast`: text placed directly on the accent.
- `footerText`: text placed on the accent-coloured footer.
- `border`: general border colour.
- `radius`: card corner rounding.
- `pageWidth`: maximum content width.

---

# Part C — Change demo inventory

Open:

```text
src/data/sampleVehicles.js
```

These listings appear when the local browser database is empty.

After changing sample data, clear old local data in Chrome:

```text
DevTools → Application → Storage → Clear site data
```

Then refresh.

Changing sample data does not overwrite an existing local IndexedDB database automatically.

---

# Part D — Test before committing

Run:

```bash
npm run dev
```

Test:

1. Homepage scroll animation.
2. Desktop and mobile navigation.
3. Inventory filters.
4. Vehicle detail page.
5. Dealer login.
6. Add a listing with an image.
7. Refresh and confirm it remains.
8. Edit its price and status.
9. Delete it.
10. Phone, email, WhatsApp and maps links.

Then run:

```bash
npm run build
```

Do not commit a version that fails the production build.

---

