// Behaviour tests against the built ES module, in a simulated browser (happy-dom).
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import assert from "node:assert/strict";
import { after, afterEach, before, describe, test } from "node:test";

GlobalRegistrator.register({ url: "http://localhost/" });
const { toast, sileo, configure } = await import("../dist/index.mjs");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const toasts = () => [...document.querySelectorAll("[data-sileo-toast]")];
const title = (el) => el.querySelector('[data-layer="current"] [data-sileo-title]').textContent;

before(() => configure({ position: "top-right", theme: "light", offset: undefined, options: {} }));
afterEach(() => toast.clear());
after(() => GlobalRegistrator.unregister());

describe("firing toasts", () => {
	test("success creates one toast with its title, badge and status role", () => {
		const id = toast.success({ title: "Saved" });
		assert.equal(id, "sileo-default");
		const [el] = toasts();
		assert.equal(title(el), "Saved");
		assert.equal(el.dataset.state, "success");
		assert.equal(el.getAttribute("role"), "status");
		assert.ok(el.querySelector("[data-sileo-badge] svg"));
	});

	test("the title defaults to the state name", () => {
		toast.warning();
		assert.equal(title(toasts()[0]), "warning");
	});

	test("errors use the alert role so screen readers announce them at once", () => {
		toast.error({ title: "Failed" });
		assert.equal(toasts()[0].getAttribute("role"), "alert");
	});

	test("show() takes the state from type", () => {
		toast.show({ type: "info", title: "Heads up" });
		assert.equal(toasts()[0].dataset.state, "info");
	});

	test("sileo is the same object as toast", () => {
		assert.equal(sileo, toast);
	});
});

describe("ids", () => {
	test("toasts without an id replace each other (one at a time, as Sileo)", async () => {
		toast.success({ title: "One" });
		toast.error({ title: "Two" });
		await sleep(300);
		assert.equal(toasts().length, 1);
		assert.equal(title(toasts()[0]), "Two");
		assert.equal(toasts()[0].dataset.state, "error");
	});

	test("different ids stack", () => {
		toast.success({ id: "a", title: "A" });
		toast.success({ id: "b", title: "B" });
		assert.equal(toasts().length, 2);
	});
});

describe("content", () => {
	test("text descriptions are never parsed as HTML", () => {
		toast.info({ title: "x", description: '<img src=x onerror="alert(1)">' });
		const d = toasts()[0].querySelector("[data-sileo-description]");
		assert.equal(d.querySelector("img"), null);
		assert.match(d.textContent, /<img/);
	});

	test("rich content: { html } and DOM nodes", () => {
		toast.info({ id: "h", title: "x", description: { html: '<b class="who">Alice</b>' } });
		const node = document.createElement("i");
		node.className = "node";
		toast.info({ id: "n", title: "y", description: node });
		assert.equal(document.querySelector(".who").textContent, "Alice");
		assert.ok(document.querySelector("[data-sileo-description] .node"));
	});

	test("the action button calls onClick", () => {
		let clicked = 0;
		toast.action({ title: "Uploaded", description: "Share it?", button: { title: "Share", onClick: () => clicked++ } });
		const b = toasts()[0].querySelector("[data-sileo-button]");
		assert.equal(b.textContent, "Share");
		b.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
		assert.equal(clicked, 1);
	});

	test("custom classes, icon, fill and roundness", () => {
		toast.success({ title: "x", className: "mine", styles: { title: "t1 t2", badge: "bd" }, icon: '<svg class="ic"></svg>', fill: "#123456", roundness: 12 });
		const el = toasts()[0];
		assert.ok(el.classList.contains("mine"));
		assert.ok(el.querySelector("[data-sileo-title]").classList.contains("t2"));
		assert.ok(el.querySelector("[data-sileo-badge].bd .ic"));
		const pill = el.querySelector("[data-sileo-pill]");
		assert.equal(pill.getAttribute("fill"), "#123456");
		assert.equal(pill.getAttribute("rx"), "12");
		assert.equal(el.querySelector("feGaussianBlur").getAttribute("stdDeviation"), "6");
	});
});

describe("lifecycle", () => {
	test("dismiss() removes the toast after the exit animation and calls onDismiss", async () => {
		let gone = null;
		toast.success({ title: "Bye", onDismiss: (id) => (gone = id) });
		toast.dismiss();
		assert.equal(toasts()[0].dataset.exiting, "true");
		await sleep(700);
		assert.equal(toasts().length, 0);
		assert.equal(gone, "sileo-default");
	});

	test("duration: the toast leaves on its own", async () => {
		toast.success({ title: "Quick", duration: 50 });
		await sleep(750);
		assert.equal(toasts().length, 0);
	});

	test("clear(position) only clears that position", () => {
		toast.success({ id: "t", title: "Top" });
		toast.success({ id: "b", title: "Bottom", position: "bottom-left" });
		toast.clear("bottom-left");
		assert.deepEqual(toasts().map(title), ["Top"]);
	});

	test("an unknown position is refused", () => {
		assert.throws(() => toast.success({ position: "middle" }), /unknown position/);
	});
});

describe("promise", () => {
	test("loading, then success with the resolved data", async () => {
		const p = toast.promise(sleep(20).then(() => 3), {
			loading: { title: "Saving…" },
			success: (n) => ({ title: `Saved ${n}` }),
			error: { title: "Failed" },
		});
		assert.equal(toasts()[0].dataset.state, "loading");
		assert.equal(await p, 3);
		await sleep(10);
		assert.equal(toasts()[0].dataset.state, "success");
		assert.equal(title(toasts()[0]), "Saved 3");
	});

	test("loading, then error; the original rejection is returned", async () => {
		const p = toast.promise(() => Promise.reject(new Error("no")), { loading: { title: "Saving…" }, error: (e) => ({ title: e.message }) });
		await assert.rejects(p, /no/);
		await sleep(10);
		assert.equal(toasts()[0].dataset.state, "error");
		assert.equal(title(toasts()[0]), "no");
	});

	test("a loading toast stays until it resolves", async () => {
		let done;
		toast.promise(new Promise((r) => (done = r)), { loading: { title: "Wait" }, success: { title: "Ok" } });
		await sleep(50);
		assert.equal(toasts()[0].dataset.state, "loading");
		done();
	});
});

describe("toaster settings", () => {
	test("styles are injected once", () => {
		toast.success({ id: "s1" });
		toast.success({ id: "s2" });
		assert.equal(document.querySelectorAll("style[data-sileo-vanilla]").length, 1);
	});

	test("viewport per position, with the offset applied", () => {
		configure({ offset: { top: 24, right: "2rem" } });
		toast.success({ title: "x" });
		const v = document.querySelector('[data-sileo-viewport][data-position="top-right"]');
		assert.equal(v.style.top, "24px");
		assert.equal(v.style.right, "2rem");
		assert.equal(v.getAttribute("aria-live"), "polite");
		configure({ offset: undefined });
	});

	test("dark theme gives light toasts", () => {
		configure({ theme: "dark" });
		toast.success({ title: "x" });
		assert.equal(toasts()[0].querySelector("[data-sileo-pill]").getAttribute("fill"), "#f2f2f2");
		assert.equal(toasts()[0].closest("[data-sileo-viewport]").dataset.theme, "dark");
		configure({ theme: "light" });
		assert.equal(toasts()[0].querySelector("[data-sileo-pill]").getAttribute("fill"), "#1a1a1a");
	});

	test("default options apply to every toast", () => {
		configure({ options: { roundness: 10 } });
		toast.success({ title: "x" });
		assert.equal(toasts()[0].querySelector("[data-sileo-pill]").getAttribute("rx"), "10");
		configure({ options: {} });
	});
});
