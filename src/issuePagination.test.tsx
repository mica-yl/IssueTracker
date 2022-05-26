import { describe, expect, test } from '@jest/globals';
import { divide } from './IssuePagination';

describe('trivial tests', () => {
  test('fail', () => {
    expect(divide(1, 2)).not.toEqual(4);
  });

  test('pass', () => {
    expect(divide(1, 2)).toEqual([]);
  });
});
