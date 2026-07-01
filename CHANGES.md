# Changelog

## 0.1.8 — 2026-07-01

- Docs only: fix stale README — add missing `<AstroZoomInit>` per-image `data-*` attributes table (`data-caption`, `data-zoom-src`, `data-margin`, `data-background`, `data-duration`), correct "click the backdrop" to "click anywhere in the modal" to match the 0.1.7 close behaviour

## 0.1.7 — 2026-07-01

- Fix click-to-close — the `<figure>` wrapper added in 0.1.4 filled the entire dialog, silently breaking the `e.target === dialog` check (Escape was the only working close method)
- Clicking anywhere in the modal (image or background) now closes it, with a `zoom-out` cursor

## 0.1.6 — 2026-07-01

- Add per-image `data-margin`, `data-background`, `data-duration` attributes to `<AstroZoomInit>` — override the singleton's defaults for individual images

## 0.1.5 — 2026-07-01

- Fix `cursor: zoom-in` scoped to the image only (`az-trigger img`) — no longer applies to the whole figure

## 0.1.4 — 2026-07-01

- Add `body:has(.az-dialog[open]) { overflow: hidden }` — prevents page scrolling while the modal is open
- Modal in `<AstroZoom>` now uses semantic `<figure><figcaption>` instead of `<p class="az-modal-caption">`
- Add `data-caption` attribute support to `<AstroZoomInit>` — add to trigger images for modal captions

## 0.1.3 — 2026-06-27

- Add `layout`, `widths`, and `sizes` props to `<AstroZoom>` for responsive image support (passed through to Astro's `<Picture>`)
- Dialog `<Picture>` pinned to `layout="none"` to prevent responsive constraints on the zoomed image

## 0.1.2 — 2026-06-26

- Add `imageClass` prop to `<AstroZoom>` — applies a CSS class to the thumbnail `<img>` element

## 0.1.1 — 2026-06-26

- Fix outdated `ViewTransitions` import in README — updated to `ClientRouter` (Astro 5+)

## 0.1.0 — 2026-06-26

Initial release.

### Components

- **`<AstroZoom>`** — wrapper component for Astro-native usage. Renders a `<figure>` with a `<Picture>` thumbnail and a `<dialog>` containing a full-resolution `<Picture>` (avif/webp), both processed by Astro's image pipeline at build time.
- **`<AstroZoomInit>`** — singleton drop-in replacement for medium-zoom. Add once to your layout; apply `data-zoom` to any `<img>` on the page. Supports `data-zoom-src` for a separate high-res source.

### Features

- Zoom animation using `transform-origin: top left` and CSS custom properties — from thumbnail position to centred viewport
- Smooth zoom-out animation on close (click backdrop or press Escape)
- `<dialog>` based — native Escape handling, no z-index conflicts, accessible by default
- Backdrop colour derived from `--color-bg` via `color-mix(in oklch, ...)` — adapts to light/dark mode automatically
- Optional `caption` prop — shown as `<figcaption>` under the thumbnail
- Optional `modalCaption` prop — shown at the bottom of the zoomed dialog
- Custom events on the trigger image: `astro-zoom:open`, `astro-zoom:opened`, `astro-zoom:close`, `astro-zoom:closed`
- ClientRouter compatible — re-initialises on `astro:page-load`
- `prefers-reduced-motion` aware
- ~2.8 KB shipped (JS + CSS), ~1.4 KB gzipped

### Props

`<AstroZoom>`: `src`, `alt`, `caption`, `modalCaption`, `thumbnailWidth`, `margin`, `background`, `duration`, `class`

`<AstroZoomInit>`: `margin`, `background`, `duration`
