import React from 'react';
import Pagination from 'react-bootstrap/Pagination';
import { LinkContainer } from 'react-router-bootstrap';
import { useSearchParamsUpdate } from './react-router-hooks';

export function divide(current:number, max:number, interval:number) {
  const safeInterval = interval > max ? max : interval;
  const d = Math.floor(safeInterval / 2);
  const isSafeIntervalEven = (safeInterval % 2 === 0) ? 1 : 0;
  if (current <= d) {
    return [1, safeInterval];
  } if (current >= max - d) {
    return [max - safeInterval + 1, max];
  }
  return [current - d, current + d - isSafeIntervalEven];
}

type IssuePaginationProps = {
  /**
   * current page
   */
  current: number,
  /**
   * number of all pages
   */
  max: number,
  /**
   * how many pages to show
   */
  interval:number,
  /**
   *
   * @param page - page number
   * @default uses search parameter `page`
   * @returns url using the page number
   */
  gotoRedirect:(page:number)=> string
};
/*
export function range(start:number, end:number, step? = 1) {
  const result = [];
  for (let i = start; i <= end; i += step) {
    result.push(i);
  }
  return result;
}
*/

export function* count(start:number, end:number) {
  // eslint-disable-next-line no-plusplus
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

export function IssuePagination(props:IssuePaginationProps) {
  const { newSearchParams } = useSearchParamsUpdate();
  const {
    current = 1, max = 30, interval = 10,
    gotoRedirect = (page) => `?${newSearchParams({ page }).toString()}`,
  } = props;
  const [start, end] = divide(current, max, interval);
  return (
    <Pagination>
      <LinkContainer to={gotoRedirect(1)}>
        <Pagination.First disabled={current === 1} />
      </LinkContainer>
      <LinkContainer to={gotoRedirect(current - 1)}>
        <Pagination.Prev disabled={current - 1 <= 0} />
      </LinkContainer>

      <Pagination.Ellipsis disabled hidden={!(start > 1)} />
      {Array.from(count(start, end))
        .map((cur) => (
          <LinkContainer key={cur} to={gotoRedirect(cur)}>
            <Pagination.Item active={cur === current}>{cur}</Pagination.Item>
          </LinkContainer>
        ))}

      <Pagination.Ellipsis disabled hidden={!(end < max)} />

      <LinkContainer to={gotoRedirect(current + 1)}>
        <Pagination.Next disabled={current + 1 > max} />
      </LinkContainer>
      <LinkContainer to={gotoRedirect(max)}>
        <Pagination.Last disabled={current === max} />
      </LinkContainer>
    </Pagination>

  );
}
