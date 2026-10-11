const fs = require("fs");
const path = require("path");

// 1. diffs.worker.ts -> diffs.worker.js in emitted providers
let n = 0;
function walk(dir, fn) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) walk(fp, fn);
    else fn(fp);
  }
}
walk("vendor/ui/dist", (fp) => {
  if (!/\.m?js$/.test(fp)) return;
  let c = fs.readFileSync(fp, "utf8");
  if (c.includes("diffs.worker.ts")) {
    c = c.split("diffs.worker.ts").join("diffs.worker.js");
    fs.writeFileSync(fp, c);
    n++;
  }
});
console.log("worker refs fixed:", n);

// 2. wasm ?url package imports -> public URLs
const wasmMap = {};
for (const [pkg, file] of [
  ["@extend-ai/react-docx", "dist/docx_wasm_bg.wasm"],
  ["@extend-ai/react-xlsx", "dist/duke_sheets_wasm_bg.wasm"],
]) {
  const src = "node_modules/" + pkg + "/" + file;
  if (fs.existsSync(src)) {
    const dest = "public/zcode-ui-assets/wasm/" + pkg.replace("@", "").replace("/", "-") + "-" + path.basename(file);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    wasmMap[pkg + "/" + path.basename(file) + "?url"] = "/" + dest.split(path.sep).join("/");
  }
}
console.log("wasm map:", JSON.stringify(wasmMap));

walk("vendor/ui/dist", (fp) => {
  if (!/\.m?js$/.test(fp)) return;
  let c = fs.readFileSync(fp, "utf8");
  let changed = false;
  if (/\.worker\.ts\b/.test(c)) {
    c = c.split(".worker.ts").join(".worker.js");
    changed = true;
  }
  for (const [spec, url] of Object.entries(wasmMap)) {
    const needle = '"' + spec + '"';
    if (!c.includes(needle)) continue;
    const re = new RegExp("import\\s+(\\w+)\\s+from\\s+\"" + spec.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\";");
    const m = re.exec(c);
    if (m) {
      c = c.replace(m[0], "const " + m[1] + ' = "' + url + '";');
      changed = true;
    }
  }
  if (changed) fs.writeFileSync(fp, c);
});
console.log("patched");
