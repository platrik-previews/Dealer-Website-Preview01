# Dealership Customization Guide

## Automated n8n preview workflow

For the Platrik cold-email automation, follow:

[N8N-PREVIEW-AUTOMATION.md](N8N-PREVIEW-AUTOMATION.md)

The automation should change only `src/config/lead.json` and the optional logo/favicon assets. It must not edit components, styles, animations or the theme.

## Manual client customization

The detailed manual guide is split into three focused documents so it is easier to follow and edit on GitHub:

1. [Business information, content and inventory options](docs/BUSINESS-CUSTOMIZATION.md)
2. [Themes, demo inventory and local testing](docs/THEME-AND-TESTING.md)
3. [GitHub browser editing, duplication and deployment](docs/GITHUB-AND-DEPLOYMENT.md)

For deeper manual client changes, edit:

```text
src/config/business.js
src/config/theme.js
```

Always test the homepage, inventory, vehicle detail, dealer login and dashboard before deploying.
