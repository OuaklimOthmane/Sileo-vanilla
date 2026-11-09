/*!
 * sileo-vanilla: gooey, physics-based toast notifications for any web page, no framework needed.
 * Copyright (c) 2026 Ouaklim Othmane, MIT License.
 *
 * A plain-JavaScript port of Sileo (https://github.com/hiaaryan/sileo),
 * Copyright (c) Aaryan (hiaaryan), MIT License. Same shapes, sizes, colours, timings and spring;
 * React and the motion library are replaced by a small DOM component and a spring integrator.
 */
import css from "./styles.css";

/* ---------------------------------------- Layout / timing (as Sileo) ---------------------------------------- */
const HEIGHT = 40;
const WIDTH = 350;
const DEFAULT_ROUNDNESS = 16;
const BLUR_RATIO = 0.5;
const DURATION_MS = 600;
const DEFAULT_TOAST_DURATION = 6000;
const EXIT_DURATION = DEFAULT_TOAST_DURATION * 0.1;
const AUTO_EXPAND_DELAY = DEFAULT_TOAST_DURATION * 0.025;
const AUTO_COLLAPSE_DELAY = DEFAULT_TOAST_DURATION - 2000;
const PILL_PADDING = 10;
const MIN_EXPANDED = HEIGHT * 2.25;
const SWAP_COLLAPSE_MS = 200;
const HEADER_EXIT_MS = DURATION_MS * 0.7;
const SWIPE_DISMISS = 30;
const SWIPE_MAX = 20;
const DEFAULT_ID = "sileo-default";
const THEME_FILLS = { light: "#1a1a1a", dark: "#f2f2f2" };
const POSITIONS = ["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"];
// motion's spring { duration: 0.6, bounce: 0.25 }: damping ratio 1 - bounce, settled (0.1 %) after 0.6 s
const OMEGA = Math.log(1000) / (0.75 * (DURATION_MS / 1000));

const ICON = {
	success: '<path d="M20 6 9 17l-5-5"/>',
	loading: '<path d="M21 12a9 9 0 1 1-6.219-8.56"/>',
	error: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
	warning: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
	info: '<circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/><circle cx="12" cy="12" r="4"/>',
	action: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
};
const stateIcon = (state) =>
	`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${
		state === "loading" ? ' data-sileo-icon="spin"' : ""
	}>${ICON[state] || ICON.success}</svg>`;
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const hasDOM = () => typeof window !== "undefined" && typeof document !== "undefined";
const reducedMotion = () => hasDOM() && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isNode = (v) => hasDOM() && v instanceof Node;

/** Puts text, a DOM node or `{ html }` (trusted markup) into an element. */
function fill(el, value) {
	el.textContent = "";
	if (value == null || value === false) return;
	if (isNode(value)) el.appendChild(value);
	else if (typeof value === "object" && value.html != null) el.innerHTML = value.html;
	else el.textContent = String(value);
}
const addClass = (el, cls) => cls && el.classList.add(...String(cls).split(/\s+/).filter(Boolean));

/* ------------------------------------------------ Spring ------------------------------------------------ */
/** Keeps its velocity when the target changes mid-way, like motion's springs. */
class Spring {
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
		const dt = Math.min(0.064, (t - this.last) / 1000);
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
}

/* ------------------------------------------------ Toast ------------------------------------------------- */
let seq = 0;
class Toast {
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
		const el = (this.el = document.createElement("div"));
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
		const pill = (this.pill = el.querySelector("[data-sileo-pill]"));
		const body = (this.body = el.querySelector("[data-sileo-body]"));
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
		// the text is hidden (content-visibility) until it opens: measure again when its size shows up or changes
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
		// one button sits under the text as in Sileo; several go side by side in a row
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
		const w = this.inner.scrollWidth + 16 + PILL_PADDING; // header padding is 0.5rem on each side
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
		// opening bounces, closing doesn't (as Sileo)
		this.bh.set(open ? expanded - HEIGHT : 0, { bounce: open ? 0.25 : 0 });
		this.bo.set(open ? 1 : 0, { bounce: open ? 0.25 : 0 });

		const s = this.el.style;
		s.setProperty("--_h", `${open ? expanded : HEIGHT}px`);
		s.setProperty("--_pw", `${pw}px`);
		s.setProperty("--_px", `${px}px`);
		s.setProperty("--_ht", `translateY(${open ? (this.edge === "bottom" ? 3 : -3) : 0}px) scale(${open ? 0.9 : 1})`);
		s.setProperty("--_co", open ? "1" : "0");
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
}

// errors interrupt screen readers, everything else waits its turn
const item_role = (state) => (state === "error" ? "alert" : "status");
const pillAlign = (pos) => (pos.includes("right") ? "right" : pos.includes("center") ? "center" : "left");
const expandDir = (pos) => (pos.startsWith("top") ? "bottom" : "top");

/* ----------------------------------------------- Toaster ------------------------------------------------ */
const host = {
	config: { position: "top-right", theme: "light", offset: undefined, options: {}, injectStyles: true },
	toasts: [], // live Toast objects, oldest first
	viewports: {},
	timers: new Map(),
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
		style.textContent = css;
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
		for (const toast of this.toasts) toast.render(true);
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
		if (o === undefined || o === null) return;
		const sides = typeof o === "object" ? o : { top: o, right: o, bottom: o, left: o };
		const px = (x) => (typeof x === "number" ? `${x}px` : x);
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
			styles: Object.assign({}, this.config.options && this.config.options.styles, opts.styles),
		});
		const id = merged.id != null ? String(merged.id) : DEFAULT_ID; // one toast at a time unless ids differ (as Sileo)
		const prev = this.toasts.find((t) => t.id === id && !t.exiting);
		const position = merged.position || (prev && prev.view.position) || this.config.position;
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
	},
};

/* ------------------------------------------------- API -------------------------------------------------- */
const withState = (state) => (opts = {}) => host.create(Object.assign({}, opts, { state }));
const resolve = (o, value) => (typeof o === "function" ? o(value) : o) || {};

/** Fire toasts: `toast.success({ title, description })` and friends. Each returns the toast id. */
export const toast = {
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
	clear: (position) => host.clear(position),
};

/** Toaster settings: default position, offset, theme, default options for every toast, style injection. */
export function configure(settings = {}) {
	const prev = host.config;
	host.config = Object.assign({}, prev, settings);
	if (settings.position && !POSITIONS.includes(settings.position)) throw new Error(`sileo-vanilla: unknown position "${settings.position}"`);
	if (!hasDOM()) return host.config;
	if ("offset" in settings) for (const pos of Object.keys(host.viewports)) host.placeViewport(pos);
	if ("theme" in settings) host.retheme();
	return host.config;
}

/** The same object under Sileo's name, so code written for Sileo reads the same. */
export const sileo = toast;
export default toast;
