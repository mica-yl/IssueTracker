import * as fc from 'fast-check';
import { describe, expect, test } from '@jest/globals';
import { count, divide, range } from './IssuePagination';

describe('divide pagination with interval 10 and total of 100', () => {
  const divide_x_100_10 = (x) => divide(x, 100, 10);
  test('edge at 1', () => {
    expect(divide_x_100_10(1)).toEqual([1, 10]);
  });

  test('middle at 10', () => {
    expect(divide_x_100_10(10)).toEqual([5, 14]);
  });

  test('edge at 100', () => {
    expect(divide_x_100_10(100)).toEqual([91, 100]);
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
 * [max, visiblePages] →  current
 *
 * @param callBack
 */
function testDivide(callBack:(context:testDrivideArgs)=> unkown) {
  fc.assert(fc.property(
    fc.integer({ min: 1 }),
    fc.integer({ min: 1 }),
    (PagesNumber, visiblePages) => {
      fc.assert(fc.property(
        fc.integer({ min: 1, max: PagesNumber }),
        (current) => {
          const [start, end] = divide(current, PagesNumber, visiblePages);
          callBack({
            PagesNumber, visiblePages, current, start, end,
          });
        },
      ));
    },
  ));
}

describe('divide properties: [max, visiblePages] →  current', () => {
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

  test('start & end preserve safe interval', () => {
    testDivide(({
      start, end, visiblePages, PagesNumber,
    }) => {
      const actualInterval = end - start + 1;
      const expectedInterval = (PagesNumber > visiblePages)
        ? visiblePages
        : PagesNumber;
      expect(actualInterval).toBe(expectedInterval);
    });
  });
});

type testRangeArgs = {
  start:number,
  end: number,
  // step:number,
  result:number[],
};
/**
 *
 * [start,end] -> [step]
 * @param callBack
 */
function testRange(callBack:(context:testRangeArgs)=> unkown) {
  const max = 10000;
  fc.assert(fc.property(
    fc.integer({ max }),
    (start) => {
      fc.assert(fc.property(
        fc.integer({ min: start, max }),
        (end) => {
          const result = Array.from(count(start, end));
          callBack({
            start, end, result,
          });
        },
      ));
    },
  ));
}

describe('count: generate an array from a range', () => {
  const startBound = { min: 1, max: 100000 };
  const distanceBound = { min: 1, max: 100000 };

  test('start == end → lenght == 1', () => {
    fc.assert(fc.property(
      fc.integer(startBound),
      (number) => {
        const result = Array.from(count(number, number));
        expect(result).toHaveLength(1);
        expect(result[0]).toBe(number);
      },
    ));
  });

  test('length preserve step', () => {
    fc.assert(fc.property(
      fc.integer(startBound),
      fc.integer(distanceBound),
      (start, step) => {
        const result = Array.from(count(start, start + step));
        expect(result).toHaveLength(step + 1);
      },
    ));
  });

  test('incremental', () => {
    fc.assert(fc.property(
      fc.integer(startBound),
      fc.integer(distanceBound),
      (start, step) => {
        const result = Array.from(count(start, start + step));

        const steps = Array(result.length - 1)
          .fill(0)
          .map((_, i) => result[i + 1] - result[i]);
        steps.every((d) => expect(d).toBe(1));
      },
    ));
  });

  test('all result values >= start', () => {
    fc.assert(fc.property(
      fc.integer(startBound),
      fc.integer(distanceBound),
      (start, step) => {
        const result = Array.from(count(start, start + step));

        result.every((value) => {
          expect(value).toBeGreaterThanOrEqual(start);
        });
      },
    ));
  });

  test('all result values <= end', () => {
    fc.assert(fc.property(
      fc.integer(startBound),
      fc.integer(distanceBound),
      (start, step) => {
        const result = Array.from(count(start, start + step));

        result.every((value) => {
          expect(value).toBeLessThanOrEqual(start + step);
        });
      },
    ));
  });
});
