# astro-zoom

A lightweight zoom component for Astro. Click any image to zoom it to the center of the viewport with a smooth animation, then close with a click or Escape.

- **~2.8 KB** shipped (JS + CSS) — ~1.4 KB gzipped
- Uses Astro's `<Picture>` pipeline — avif/webp, optimised srcsets, built at compile time
- `<dialog>` based — no z-index battles, native Escape handling, accessible
- ClientRouter compatible
- Supports captions: brief on the page, expanded in the modal
- `prefers-reduced-motion` aware

## Installation

```sh
npx astro add astro-zoom
# or
pnpm add astro-zoom
```

## Usage

There are two ways to use astro-zoom.

### Option A — `<AstroZoom>` wrapper (recommended)

The Astro-native approach. Wrap each image with `<AstroZoom>` — it renders a `<Picture>` thumbnail and a full-resolution `<Picture>` inside the dialog, both processed by Astro's image pipeline at build time.

```astro
---
import { AstroZoom } from 'astro-zoom'
import photo from '../assets/photo.jpg'
---

<AstroZoom
  src={photo}
  alt="A descriptive alt text"
  caption="Brief caption shown on the page"
  modalCaption="An expanded description shown inside the zoomed modal."
/>
```

### Option B — `<AstroZoomInit>` + `data-zoom` (medium-zoom drop-in)

Add `<AstroZoomInit />` once to your layout, then add `data-zoom` to any `<img>` on the page. Works with Astro's `<Image>` and `<Picture>` components, plain `<img>` tags, and images from a CMS or markdown.

```astro
---
// Layout.astro
import { AstroZoomInit } from 'astro-zoom'
---
<html>
  <body>
    <slot />
    <AstroZoomInit />
  </body>
</html>
```

Then on any page:

```astro
---
import { Picture } from 'astro:assets'
import photo from '../assets/photo.jpg'
---

<Picture src={photo} alt="Panda" formats={['avif', 'webp']} data-zoom />
```

Or in markdown/MDX:

```md
<img src="/images/photo.jpg" alt="Description" data-zoom />
```

To zoom to a different (higher-res) source, use `data-zoom-src`:

```html
<img src="thumb.jpg" alt="Description" data-zoom data-zoom-src="full.jpg" />
```

Click the image to zoom. Click the backdrop or press Escape to close.

## Props

### `<AstroZoom>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `ImageMetadata` | required | Image imported via Astro's asset pipeline |
| `alt` | `string` | required | Alt text for both thumbnail and modal image |
| `caption` | `string` | — | Brief caption shown as `<figcaption>` under the thumbnail |
| `modalCaption` | `string` | — | Expanded caption shown at the bottom of the modal |
| `thumbnailWidth` | `number` | natural width | Width of the thumbnail in pixels |
| `margin` | `number` | `40` | Minimum gap in pixels between the zoomed image and the viewport edge |
| `background` | `string` | `color-mix(in oklch, var(--color-bg, oklch(99% 0 0)) 95%, transparent)` | Modal backdrop colour |
| `duration` | `number` | `0.3` | Animation duration in seconds |
| `class` | `string` | — | CSS class applied to the outer `<figure>` element |

### `<AstroZoomInit>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `margin` | `number` | `40` | Minimum gap in pixels between the zoomed image and the viewport edge |
| `background` | `string` | `color-mix(in oklch, var(--color-bg, oklch(99% 0 0)) 95%, transparent)` | Modal backdrop colour |
| `duration` | `number` | `0.3` | Animation duration in seconds |

## Examples

### Image without captions

```astro
<AstroZoom src={photo} alt="Mountain landscape" />
```

### Page caption only

```astro
<AstroZoom
  src={photo}
  alt="Mountain landscape"
  caption="Cairngorms National Park, Scotland"
/>
```

### Both captions

```astro
<AstroZoom
  src={photo}
  alt="Mountain landscape"
  caption="Cairngorms National Park"
  modalCaption="The Cairngorms form the largest arctic mountain plateau in the UK, with five of Scotland's six highest peaks."
/>
```

### Custom appearance

```astro
<AstroZoom
  src={photo}
  alt="Portrait"
  background="rgba(0, 0, 0, 0.9)"
  duration={0.4}
  margin={60}
/>
```

### Thumbnail width

```astro
<AstroZoom src={photo} alt="Detail shot" thumbnailWidth={600} />
```

### In a grid

```astro
---
import { AstroZoom } from 'astro-zoom'
import img1 from '../assets/img1.jpg'
import img2 from '../assets/img2.jpg'
import img3 from '../assets/img3.jpg'
---

<div class="grid">
  <AstroZoom src={img1} alt="Image one" />
  <AstroZoom src={img2} alt="Image two" />
  <AstroZoom src={img3} alt="Image three" />
</div>
```

## Sizing thumbnails

`<AstroZoom>` renders as a `<figure>` element. To control how thumbnails fill their containers, target `.az-trigger img` in your own CSS:

```css
.az-trigger img {
  display: block;
  width: 100%;
  height: auto;
}
```

## Events

Both components dispatch custom events on the trigger `<img>` element, bubbling up the DOM.

| Event | Fires |
|---|---|
| `astro-zoom:open` | When zoom begins (before animation) |
| `astro-zoom:opened` | After the zoom-in animation completes |
| `astro-zoom:close` | When close begins (before animation) |
| `astro-zoom:closed` | After the dialog closes |

```js
// On a specific image
document.querySelector('#my-photo').addEventListener('astro-zoom:opened', () => {
  console.log('zoomed in')
})

// Or with event delegation
document.addEventListener('astro-zoom:closed', (e) => {
  analytics.track('image_zoomed', { src: e.target.src })
})
```

## ClientRouter

Both components are compatible with Astro's ClientRouter (view transitions). No extra configuration needed.

`<AstroZoom>` re-initialises automatically on each `astro:page-load` event, picking up any new instances rendered on the incoming page.

`<AstroZoomInit>` should be placed in your layout (outside the transitioning content) so the singleton dialog persists across navigations. The script attaches to new `img[data-zoom]` elements on each page load automatically.

```astro
---
// Layout.astro
import { ViewTransitions } from 'astro:transitions'
import { AstroZoomInit } from 'astro-zoom'
---
<html>
  <head>
    <ViewTransitions />
  </head>
  <body>
    <slot />
    <AstroZoomInit />  <!-- outside <slot />, persists across navigations -->
  </body>
</html>
```

## How it works

Each `<AstroZoom>` instance renders a `<figure>` containing:
- A `<picture>` thumbnail (avif/webp, processed by Astro at build time)
- An optional `<figcaption>` for the page caption
- A `<dialog>` containing a full-size `<picture>` and optional modal caption

On click, JavaScript measures the thumbnail's position, sets CSS custom properties on the dialog, and calls `showModal()`. A `transform-origin: top left` CSS animation zooms the image from the thumbnail's position to the centre of the viewport. Closing plays the animation in reverse before `dialog.close()`.

No runtime DOM construction. No external dependencies beyond Astro itself.

## Comparing to medium-zoom

| | astro-zoom | medium-zoom |
|---|---|---|
| JS (minified) | 1.6 KB | 9.4 KB |
| JS (gzipped) | 0.8 KB | 3.0 KB |
| Astro `<Image>` / `<Picture>` | ✅ | ✗ |
| Built at compile time | ✅ | ✗ |
| `<dialog>` based | ✅ | ✗ |
| ClientRouter support | ✅ | ✗ |

## Compatibility

- Astro 5, 6, 7
- Node 22.12.0+
- All modern browsers (uses `<dialog>`, `dvw`/`dvh`, `::backdrop`)

## Credits

Inspired by [medium-zoom](https://github.com/francoischalifour/medium-zoom) by François Chalifour — the `data-zoom` API and event naming follow its conventions.

The zoom animation approach — `transform-origin: top left`, CSS custom properties for initial/final positions, and the `<dialog>`-based architecture — is derived from [astro-pandabox](https://github.com/SaintSin/astro-pandabox), a full lightbox/gallery component for Astro.

## License

MIT
