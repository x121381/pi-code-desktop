const fs = require("fs");
const path = require("path");

// 1. mirror ALL non-code assets from ui src to dist
let copied = 0;
function walk(src, out) {
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(out, e.name);
    if (e.isDirectory()) { fs.mkdirSync(d, { recursive: true }); walk(s, d); }
    else if (!/\.(tsx?|d\.ts)$/.test(e.name)) {
      fs.mkdirSync(path.dirname(d), { recursive: true });
      fs.copyFileSync(s, d);
      copied++;
    }
  }
}
walk("vendor/ui/src", "vendor/ui/dist");
console.log("assets mirrored:", copied);

// 2. all ?url imports in ui dist -> const URLs served from /zcode-ui-assets
let n = 0;
const distAbs = path.resolve("vendor/ui/dist");
const pubRoot = path.join("public", "zcode-ui-assets");
function walk2(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) walk2(fp);
    else if (/\.m?js$/.test(fp)) {
      let c = fs.readFileSync(fp, "utf8");
      if (!c.includes('?url"')) return;
      const re = /import\s+(\w+)\s+from\s+"(\.\.?\/[^"]+)\?url";/g;
      let m;
      const edits = [];
      while ((m = re.exec(c))) {
        const relFrom = path.dirname(fp);
        const target = path.resolve(relFrom, m[2]);
        if (!fs.existsSync(target)) continue;
        const relToDistRoot = path.relative(distAbs, target).split(path.sep).join("/");
        const pubPath = "/zcode-ui-assets/" + relToDistRoot;
        const pubFile = path.join(pubRoot, relToDistRoot);
        fs.mkdirSync(path.dirname(pubFile), { recursive: true });
        fs.copyFileSync(target, pubFile);
        edits.push([m[0], "const " + m[1] + ' = "' + pubPath + '";']);
        n++;
      }
      for (const [from, to] of edits) c = c.replace(from, to);
      fs.writeFileSync(fp, c);
    }
  }
}
walk2("vendor/ui/dist");
console.log("?url imports patched:", n);
