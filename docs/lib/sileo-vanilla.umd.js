/*! sileo-vanilla v0.2.1 | MIT | (c) Ouaklim Othmane | port of Sileo (c) Aaryan, MIT */
var SileoVanilla = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.js
  var index_exports = {};
  __export(index_exports, {
    configure: () => configure,
    default: () => index_default,
    sileo: () => sileo,
    toast: () => toast
  });

  // src/styles.css
  var styles_default = '/*!\n * sileo-vanilla styles. Copyright (c) 2026 Ouaklim Othmane, MIT License.\n * Based on Sileo\'s styles.css (https://github.com/hiaaryan/sileo), Copyright (c) Aaryan (hiaaryan), MIT License.\n */\n\n:root {\n  --sileo-spring-easing: linear(\n    0,\n    0.002 0.6%,\n    0.007 1.2%,\n    0.015 1.8%,\n    0.026 2.4%,\n    0.041 3.1%,\n    0.06 3.8%,\n    0.108 5.3%,\n    0.157 6.6%,\n    0.214 8%,\n    0.467 13.7%,\n    0.577 16.3%,\n    0.631 17.7%,\n    0.682 19.1%,\n    0.73 20.5%,\n    0.771 21.8%,\n    0.808 23.1%,\n    0.844 24.5%,\n    0.874 25.8%,\n    0.903 27.2%,\n    0.928 28.6%,\n    0.952 30.1%,\n    0.972 31.6%,\n    0.988 33.1%,\n    1.01 35.7%,\n    1.025 38.5%,\n    1.034 41.6%,\n    1.038 45%,\n    1.035 50.1%,\n    1.012 64.2%,\n    1.003 73%,\n    0.999 83.7%,\n    1\n  );\n\n  --sileo-duration: 600ms;\n  --sileo-height: 40px;\n  --sileo-width: 350px;\n\n  --sileo-state-success: oklch(0.723 0.219 142.136);\n  --sileo-state-loading: oklch(0.556 0 0);\n  --sileo-state-error: oklch(0.637 0.237 25.331);\n  --sileo-state-warning: oklch(0.795 0.184 86.047);\n  --sileo-state-info: oklch(0.685 0.169 237.323);\n  --sileo-state-action: oklch(0.623 0.214 259.815);\n}\n\n/* ---------------------------------- Toast --------------------------------- */\n\n[data-sileo-toast] {\n  position: relative;\n  cursor: pointer;\n  pointer-events: auto;\n  touch-action: none;\n  border: 0;\n  background: transparent;\n  padding: 0;\n  width: var(--sileo-width);\n  height: var(--_h, var(--sileo-height));\n  opacity: 0;\n  transform: translateZ(0) scale(0.95);\n  transform-origin: center;\n  contain: layout style;\n  overflow: visible;\n}\n\n[data-sileo-toast][data-state="loading"] {\n  cursor: default;\n}\n\n[data-sileo-toast][data-ready="true"] {\n  opacity: 1;\n  transform: translateZ(0) scale(1);\n  transition:\n    transform calc(var(--sileo-duration) * 0.66) var(--sileo-spring-easing),\n    opacity calc(var(--sileo-duration) * 0.66) var(--sileo-spring-easing),\n    margin-bottom calc(var(--sileo-duration) * 0.66) var(--sileo-spring-easing),\n    margin-top calc(var(--sileo-duration) * 0.66) var(--sileo-spring-easing),\n    height var(--sileo-duration) var(--sileo-spring-easing);\n}\n\n/* Entry animation direction */\n[data-sileo-viewport][data-position^="top"] [data-sileo-toast]:not([data-ready="true"]) {\n  transform: translateY(-6px) scale(0.95);\n}\n\n[data-sileo-viewport][data-position^="bottom"] [data-sileo-toast]:not([data-ready="true"]) {\n  transform: translateY(6px) scale(0.95);\n}\n\n/* Exit */\n[data-sileo-toast][data-ready="true"][data-exiting="true"] {\n  opacity: 0;\n  pointer-events: none;\n}\n\n[data-sileo-viewport][data-position^="top"]\n  [data-sileo-toast][data-ready="true"][data-exiting="true"] {\n  transform: translateY(-6px) scale(0.95);\n}\n\n[data-sileo-viewport][data-position^="bottom"]\n  [data-sileo-toast][data-ready="true"][data-exiting="true"] {\n  transform: translateY(6px) scale(0.95);\n}\n\n/* ------------------------------- SVG Canvas ------------------------------- */\n\n[data-sileo-canvas] {\n  position: absolute;\n  left: 0;\n  right: 0;\n  pointer-events: none;\n  transform: translateZ(0);\n  contain: layout style;\n  overflow: visible;\n}\n\n[data-sileo-canvas][data-edge="top"] {\n  bottom: 0;\n  transform: scaleY(-1) translateZ(0);\n}\n\n[data-sileo-canvas][data-edge="bottom"] {\n  top: 0;\n}\n\n[data-sileo-svg] {\n  overflow: visible;\n}\n\n/* --------------------------------- Shapes --------------------------------- */\n\n/* --------------------------------- Header --------------------------------- */\n\n[data-sileo-header] {\n  position: absolute;\n  z-index: 20;\n  display: flex;\n  align-items: center;\n  padding: 0.5rem;\n  height: var(--sileo-height);\n  overflow: hidden;\n  left: var(--_px, 0px);\n  transform: var(--_ht);\n  max-width: var(--_pw);\n}\n\n[data-sileo-toast][data-ready="true"] [data-sileo-header] {\n  transition:\n    transform var(--sileo-duration) var(--sileo-spring-easing),\n    left var(--sileo-duration) var(--sileo-spring-easing),\n    max-width var(--sileo-duration) var(--sileo-spring-easing);\n}\n\n[data-sileo-header][data-edge="top"] {\n  bottom: 0;\n}\n\n[data-sileo-header][data-edge="bottom"] {\n  top: 0;\n}\n\n/* Header inner morphing */\n[data-sileo-header-stack] {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  height: 100%;\n}\n\n[data-sileo-header-inner] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  white-space: nowrap;\n  opacity: 1;\n  filter: blur(0px);\n  transform: translateZ(0);\n}\n\n[data-sileo-header-inner][data-layer="current"] {\n  position: relative;\n  z-index: 1;\n  animation: sileo-header-enter var(--sileo-duration) var(--sileo-spring-easing) both;\n}\n\n[data-sileo-header-inner][data-layer="current"]:not(:only-child),\n[data-sileo-header-inner][data-exiting="true"] {\n  will-change: opacity, filter;\n}\n\n[data-sileo-header-inner][data-layer="prev"] {\n  position: absolute;\n  left: 0;\n  top: 0;\n  z-index: 0;\n  pointer-events: none;\n}\n\n[data-sileo-header-inner][data-exiting="true"] {\n  animation: sileo-header-exit calc(var(--sileo-duration) * 0.7) ease forwards;\n}\n\n/* ---------------------------------- Badge --------------------------------- */\n\n[data-sileo-badge] {\n  display: flex;\n  height: 24px;\n  width: 24px;\n  flex-shrink: 0;\n  align-items: center;\n  justify-content: center;\n  padding: 2px;\n  box-sizing: border-box;\n  border-radius: 9999px;\n  color: var(--sileo-tone, currentColor);\n  background-color: var(--sileo-tone-bg, transparent);\n}\n\n/* ---------------------------------- Title --------------------------------- */\n\n[data-sileo-title] {\n  font-size: 0.825rem;\n  line-height: 1rem;\n  font-weight: 500;\n  text-transform: capitalize;\n  color: var(--sileo-tone, currentColor);\n}\n\n/* ------------------------------ State Colors ------------------------------ */\n\n:is([data-sileo-badge], [data-sileo-title], [data-sileo-button])[data-state] {\n  --_c: var(--sileo-state-success);\n}\n\n:is([data-sileo-badge], [data-sileo-title], [data-sileo-button])[data-state="loading"] {\n  --_c: var(--sileo-state-loading);\n}\n\n:is([data-sileo-badge], [data-sileo-title], [data-sileo-button])[data-state="error"] {\n  --_c: var(--sileo-state-error);\n}\n\n:is([data-sileo-badge], [data-sileo-title], [data-sileo-button])[data-state="warning"] {\n  --_c: var(--sileo-state-warning);\n}\n\n:is([data-sileo-badge], [data-sileo-title], [data-sileo-button])[data-state="info"] {\n  --_c: var(--sileo-state-info);\n}\n\n:is([data-sileo-badge], [data-sileo-title], [data-sileo-button])[data-state="action"] {\n  --_c: var(--sileo-state-action);\n}\n\n:is([data-sileo-badge], [data-sileo-title])[data-state] {\n  --sileo-tone: var(--_c);\n  --sileo-tone-bg: color-mix(in oklch, var(--_c) 20%, transparent);\n}\n\n/* --------------------------------- Content -------------------------------- */\n\n[data-sileo-content] {\n  position: absolute;\n  left: 0;\n  z-index: 10;\n  width: 100%;\n  pointer-events: none;\n  opacity: var(--_co, 0);\n}\n\n[data-sileo-content]:not([data-visible="true"]) {\n  content-visibility: hidden;\n}\n\n[data-sileo-toast][data-ready="true"] [data-sileo-content] {\n  transition: opacity calc(var(--sileo-duration) * 0.08) ease calc(var(--sileo-duration) * 0.04);\n}\n\n[data-sileo-content][data-edge="top"] {\n  top: 0;\n}\n\n[data-sileo-content][data-edge="bottom"] {\n  top: var(--sileo-height);\n}\n\n[data-sileo-content][data-visible="true"] {\n  pointer-events: auto;\n}\n\n[data-sileo-toast][data-ready="true"] [data-sileo-content][data-visible="true"] {\n  transition: opacity calc(var(--sileo-duration) * 0.6) ease calc(var(--sileo-duration) * 0.3);\n}\n\n[data-sileo-description] {\n  width: 100%;\n  text-align: left;\n  padding: 1rem;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  contain: layout style paint;\n  content-visibility: auto;\n}\n\n/* --------------------------------- Button --------------------------------- */\n\n[data-sileo-button] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 1.75rem;\n  padding: 0 0.625rem;\n  margin-top: 0.75rem;\n  border-radius: var(--_br, 9999px);\n  border: 0;\n  font-size: 0.75rem;\n  font-weight: 500;\n  cursor: pointer;\n  color: var(--sileo-btn-color, currentColor);\n  background-color: var(--sileo-btn-bg, transparent);\n  transition: background-color 150ms ease;\n}\n\n[data-sileo-button]:hover {\n  background-color: var(--sileo-btn-bg-hover, transparent);\n}\n\n[data-sileo-button][data-state] {\n  --sileo-btn-color: var(--_c);\n  --sileo-btn-bg: color-mix(in oklch, var(--_c) 15%, transparent);\n  --sileo-btn-bg-hover: color-mix(in oklch, var(--_c) 25%, transparent);\n}\n\n/* -------------------------------- Animations ------------------------------ */\n\n[data-sileo-icon="spin"] {\n  animation: sileo-spin 1s linear infinite;\n}\n\n@keyframes sileo-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes sileo-header-enter {\n  from {\n    opacity: 0;\n    filter: blur(6px);\n  }\n  to {\n    opacity: 1;\n    filter: blur(0px);\n  }\n}\n\n@keyframes sileo-header-exit {\n  from {\n    opacity: 1;\n    filter: blur(0px);\n  }\n  to {\n    opacity: 0;\n    filter: blur(6px);\n  }\n}\n\n/* -------------------------------- Viewports ------------------------------- */\n\n[data-sileo-viewport] {\n  position: fixed;\n  z-index: 50;\n  display: flex;\n  gap: 0.75rem;\n  padding: 0.75rem;\n  pointer-events: none;\n  max-width: calc(100vw - 1.5rem);\n  contain: layout style;\n}\n\n[data-sileo-viewport][data-position^="top"] [data-sileo-toast]:not([data-ready="true"]) {\n  margin-bottom: calc(-1 * (var(--sileo-height) + 0.75rem));\n}\n\n[data-sileo-viewport][data-position^="bottom"] [data-sileo-toast]:not([data-ready="true"]) {\n  margin-top: calc(-1 * (var(--sileo-height) + 0.75rem));\n}\n\n/* Vertical edge */\n[data-sileo-viewport][data-position^="top"] {\n  top: 0;\n  flex-direction: column-reverse;\n}\n\n[data-sileo-viewport][data-position^="bottom"] {\n  bottom: 0;\n  flex-direction: column;\n}\n\n/* Horizontal alignment */\n[data-sileo-viewport][data-position$="left"] {\n  left: 0;\n  align-items: flex-start;\n}\n\n[data-sileo-viewport][data-position$="right"] {\n  right: 0;\n  align-items: flex-end;\n}\n\n[data-sileo-viewport][data-position$="center"] {\n  left: 50%;\n  transform: translateX(-50%);\n  align-items: center;\n}\n\n@media (prefers-reduced-motion: no-preference) {\n  [data-sileo-toast][data-ready="true"]:hover,\n  [data-sileo-toast][data-ready="true"][data-exiting="true"] {\n    will-change: transform, opacity, height;\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  [data-sileo-viewport],\n  [data-sileo-viewport] *,\n  [data-sileo-viewport] *::before,\n  [data-sileo-viewport] *::after {\n    animation-duration: 0.01ms;\n    animation-iteration-count: 1;\n    transition-duration: 0.01ms;\n  }\n}\n\n/* --------------------------------- Themes -------------------------------- */\n\n[data-sileo-viewport][data-theme="dark"] [data-sileo-description] {\n  color: rgba(0, 0, 0, 0.5);\n}\n\n[data-sileo-viewport][data-theme="light"] [data-sileo-description] {\n  color: rgba(255, 255, 255, 0.5);\n}\n\n/* ---------------------------- Base reset (what Sileo gets from Tailwind\'s preflight) ---------------------------- */\n\n[data-sileo-viewport],\n[data-sileo-viewport] *,\n[data-sileo-viewport] *::before,\n[data-sileo-viewport] *::after {\n  box-sizing: border-box;\n}\n\n[data-sileo-viewport] {\n  font-family: inherit;\n  -webkit-font-smoothing: antialiased;\n}\n\n[data-sileo-viewport] [data-sileo-button] {\n  text-decoration: none;\n  font-family: inherit;\n}\n\n[data-sileo-viewport] [data-sileo-button]:focus-visible {\n  outline: 2px solid var(--_c);\n  outline-offset: 2px;\n}\n\n[data-sileo-viewport] svg {\n  display: block;\n}\n\n[data-sileo-badge] > svg,\n[data-sileo-badge] > img {\n  max-width: 100%;\n  max-height: 100%;\n}\n\n/* ------------------------------------ Several buttons (sileo-vanilla: `buttons`) ------------------------------------ */\n\n[data-sileo-actions] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.5rem;\n  margin-top: 0.75rem;\n}\n\n[data-sileo-actions] [data-sileo-button] {\n  margin-top: 0;\n}\n\n/* the main action takes the room left; the others keep their own width */\n[data-sileo-actions] [data-sileo-button][data-variant="primary"] {\n  flex: 1;\n}\n\n[data-sileo-button][data-variant="primary"] {\n  background-color: var(--_c);\n  color: #ffffff;\n}\n\n[data-sileo-button][data-variant="primary"]:hover {\n  background-color: color-mix(in oklch, var(--_c) 85%, black);\n}\n\n[data-sileo-button][data-variant="primary"][data-state="warning"] {\n  color: #1a1a1a;\n}\n';

  // src/index.js
  var HEIGHT = 40;
  var WIDTH = 350;
  var DEFAULT_ROUNDNESS = 16;
  var BLUR_RATIO = 0.5;
  var DURATION_MS = 600;
  var DEFAULT_TOAST_DURATION = 6e3;
  var EXIT_DURATION = DEFAULT_TOAST_DURATION * 0.1;
  var AUTO_EXPAND_DELAY = DEFAULT_TOAST_DURATION * 0.025;
  var AUTO_COLLAPSE_DELAY = DEFAULT_TOAST_DURATION - 2e3;
  var PILL_PADDING = 10;
  var MIN_EXPANDED = HEIGHT * 2.25;
  var SWAP_COLLAPSE_MS = 200;
  var HEADER_EXIT_MS = DURATION_MS * 0.7;
  var SWIPE_DISMISS = 30;
  var SWIPE_MAX = 20;
  var DEFAULT_ID = "sileo-default";
  var THEME_FILLS = { light: "#1a1a1a", dark: "#f2f2f2" };
  var POSITIONS = ["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"];
  var OMEGA = Math.log(1e3) / (0.75 * (DURATION_MS / 1e3));
  var ICON = {
    success: '<path d="M20 6 9 17l-5-5"/>',
    loading: '<path d="M21 12a9 9 0 1 1-6.219-8.56"/>',
    error: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    warning: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/><circle cx="12" cy="12" r="4"/>',
    action: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>'
  };
  var stateIcon = (state) => `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${state === "loading" ? ' data-sileo-icon="spin"' : ""}>${ICON[state] || ICON.success}</svg>`;
  var hasDOM = () => typeof window !== "undefined" && typeof document !== "undefined";
  var reducedMotion = () => hasDOM() && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isNode = (v) => hasDOM() && v instanceof Node;
  function fill(el, value) {
    el.textContent = "";
    if (value == null || value === false) return;
    if (isNode(value)) el.appendChild(value);
    else if (typeof value === "object" && value.html != null) el.innerHTML = value.html;
    else el.textContent = String(value);
  }
  var addClass = (el, cls) => cls && el.classList.add(...String(cls).split(/\s+/).filter(Boolean));
  var Spring = class {
    constructor(value, apply) {
      this.v = this.to = value;
      this.vel = 0;
      this.zeta = 0.75;
      this.apply = apply;
      apply(value);
    }
    set(to, { bounce = 0.25, instant = false } = {}) {
      this.to = to;
      this.zeta = 1 - bounce;
      if (instant || reducedMotion()) {
        this.stop();
        this.v = to;
        this.vel = 0;
        this.apply(to);
        return;
      }
      if (!this.raf) {
        this.last = performance.now();
        this.raf = requestAnimationFrame((t) => this.step(t));
      }
    }
    step(t) {
      const dt = Math.min(0.064, (t - this.last) / 1e3);
      this.last = t;
      const k = OMEGA * OMEGA;
      const c = 2 * this.zeta * OMEGA;
      for (let i = 0; i < 8; i++) {
        const h = dt / 8;
        this.vel += (-k * (this.v - this.to) - c * this.vel) * h;
        this.v += this.vel * h;
      }
      if (Math.abs(this.v - this.to) < 0.01 && Math.abs(this.vel) < 0.05) {
        this.v = this.to;
        this.vel = 0;
        this.raf = 0;
        this.apply(this.v);
        return;
      }
      this.apply(this.v);
      this.raf = requestAnimationFrame((n) => this.step(n));
    }
    stop() {
      if (this.raf) cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
  };
  var seq = 0;
  var Toast = class {
    constructor(item) {
      this.id = item.id;
      this.view = item;
      this.align = pillAlign(item.position);
      this.edge = expandDir(item.position);
      this.expanded = false;
      this.exiting = false;
      this.contentHeight = 0;
      this.frozen = MIN_EXPANDED;
      this.filterId = `sileo-gooey-${++seq}`;
      this.build();
    }
    build() {
      const el = this.el = document.createElement("div");
      el.setAttribute("data-sileo-toast", "");
      el.setAttribute("role", item_role(this.view.state));
      el.dataset.ready = "false";
      el.dataset.edge = this.edge;
      el.dataset.position = this.align;
      addClass(el, this.view.className);
      el.innerHTML = `
			<div data-sileo-canvas data-edge="${this.edge}">
				<svg data-sileo-svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" aria-hidden="true">
					<defs><filter id="${this.filterId}" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
						<feGaussianBlur in="SourceGraphic" result="blur"/>
						<feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo"/>
						<feComposite in="SourceGraphic" in2="goo" operator="atop"/>
					</filter></defs>
					<g filter="url(#${this.filterId})">
						<rect data-sileo-pill/>
						<rect data-sileo-body y="${HEIGHT}" width="${WIDTH}"/>
					</g>
				</svg>
			</div>
			<div data-sileo-header data-edge="${this.edge}"><div data-sileo-header-stack></div></div>
			<div data-sileo-content data-edge="${this.edge}"><div data-sileo-description></div></div>`;
      this.svg = el.querySelector("svg");
      this.filter = el.querySelector("filter");
      this.blurEl = el.querySelector("feGaussianBlur");
      this.stack = el.querySelector("[data-sileo-header-stack]");
      this.content = el.querySelector("[data-sileo-content]");
      this.desc = el.querySelector("[data-sileo-description]");
      const pill = this.pill = el.querySelector("[data-sileo-pill]");
      const body = this.body = el.querySelector("[data-sileo-body]");
      this.sx = new Spring(0, (v) => pill.setAttribute("x", v));
      this.sw = new Spring(HEIGHT, (v) => pill.setAttribute("width", Math.max(0, v)));
      this.sh = new Spring(HEIGHT, (v) => pill.setAttribute("height", Math.max(0, v)));
      this.bh = new Spring(0, (v) => body.setAttribute("height", Math.max(0, v)));
      this.bo = new Spring(0, (v) => body.setAttribute("opacity", Math.min(1, Math.max(0, v))));
      el.addEventListener("mouseenter", () => {
        host.hoverEnter(this);
        if (this.hasDesc()) this.setExpanded(true);
      });
      el.addEventListener("mouseleave", () => {
        host.hoverLeave();
        if (!this.keepsOpen()) this.setExpanded(false);
      });
      el.addEventListener("pointerdown", (e) => this.swipeStart(e));
      if (typeof ResizeObserver !== "undefined") {
        this.ro = new ResizeObserver(() => {
          const h = this.hasDesc() ? this.desc.scrollHeight : 0;
          if (h && h !== this.contentHeight) {
            this.contentHeight = h;
            this.render();
          }
        });
        this.ro.observe(this.desc);
      }
      this.renderHeader(true);
      this.renderContent();
    }
    mount(parent) {
      parent.appendChild(this.el);
      this.measure();
      this.render(true);
      requestAnimationFrame(() => {
        this.el.dataset.ready = "true";
        this.ready = true;
      });
      this.autopilot();
    }
    hasDesc() {
      return Boolean(this.view.description) || this.buttons().length > 0;
    }
    buttons() {
      const v = this.view;
      return v.buttons && v.buttons.length ? v.buttons : v.button ? [v.button] : [];
    }
    /** `autopilot: { collapse: false }`: once open it stays open (a question waiting for an answer). */
    keepsOpen() {
      const a = this.view.autopilot;
      return Boolean(a && typeof a === "object" && a.collapse === false);
    }
    /** The badge and the title; a new state blurs in over the old one. */
    renderHeader(first) {
      const v = this.view;
      const key = `${v.state}-${typeof v.title === "string" ? v.title : seq++}`;
      if (key === this.headerKey) return;
      this.headerKey = key;
      const old = this.stack.querySelector('[data-layer="current"]');
      const inner = document.createElement("div");
      inner.setAttribute("data-sileo-header-inner", "");
      inner.dataset.layer = "current";
      const badge = document.createElement("div");
      badge.setAttribute("data-sileo-badge", "");
      badge.dataset.state = v.state;
      addClass(badge, v.styles && v.styles.badge);
      if (v.icon != null) fill(badge, typeof v.icon === "string" ? { html: v.icon } : v.icon);
      else badge.innerHTML = stateIcon(v.state);
      const title = document.createElement("span");
      title.setAttribute("data-sileo-title", "");
      title.dataset.state = v.state;
      addClass(title, v.styles && v.styles.title);
      fill(title, v.title);
      inner.append(badge, title);
      if (old && !first) {
        old.dataset.layer = "prev";
        old.dataset.exiting = "true";
        setTimeout(() => old.remove(), HEADER_EXIT_MS);
      } else if (old) old.remove();
      this.stack.prepend(inner);
      this.inner = inner;
      this.el.dataset.state = v.state;
      this.el.setAttribute("role", item_role(v.state));
    }
    renderContent() {
      const v = this.view;
      this.desc.className = "";
      addClass(this.desc, v.styles && v.styles.description);
      fill(this.desc, v.description);
      const list = this.buttons();
      const row = list.length > 1 ? document.createElement("div") : this.desc;
      if (row !== this.desc) {
        row.setAttribute("data-sileo-actions", "");
        this.desc.appendChild(row);
      }
      for (const b of list) {
        const a = document.createElement("a");
        a.href = "#";
        a.setAttribute("role", "button");
        a.setAttribute("data-sileo-button", "");
        a.dataset.state = v.state;
        if (b.primary) a.dataset.variant = "primary";
        addClass(a, v.styles && v.styles.button);
        a.textContent = b.title;
        a.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (b.onClick) b.onClick(e);
        });
        row.appendChild(a);
      }
    }
    measure() {
      const w = this.inner.scrollWidth + 16 + PILL_PADDING;
      if (w > PILL_PADDING) this.pillWidth = w;
      if (!this.hasDesc()) this.contentHeight = 0;
      else if (this.desc.scrollHeight) this.contentHeight = this.desc.scrollHeight;
    }
    isOpen() {
      return this.hasDesc() && this.expanded && this.view.state !== "loading" && !this.exiting && host.canExpand(this);
    }
    render(instant = false) {
      const open = this.isOpen();
      const has = this.hasDesc();
      const raw = has ? Math.max(MIN_EXPANDED, HEIGHT + this.contentHeight) : MIN_EXPANDED;
      if (open) this.frozen = raw;
      const expanded = open ? raw : this.frozen;
      const svgHeight = has ? Math.max(expanded, MIN_EXPANDED) : HEIGHT;
      const pw = Math.max(this.pillWidth || HEIGHT, HEIGHT);
      const px = this.align === "right" ? WIDTH - pw : this.align === "center" ? (WIDTH - pw) / 2 : 0;
      const round = Math.max(0, this.view.roundness != null ? this.view.roundness : DEFAULT_ROUNDNESS);
      const blur = round * BLUR_RATIO;
      const margin = blur * 2;
      const color = this.view.fill || THEME_FILLS[host.resolvedTheme()];
      for (const r of [this.pill, this.body]) {
        r.setAttribute("rx", round);
        r.setAttribute("ry", round);
        r.setAttribute("fill", color);
      }
      this.blurEl.setAttribute("stdDeviation", blur);
      this.svg.setAttribute("height", svgHeight);
      this.svg.setAttribute("viewBox", `0 0 ${WIDTH} ${svgHeight}`);
      const f = { x: -margin, y: -margin, width: WIDTH + margin * 2, height: svgHeight + margin * 2 };
      for (const k in f) this.filter.setAttribute(k, f[k]);
      const now = instant || !this.ready;
      this.sx.set(px, { instant: now });
      this.sw.set(pw, { instant: now });
      this.sh.set(open ? HEIGHT + blur * 3 : HEIGHT, { instant: now });
      this.bh.set(open ? expanded - HEIGHT : 0, { bounce: open ? 0.25 : 0 });
      this.bo.set(open ? 1 : 0, { bounce: open ? 0.25 : 0 });
      const s = this.el.style;
      s.setProperty("--_h", `${open ? expanded : HEIGHT}px`);
      s.setProperty("--_pw", `${pw}px`);
      s.setProperty("--_px", `${px}px`);
      s.setProperty("--_ht", `translateY(${open ? this.edge === "bottom" ? 3 : -3 : 0}px) scale(${open ? 0.9 : 1})`);
      s.setProperty("--_co", open ? "1" : "0");
      s.setProperty("--_br", round === DEFAULT_ROUNDNESS ? "9999px" : `${Math.max(4, round - 4)}px`);
      this.el.dataset.expanded = String(open);
      this.content.dataset.visible = String(open);
    }
    setExpanded(on) {
      if (this.expanded === on) return;
      this.expanded = on;
      this.render();
    }
    /** Unfold shortly after appearing, fold back 2 s before leaving (Sileo's "autopilot"). */
    autopilot() {
      clearTimeout(this.tExpand);
      clearTimeout(this.tCollapse);
      if (!this.hasDesc() || this.exiting || this.view.state === "loading" || !host.canExpand(this)) return this.setExpanded(false);
      const d = this.view.duration;
      if (d === null || d <= 0 || this.view.autopilot === false) return;
      const total = d == null ? DEFAULT_TOAST_DURATION : d;
      const cfg = typeof this.view.autopilot === "object" && this.view.autopilot ? this.view.autopilot : {};
      const clamp = (v) => Math.min(total, Math.max(0, v));
      const ex = clamp(cfg.expand != null ? cfg.expand : AUTO_EXPAND_DELAY);
      const co = clamp(cfg.collapse != null && cfg.collapse !== false ? cfg.collapse : AUTO_COLLAPSE_DELAY);
      if (ex > 0) this.tExpand = setTimeout(() => this.setExpanded(true), ex);
      else this.setExpanded(true);
      if (cfg.collapse !== false && co > 0) this.tCollapse = setTimeout(() => this.setExpanded(false), co);
    }
    /** Same id again: fold, then morph the header and the content into the new state. */
    refresh(item) {
      const apply = () => {
        this.view = item;
        this.renderHeader(false);
        this.renderContent();
        this.measure();
        this.render();
        this.autopilot();
      };
      clearTimeout(this.tSwap);
      if (this.isOpen()) {
        this.expanded = false;
        this.render();
        this.tSwap = setTimeout(apply, SWAP_COLLAPSE_MS);
      } else apply();
    }
    exit() {
      if (this.exiting) return;
      this.exiting = true;
      clearTimeout(this.tExpand);
      clearTimeout(this.tCollapse);
      clearTimeout(this.tSwap);
      this.el.dataset.exiting = "true";
      this.render();
      setTimeout(() => this.destroy(), EXIT_DURATION);
    }
    destroy() {
      for (const s of [this.sx, this.sw, this.sh, this.bh, this.bo]) s.stop();
      if (this.ro) this.ro.disconnect();
      this.el.remove();
    }
    swipeStart(e) {
      if (this.exiting || e.target.closest("[data-sileo-button]")) return;
      const y0 = e.clientY;
      if (this.el.setPointerCapture) this.el.setPointerCapture(e.pointerId);
      const move = (m) => {
        const dy = m.clientY - y0;
        this.el.style.transform = `translateY(${Math.min(Math.abs(dy), SWIPE_MAX) * (dy > 0 ? 1 : -1)}px)`;
      };
      const up = (u) => {
        this.el.style.transform = "";
        this.el.removeEventListener("pointermove", move);
        this.el.removeEventListener("pointerup", up);
        if (Math.abs(u.clientY - y0) > SWIPE_DISMISS) host.dismiss(this.id);
      };
      this.el.addEventListener("pointermove", move, { passive: true });
      this.el.addEventListener("pointerup", up, { passive: true });
    }
  };
  var item_role = (state) => state === "error" ? "alert" : "status";
  var pillAlign = (pos) => pos.includes("right") ? "right" : pos.includes("center") ? "center" : "left";
  var expandDir = (pos) => pos.startsWith("top") ? "bottom" : "top";
  var host = {
    config: { position: "top-right", theme: "light", offset: void 0, options: {}, injectStyles: true },
    toasts: [],
    // live Toast objects, oldest first
    viewports: {},
    timers: /* @__PURE__ */ new Map(),
    hovering: false,
    activeId: null,
    resolvedTheme() {
      const t = this.config.theme;
      if (t === "dark" || t === "light") return t;
      return hasDOM() && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    },
    injectStyles() {
      if (this.styled || !this.config.injectStyles || document.querySelector("style[data-sileo-vanilla]")) return;
      const style = document.createElement("style");
      style.setAttribute("data-sileo-vanilla", "");
      style.textContent = styles_default;
      document.head.appendChild(style);
      this.styled = true;
    },
    watchTheme() {
      if (this.themeWatch || !window.matchMedia) return;
      this.themeWatch = window.matchMedia("(prefers-color-scheme: dark)");
      const update = () => this.config.theme === "system" && this.retheme();
      if (this.themeWatch.addEventListener) this.themeWatch.addEventListener("change", update);
    },
    retheme() {
      const t = this.resolvedTheme();
      for (const v of Object.values(this.viewports)) v.dataset.theme = t;
      for (const toast2 of this.toasts) toast2.render(true);
    },
    viewport(pos) {
      if (!this.viewports[pos]) {
        this.injectStyles();
        this.watchTheme();
        const v = document.createElement("section");
        v.setAttribute("data-sileo-viewport", "");
        v.setAttribute("aria-live", "polite");
        v.setAttribute("aria-label", "Notifications");
        v.dataset.position = pos;
        v.dataset.theme = this.resolvedTheme();
        document.body.appendChild(v);
        this.viewports[pos] = v;
        this.placeViewport(pos);
      }
      return this.viewports[pos];
    },
    placeViewport(pos) {
      const v = this.viewports[pos];
      const o = this.config.offset;
      for (const side of ["top", "right", "bottom", "left"]) v.style[side] = "";
      if (o === void 0 || o === null) return;
      const sides = typeof o === "object" ? o : { top: o, right: o, bottom: o, left: o };
      const px = (x) => typeof x === "number" ? `${x}px` : x;
      if (pos.startsWith("top") && sides.top != null) v.style.top = px(sides.top);
      if (pos.startsWith("bottom") && sides.bottom != null) v.style.bottom = px(sides.bottom);
      if (pos.endsWith("left") && sides.left != null) v.style.left = px(sides.left);
      if (pos.endsWith("right") && sides.right != null) v.style.right = px(sides.right);
    },
    latest() {
      for (let i = this.toasts.length - 1; i >= 0; i--) if (!this.toasts[i].exiting) return this.toasts[i].id;
      return null;
    },
    // only the newest toast, or the one under the mouse, may unfold
    canExpand(t) {
      return this.activeId === null || this.activeId === t.id;
    },
    setActive(id) {
      if (this.activeId === id) return;
      this.activeId = id;
      for (const t of this.toasts) if (!this.canExpand(t)) t.setExpanded(false);
    },
    create(opts) {
      if (!hasDOM()) return opts.id || DEFAULT_ID;
      const merged = Object.assign({}, this.config.options, opts, {
        styles: Object.assign({}, this.config.options && this.config.options.styles, opts.styles)
      });
      const id = merged.id != null ? String(merged.id) : DEFAULT_ID;
      const prev = this.toasts.find((t) => t.id === id && !t.exiting);
      const position = merged.position || prev && prev.view.position || this.config.position;
      if (!POSITIONS.includes(position)) throw new Error(`sileo-vanilla: unknown position "${position}"`);
      const item = Object.assign({ title: merged.state }, merged, { id, position });
      if (prev) {
        this.clearTimer(prev);
        prev.refresh(item);
      } else {
        const t = new Toast(item);
        this.toasts.push(t);
        this.setActive(id);
        t.mount(this.viewport(position));
      }
      this.schedule();
      return id;
    },
    clearTimer(t) {
      clearTimeout(this.timers.get(t.id));
      this.timers.delete(t.id);
    },
    schedule() {
      if (this.hovering) return;
      for (const t of this.toasts) {
        if (t.exiting || this.timers.has(t.id)) continue;
        const d = t.view.duration;
        if (d === null) continue;
        const ms = d == null ? DEFAULT_TOAST_DURATION : d;
        if (ms <= 0) continue;
        this.timers.set(t.id, setTimeout(() => this.dismiss(t.id), ms));
      }
    },
    clearAll() {
      for (const h of this.timers.values()) clearTimeout(h);
      this.timers.clear();
    },
    hoverEnter(t) {
      this.setActive(t.id);
      if (this.hovering) return;
      this.hovering = true;
      this.clearAll();
    },
    hoverLeave() {
      this.setActive(this.latest());
      if (!this.hovering) return;
      this.hovering = false;
      this.schedule();
    },
    dismiss(id) {
      const t = this.toasts.find((x) => x.id === id && !x.exiting);
      if (!t) return;
      this.clearTimer(t);
      t.exit();
      setTimeout(() => {
        this.toasts = this.toasts.filter((x) => x !== t);
        if (t.view.onDismiss) t.view.onDismiss(t.id);
      }, EXIT_DURATION);
      this.setActive(this.latest());
    },
    clear(position) {
      for (const t of this.toasts.slice()) {
        if (position && t.view.position !== position) continue;
        this.clearTimer(t);
        t.destroy();
        this.toasts = this.toasts.filter((x) => x !== t);
      }
      this.setActive(this.latest());
    }
  };
  var withState = (state) => (opts = {}) => host.create(Object.assign({}, opts, { state }));
  var resolve = (o, value) => (typeof o === "function" ? o(value) : o) || {};
  var toast = {
    show: (opts = {}) => host.create(Object.assign({}, opts, { state: opts.type || "success" })),
    success: withState("success"),
    error: withState("error"),
    warning: withState("warning"),
    info: withState("info"),
    action: withState("action"),
    /** One toast for a slow task: loading, then success (or `action`) or error. Returns the original promise. */
    promise(promise, opts) {
      const id = host.create(Object.assign({}, opts.loading, { state: "loading", duration: null, position: opts.position, id: opts.id }));
      const p = typeof promise === "function" ? promise() : promise;
      Promise.resolve(p).then(
        (data) => host.create(Object.assign({}, resolve(opts.action || opts.success, data), { state: opts.action ? "action" : "success", id })),
        (err) => host.create(Object.assign({}, resolve(opts.error, err), { state: "error", id }))
      );
      return p;
    },
    dismiss: (id = DEFAULT_ID) => host.dismiss(String(id)),
    clear: (position) => host.clear(position)
  };
  function configure(settings = {}) {
    const prev = host.config;
    host.config = Object.assign({}, prev, settings);
    if (settings.position && !POSITIONS.includes(settings.position)) throw new Error(`sileo-vanilla: unknown position "${settings.position}"`);
    if (!hasDOM()) return host.config;
    if ("offset" in settings) for (const pos of Object.keys(host.viewports)) host.placeViewport(pos);
    if ("theme" in settings) host.retheme();
    return host.config;
  }
  var sileo = toast;
  var index_default = toast;
  return __toCommonJS(index_exports);
})();
