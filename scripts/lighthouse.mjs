#!/usr/bin/env node
/**
 * Runs Lighthouse and writes both an HTML report (for you) and JSON (for tooling)
 * into .lighthouse/, then prints a summary with the specific failing audits.
 *
 *   npm run lh              # mobile, live site
 *   npm run lh -- --desktop
 *   npm run lh -- --local   # against the local preview server
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";

const LIVE = "https://mogamat-yaseen-kannemeyer.vercel.app/";
const LOCAL = "http://localhost:4173/";

const args = process.argv.slice(2);
const desktop = args.includes("--desktop");
const url = args.find((a) => a.startsWith("http")) ??
  (args.includes("--local") ? LOCAL : LIVE);

const outDir = ".lighthouse";
mkdirSync(outDir, { recursive: true });
const tag = desktop ? "desktop" : "mobile";

const lhArgs = [
  "lighthouse", url,
  "--quiet",
  "--output=json", "--output=html",
  `--output-path=${outDir}/report-${tag}`,
  "--chrome-flags=--headless --no-sandbox --disable-gpu",
  ...(desktop ? ["--preset=desktop"] : []),
];

console.log(`Running Lighthouse (${tag}) against ${url}\n`);

const child = spawn("npx", lhArgs, { stdio: ["ignore", "inherit", "inherit"] });
child.on("exit", async (code) => {
  if (code !== 0) process.exit(code ?? 1);

  const { default: report } = await import(
    new URL(`../${outDir}/report-${tag}.report.json`, import.meta.url),
    { with: { type: "json" } }
  );

  const pct = (c) => (c?.score == null ? "n/a" : Math.round(c.score * 100));
  console.log("\n═══ SCORES ═══");
  for (const [key, cat] of Object.entries(report.categories)) {
    console.log(`  ${cat.title.padEnd(16)} ${pct(cat)}`);
  }

  const m = report.audits;
  const metric = (id) => m[id]?.displayValue ?? "n/a";
  console.log("\n═══ METRICS ═══");
  for (const id of [
    "first-contentful-paint", "largest-contentful-paint",
    "total-blocking-time", "cumulative-layout-shift", "speed-index",
  ]) {
    console.log(`  ${m[id]?.title.padEnd(28)} ${metric(id)}`);
  }

  const failing = Object.values(m)
    .filter((a) => a.score !== null && a.score < 0.9 && a.scoreDisplayMode !== "informative")
    .sort((a, b) => (a.score ?? 0) - (b.score ?? 0));

  console.log("\n═══ FAILING AUDITS ═══");
  if (!failing.length) console.log("  none");
  for (const a of failing) {
    const saving = a.details?.overallSavingsMs;
    console.log(`  [${Math.round((a.score ?? 0) * 100)}] ${a.title}${saving ? ` — ${Math.round(saving)}ms` : ""}`);
    const items = a.details?.items?.slice(0, 4) ?? [];
    for (const it of items) {
      const label = it.url ?? it.node?.snippet ?? it.source?.url ?? "";
      if (label) console.log(`        ${String(label).slice(0, 110)}`);
    }
  }

  console.log(`\nHTML report: ${outDir}/report-${tag}.report.html`);
});
