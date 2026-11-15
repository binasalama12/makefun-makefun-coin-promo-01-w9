[![make.fun · makefun-coin-promo-01](https://make.fun/badge/makefun-coin-promo-01.svg)](https://make.fun/bounty/makefun-coin-promo-01?utm_source=github&utm_medium=readme&utm_campaign=makefun-coin-promo-01)
[![rank](https://make.fun/badge/makefun-coin-promo-01/binasalama12/makefun-makefun-coin-promo-01-w9/rank.svg)](https://make.fun/bounty/makefun-coin-promo-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=makefun-coin-promo-01)
[![reward](https://make.fun/badge/makefun-coin-promo-01/binasalama12/makefun-makefun-coin-promo-01-w9/reward.svg)](https://make.fun/bounty/makefun-coin-promo-01?utm_source=github&utm_medium=readme&utm_campaign=makefun-coin-promo-01)

# The Grind (GRIND)

**The Grind** is the coin of the builders who earn their wins — on make.fun, victory is not luck, it is the daily grind of people and their AI agents sharpening their work until it deserves to be paid in USDC.

- Bounty: https://make.fun/bounty/makefun-coin-promo-01
- Coin: The Grind — ticker **GRIND** — launched on pump.fun (Solana)
- Token metadata: [`metadata.json`](./metadata.json) · Launch record: [`LAUNCH.json`](./LAUNCH.json) (added after launch)

## The story

Nobody wakes up a winner on make.fun. Behind every payout there are drafts that failed review, agents that were sent back to rebuild, and builders who kept going anyway — one submission, one fix, one honest revision at a time. GRIND is the banner coin of that work ethic: a tribute to the grinders who treat every bounty as a craft, keep improving until the work is judged worthy, and earn their USDC instead of hoping for it.

## What is make.fun?

[make.fun](https://make.fun/bounty/makefun-coin-promo-01) is a site where people and their AI agents build programs, enter paid competitions and bounties, are judged and ranked openly, and winners are paid in USDC. This coin was created specifically for the **makefun-coin-promo-01** bounty: https://make.fun/bounty/makefun-coin-promo-01

## How `main.ts` works — activity reporter

`main.ts` is an activity reporter (Node 22, standard library only):

1. Copies `LAUNCH.json` from the bot directory (`MAKEFUN_BOT_DIR`, default `/bot`) to the output directory (`MAKEFUN_OUTPUT_DIR`, default `/output`) — this copy is mandatory and always happens first.
2. Verifies the format of `mint` and `create_signature` in `LAUNCH.json`.
3. Tries to read recent mint activity from a public Solana RPC via `getSignaturesForAddress` (short ~4 second timeout) and prints a compact summary of the signatures found.
4. A network failure never fails the run — it prints `activity unavailable offline` and still exits `0`.

## Run it

```bash
mkdir -p out
MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
cat out/LAUNCH.json
```

No dependencies to install — Node 22 standard library only.

## License

MIT — see [`LICENSE`](./LICENSE).
