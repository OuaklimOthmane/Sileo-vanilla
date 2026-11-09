// Importing on a server (no window / document) must not throw, so it works with SSR frameworks.
import assert from "node:assert/strict";
import { test } from "node:test";

test("import and call without a DOM", async () => {
	const { toast, configure } = await import("../dist/index.mjs");
	assert.equal(typeof toast.success, "function");
	assert.equal(toast.success({ title: "server" }), "sileo-default");
	assert.equal(configure({ position: "bottom-center" }).position, "bottom-center");
});

test("CommonJS build loads too", async () => {
	const { createRequire } = await import("node:module");
	const require = createRequire(import.meta.url);
	const cjs = require("../dist/index.cjs");
	assert.equal(typeof cjs.toast.promise, "function");
	assert.equal(cjs.sileo, cjs.toast);
});
