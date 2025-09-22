# @geoportallux/3dviewer-plugin-create-link

This plugin is a fork of `@vcmap/create-link`.

This plugin provides a share menu entry to copy the apps
current state as a URL to your clipboard. This includes a fallback
for browsers which do not support the clipboard API.

This version adds a call to a url shortener api before copying the url into the clipboard.

## Optional parameters

- `pathTo3dGeoportal` The final path to the 3dviewer online, mainly used for local dev and github previews, it will replace the `localhost` url or the *Githubpages* url with `pathTo3dGeoportal`.
- `pathToUrlShortenerApi` The full path to the url shortener (eg. `https://myportal.io/short/create`)
