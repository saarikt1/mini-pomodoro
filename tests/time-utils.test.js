const assert = require('assert');
const { getMostRecentBoundary, shouldReset } = require('../time-utils');

function d(y, m, day, h, min = 0, s = 0) {
  return new Date(y, m - 1, day, h, min, s, 0);
}

// Case 1: Before 3am, boundary should be yesterday 3am
{
  const now = d(2026, 2, 3, 2, 0);
  const boundary = getMostRecentBoundary(now);
  assert.strictEqual(boundary.getFullYear(), 2026);
  assert.strictEqual(boundary.getMonth(), 1);
  assert.strictEqual(boundary.getDate(), 2);
  assert.strictEqual(boundary.getHours(), 3);
}

// Case 2: After 3am, boundary should be today 3am
{
  const now = d(2026, 2, 3, 4, 0);
  const boundary = getMostRecentBoundary(now);
  assert.strictEqual(boundary.getFullYear(), 2026);
  assert.strictEqual(boundary.getMonth(), 1);
  assert.strictEqual(boundary.getDate(), 3);
  assert.strictEqual(boundary.getHours(), 3);
}

// Case 3: Reset logic
{
  const now = d(2026, 2, 3, 4, 0);
  const lastUpdateBefore = d(2026, 2, 3, 2, 0).toISOString();
  const lastUpdateAfter = d(2026, 2, 3, 3, 30).toISOString();
  assert.strictEqual(shouldReset(lastUpdateBefore, now), true);
  assert.strictEqual(shouldReset(lastUpdateAfter, now), false);
}

console.log('time-utils tests passed');
