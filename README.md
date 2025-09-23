# @geoportallux/lux-3dviewer-plugin-create-link

This plugin is a fork of `@vcmap/create-link`.

This plugin provides a share menu entry to copy the apps
current state as a URL to your clipboard. This includes a fallback
for browsers which do not support the clipboard API.

This version adds a call to a url shortener api before copying the url into the clipboard.

## Optional parameters

- `pathToUrlShortenerApi` The full path to the url shortener (eg. `https://myportal.io/short/create`)

## Deploy plugin within map-ui

- Add plugin dependency in desired version to `plugins/package.json`

```
"dependencies": {
  ...
  "@geoportallux/lux-3dviewer-plugin-create-link": "^1.0.0-alpha",
  ...
```

- Add plugin with desired values to map-ui module configuration:

```
{
    "name": "@geoportallux/lux-3dviewer-plugin-create-link",
    "entry": "plugins/@geoportallux/lux-3dviewer-plugin-create-link/index.js",
    "pathToUrlShortenerApi": "..."
},
```
