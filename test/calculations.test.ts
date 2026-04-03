import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTotals } from '../src/calculations.js';

test('calculateTotals computes net vat and gross', () => {
  const totals = calculateTotals([
    { quantity: 2, unitPrice: 10, vatRate: 21 },
    { quantity: 1, unitPrice: 5.5, vatRate: 6 }
  ]);

  assert.deepEqual(totals, {
    net: 25.5,
    vat: 4.53,
    gross: 30.03
  });
});
