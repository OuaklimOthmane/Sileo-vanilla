# Changelog

## 0.2.0 (2026-11-09)

- `buttons`: several buttons side by side, with `primary` for the main one (filled with the state colour).
- `autopilot: { collapse: false }`: once open the toast stays open, even when the mouse leaves (questions, confirmations).
- Docs: "Several buttons, and questions" example; the Frappe example no longer overwrites `frappe.toast`.

## 0.1.0 (2026-11-09)

First release: a plain-JavaScript port of [Sileo](https://github.com/hiaaryan/sileo) 0.1.6.

- Same look and motion as Sileo: gooey SVG morph, spring physics, sizes, colours and timings.
- `toast.success / error / warning / info / action / show / promise / dismiss / clear`, also exported as `sileo`.
- `configure({ position, offset, theme, options, injectStyles })` instead of the `<Toaster>` component.
- Light, dark and system themes; per-toast `fill`, `roundness`, `icon`, `autopilot`, `className`, `styles`, `onDismiss`.
- Rich content: text, DOM nodes or `{ html }`. Text is never parsed as HTML.
- Styles injected on first use (or link `sileo-vanilla/styles.css` yourself).
- Safe to import on the server; respects "reduce motion"; errors use `role="alert"`.
- ES module, CommonJS, `<script>` bundle and TypeScript types. No dependencies.
