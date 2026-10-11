const fs = require("fs");
const path = require("path");

// Replace `import.meta.env` reads in vendored ui dist with a safe shim const.
let patched = 0;
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) walk(fp);
    else if (/\.m?js$/.test(fp)) {
      let c = fs.readFileSync(fp, "utf8");
      if (!c.includes("import.meta.env")) continue;
      // import X from "vite-specific" stays untouched; only env reads matter.
      c = c.split("import.meta.env").join("globalThis.__ZCODE_VITE_ENV__");
      fs.writeFileSync(fp, c);
      patched++;
    }
  }
}
walk("vendor/ui/dist");

// Provide the shim once, loaded before the app (public JS is too late for
// module scope, so inject via a tiny module the app imports first).
fs.writeFileSync(
  "vendor/ui/dist/vite-env-shim.js",
  "// Next/webpack host: Vite-style import.meta.env is unavailable.\n" +
    "globalThis.__ZCODE_VITE_ENV__ = (typeof import.meta !== 'undefined' && import.meta.env) || { MODE: 'production', DEV: false, PROD: true };\n" +
    "export {};\n",
);
console.log("patched files:", patched);
