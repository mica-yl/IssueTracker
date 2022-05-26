import { divide } from './IssuePagination';

test('fail', () => {
  expect(divide(1, 2)).not.toEqual(4);
});

test('pass', () => {
  expect(divide(1, 2)).toEqual([]);
});
