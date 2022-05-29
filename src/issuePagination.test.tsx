import * as fc from 'fast-check';
import { describe, expect, test } from '@jest/globals';
import { divide } from './IssuePagination';

describe('divide pagination with interval 10 and total of 100', () => {
  const divide_x_100_10 = (x) => divide(x, 100, 10);
  test('edge at 1', () => {
    expect(divide_x_100_10(1)).toEqual([1, 10]);
  });

  test('middle at 10', () => {
    expect(divide_x_100_10(10)).toEqual([5, 14]);
  });

  test('edge at 100', () => {
    expect(divide_x_100_10(100)).toEqual([90, 100]);
  });
});

type testDrivideArgs = {
  start:number,
  end: number,
  current:number,
  PagesNumber:number,
  visiblePages:number,
};
/**
 * max -> [visiblePages, current]
 *
 * @param callBack
 */
function testDivide(callBack:(context:testDrivideArgs)=> unkown) {
  fc.assert(fc.property(
    fc.integer({ min: 2 }),
    (PagesNumber) => {
      fc.assert(fc.property(
        fc.integer({ min: 2, max: PagesNumber }),
        fc.integer({ min: 1, max: PagesNumber }),
        (visiblePages, current) => {
          const [start, end] = divide(current, PagesNumber, visiblePages);
          callBack({
            PagesNumber, visiblePages, current, start, end,
          });
        },
      ));
    },
  ));
}

describe('properties', () => {
  test('start >= 1', () => {
    testDivide(({ start }) => {
      expect(start).toBeGreaterThanOrEqual(1);
    });
  });
  test('end <= max', () => {
    testDivide(({ end, PagesNumber }) => {
      expect(end).toBeLessThanOrEqual(PagesNumber);
    });
  });

  test('start <= current', () => {
    testDivide(({ current, start }) => {
      expect(start).toBeLessThanOrEqual(current);
    });
  });

  test('end >= current', () => {
    testDivide(({ current, end }) => {
      expect(end).toBeGreaterThanOrEqual(current);
    });
  });

  test('start & end preserve interval', () => {
    testDivide(({ start, end, visiblePages }) => {
      expect(end - start + 1).toBe(visiblePages);
    });
  });
});
