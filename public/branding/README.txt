AUTOMATED PREVIEW BRANDING

The n8n workflow should upload the dealership logo into this folder.
Any browser-supported filename is allowed, for example:

public/branding/dealer-logo.png
public/branding/dealer-logo.webp
public/branding/dealer-logo.svg

Then set the matching public path in:

src/config/lead.json

Example:

"logoPath": "/branding/dealer-logo.png"

If no usable logo is found, leave logoPath empty. The website will use its built-in animated text mark without changing the UI.
