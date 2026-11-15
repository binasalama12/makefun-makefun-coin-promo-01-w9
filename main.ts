// The Grind (GRIND) — activity reporter for make.fun coin promo.
// Copies LAUNCH.json to the output dir, validates its shape, then tries to
// read recent mint activity via a public Solana RPC (getSignaturesForAddress)
// and prints a short summary. Network failures never cause a non-zero exit.
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR || "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const RPC_URL = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
const BASE58 = /^[1-9A-HJ-NP-Za-km-z]+$/;

function isPlausibleMint(v) {
  return typeof v === "string" && v.length >= 32 && v.length <= 44 && BASE58.test(v);
}
function isPlausibleSignature(v) {
  return typeof v === "string" && v.length >= 80 && v.length <= 90 && BASE58.test(v);
}

async function fetchActivity(mint) {
  try {
    const res = await fetch(RPC_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getSignaturesForAddress",
        params: [mint, { limit: 10 }],
      }),
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return { ok: false, reason: "http " + res.status };
    const json = await res.json();
    if (json.error) return { ok: false, reason: JSON.stringify(json.error) };
    if (!Array.isArray(json.result)) return { ok: false, reason: "unexpected result" };
    return { ok: true, entries: json.result };
  } catch (err) {
    return { ok: false, reason: String(err && err.message ? err.message : err) };
  }
}

async function main() {
  const src = join(botDir, "LAUNCH.json");
  if (!existsSync(src)) {
    console.log("LAUNCH.json not found at " + src + " — nothing to report yet.");
    return;
  }
  mkdirSync(outDir, { recursive: true });
  const dst = join(outDir, "LAUNCH.json");
  copyFileSync(src, dst);
  console.log("Copied LAUNCH.json -> " + dst);

  let launch;
  try {
    launch = JSON.parse(readFileSync(src, "utf8"));
  } catch (err) {
    console.log("LAUNCH.json is not valid JSON: " + String(err));
    return;
  }

  const mintOk = isPlausibleMint(launch.mint);
  const sigOk = isPlausibleSignature(launch.create_signature);
  console.log("Format check — mint: " + (mintOk ? "OK" : "INVALID") + ", create_signature: " + (sigOk ? "OK" : "INVALID"));
  if (!mintOk || !sigOk) {
    console.log("LAUNCH.json fields failed format verification; skipping activity lookup.");
    return;
  }

  const activity = await fetchActivity(launch.mint);
  console.log("");
  console.log("=== The Grind (GRIND) — Activity Report ===");
  console.log("Mint:             " + launch.mint);
  console.log("Create signature: " + launch.create_signature);
  if (activity.ok) {
    const entries = activity.entries;
    const failed = entries.filter((e) => e.err).length;
    const okCount = entries.length - failed;
    console.log("Recent activity:  " + entries.length + " signature(s) found");
    console.log("Confirmed ok:     " + okCount + ", failed: " + failed);
    if (entries.length > 0) {
      const latest = entries[0];
      const when = latest.blockTime ? new Date(latest.blockTime * 1000).toISOString() : "unknown";
      console.log("Latest slot:      " + String(latest.slot) + " at " + when);
      console.log("Latest signature: " + latest.signature);
    }
    console.log("Status:           LIVE — mint activity visible on Solana");
  } else {
    console.log("Recent activity:  activity unavailable offline (" + activity.reason + ")");
    console.log("Status:           LAUNCH.json copied; activity will be reported on next run");
  }
  console.log("Bounty:           https://make.fun/bounty/makefun-coin-promo-01");
  console.log("===========================================");
}

main().then(
  () => { process.exitCode = 0; },
  (err) => { console.log("Non-fatal error: " + String(err)); process.exitCode = 0; }
);
