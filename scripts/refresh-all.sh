#!/bin/bash
# Refresh all sports schedule data with latest results
# Run this periodically to keep scores and results up to date

set -e
cd "$(dirname "$0")/.."

echo "=== Refreshing all sports schedules ==="
echo ""

echo "--- NBA (full season + scores) ---"
node scripts/fetch-nba.mjs
echo ""

echo "--- NHL (full season + scores) ---"
node scripts/fetch-nhl.mjs
echo ""

echo "--- MLB (full season + scores) ---"
node scripts/fetch-mlb.mjs
echo ""

echo "--- F1 (update race results) ---"
node scripts/update-f1-results.mjs
echo ""

echo "=== All schedules refreshed ==="
echo "Run 'npm run build' to verify, then commit and push to deploy."
