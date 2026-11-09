// Builds dist/ (ES module, CommonJS, browser <script> bundle, minified copies, CSS, types)
// and copies the browser bundle into docs/lib for the documentation site.
import { build } from "esbuild";
import { copyFileSync, mkdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const banner = `/*! ${pkg.name} v${pkg.version} | MIT | (c) Ouaklim Othmane | port of Sileo (c) Aaryan, MIT */`;
const common = { entryPoints: ["src/index.js"], bundle: true, loader: { ".css": "text" }, target: "es2019", banner: { js: banner }, legalComments: "none" };

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist");

await build({ ...common, format: "esm", outfile: "dist/index.mjs" });
await build({ ...common, format: "cjs", outfile: "dist/index.cjs" });
// <script> bundle: window.SileoVanilla = { toast, sileo, configure }
const iife = { ...common, format: "iife", globalName: "SileoVanilla" };
await build({ ...iife, outfile: "dist/sileo-vanilla.umd.js" });
await build({ ...iife, minify: true, outfile: "dist/sileo-vanilla.umd.min.js" });
await build({ ...common, format: "esm", minify: true, outfile: "dist/index.min.mjs" });

// stylesheet for people who turn style injection off and link it themselves
copyFileSync("src/styles.css", "dist/styles.css");
await build({ entryPoints: ["src/styles.css"], minify: true, outfile: "dist/styles.min.css", legalComments: "none" });
copyFileSync("types/index.d.ts", "dist/index.d.ts");

mkdirSync("docs/lib", { recursive: true });
copyFileSync("dist/sileo-vanilla.umd.js", "docs/lib/sileo-vanilla.umd.js");

const min = "dist/sileo-vanilla.umd.min.js";
const gz = gzipSync(readFileSync(min)).length;
console.log(`built ${pkg.name} v${pkg.version}: ${(statSync(min).size / 1024).toFixed(1)} kB min, ${(gz / 1024).toFixed(1)} kB gzip (styles included)`);
