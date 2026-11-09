# sileo-vanilla

[![npm](https://img.shields.io/npm/v/sileo-vanilla.svg)](https://www.npmjs.com/package/sileo-vanilla)
[![CI](https://github.com/OuaklimOthmane/Sileo-vanilla/actions/workflows/ci.yml/badge.svg)](https://github.com/OuaklimOthmane/Sileo-vanilla/actions/workflows/ci.yml)
[![size](https://img.shields.io/bundlephobia/minzip/sileo-vanilla)](https://bundlephobia.com/package/sileo-vanilla)
[![license](https://img.shields.io/npm/l/sileo-vanilla.svg)](LICENSE)

Gooey, physics-based toast notifications for **any** web page. A plain-JavaScript port of
[Sileo](https://github.com/hiaaryan/sileo): the same look and motion, without React or any other dependency.

**[Documentation](https://ouaklimothmane.github.io/Sileo-vanilla/docs.html) · [Playground](https://ouaklimothmane.github.io/Sileo-vanilla/play.html)**

- Works with plain HTML, Vue, Svelte, Angular, Frappe, server-rendered pages…
- Same gooey SVG morph, spring, sizes and timings as Sileo
- Promise toasts, action buttons, rich content, six positions, light / dark / system themes
- About 8 kB gzipped with the styles, no dependencies, TypeScript types included

## Install

```bash
npm install sileo-vanilla
```

```js
import { toast } from "sileo-vanilla";

toast.success({ title: "Changes saved", description: "Your changes were saved to the database." });
```

No component to mount: the styles are added the first time a toast appears.

Without a build step:

```html
<script src="https://cdn.jsdelivr.net/npm/sileo-vanilla@0.2.0/dist/sileo-vanilla.umd.min.js"></script>
<script>
  SileoVanilla.toast.success({ title: "Saved" });
</script>
```

## Usage

```js
import { toast, configure } from "sileo-vanilla";

// optional, once
configure({ position: "top-right", theme: "system", offset: 24 });

toast.success({ title: "Saved" });
toast.error({ title: "Not saved", description: "The server did not answer." });
toast.warning({ title: "Storage almost full" });
toast.info({ title: "New version", description: "Reload to update." });

toast.action({
  title: "File uploaded",
  description: "Share it with your team?",
  button: { title: "Share now", onClick: () => share() },
});

// one toast from loading to the result; returns the original promise
toast.promise(saveSettings(), {
  loading: { title: "Saving" },
  success: (res) => ({ title: "Saved", description: `${res.count} settings updated.` }),
  error: (err) => ({ title: "Not saved", description: err.message }),
});

toast.dismiss(id);   // close one (the default toast without an id)
toast.clear();       // close all
```

### Toast options

| Option | Default | Description |
| --- | --- | --- |
| `title` | state name | Text, a DOM node or `{ html }`, shown in the pill |
| `description` | none | Text, a DOM node or `{ html }`, unfolds below |
| `button` | none | `{ title, onClick }` |
| `buttons` | none | Several buttons in a row: `[{ title, onClick, primary }]` |
| `duration` | `6000` | ms; `null` keeps it until dismissed |
| `position` | `"top-right"` | `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right` |
| `id` | `"sileo-default"` | Same id = the toast morphs instead of stacking |
| `icon` | state icon | SVG string or DOM node |
| `fill` | from theme | Toast colour |
| `roundness` | `16` | Corner radius (px) |
| `autopilot` | 150 / 4000 ms | `false`, or `{ expand, collapse }`; `collapse: false` keeps it open |
| `className`, `styles` | none | Your classes: `styles: { title, description, badge, button }` |
| `onDismiss` | none | `(id) => void` once it has left |

### configure

| Setting | Default | Description |
| --- | --- | --- |
| `position` | `"top-right"` | Default position |
| `offset` | `12px` | Number, CSS length, or `{ top, right, bottom, left }` |
| `theme` | `"light"` | `"light"` (dark toasts), `"dark"` (light toasts) or `"system"` |
| `options` | `{}` | Defaults for every toast |
| `injectStyles` | `true` | `false` to link `sileo-vanilla/styles.css` yourself |

Titles are capitalised like Sileo's. For languages that don't capitalise every word:

```css
[data-sileo-title] { text-transform: none; }
```

Full guide with live examples: **[documentation](https://ouaklimothmane.github.io/Sileo-vanilla/docs.html)**.

## Coming from Sileo

`sileo` is exported as an alias of `toast`, with the same methods and options.
`<Toaster position theme offset />` becomes `configure({ position, theme, offset })`, and React elements in
`description` become DOM nodes or `{ html }`.

## Development

```bash
npm install
npm test        # builds dist/ and runs the tests (happy-dom)
npm run docs    # builds and serves the documentation site from docs/
```

## Credits and license

Made by **Ouaklim Othmane**. Design, shapes and motion from [Sileo](https://github.com/hiaaryan/sileo) by
Aaryan ([sileo.aaryan.design](https://sileo.aaryan.design)); the stylesheet is based on Sileo's.
If you use React, use Sileo itself.

[MIT](LICENSE)
