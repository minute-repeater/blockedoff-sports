// DEPRECATED. This static generator produced placeholder knockouts, random venues,
// and invalid dates, and would overwrite the live data + pro enrichment if run.
// The World Cup schedule is now sourced from ESPN — use scripts/update-world-cup.mjs.

console.error(
  "generate-world-cup.mjs is deprecated.\n" +
    "Run `node scripts/update-world-cup.mjs` to pull the real schedule from ESPN."
);
process.exit(1);
