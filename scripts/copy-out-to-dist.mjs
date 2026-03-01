import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(process.cwd());
const outDir = path.join(root, "out");
const distDir = path.join(root, "dist");

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

if (!(await exists(outDir))) {
  console.error(
    "Missing `out/` folder. Run `npm run build` first (static export)."
  );
  process.exit(1);
}

await fs.rm(distDir, { recursive: true, force: true });
await fs.mkdir(distDir, { recursive: true });

// Node 18+ supports fs.cp
await fs.cp(outDir, distDir, { recursive: true });

console.log("dist/ updated from out/");
