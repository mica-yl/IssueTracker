import { yieldExpression } from '@babel/types';
import React from 'react';
import Pagination from 'react-bootstrap/Pagination';
import { LinkContainer } from 'react-router-bootstrap';
import { useSearchParamsUpdate } from './react-router-hooks';

export function divide(current:number, max:number, interval:number) {
  const d = Math.floor(interval / 2);
  if (current <= d) {
    return [1, interval];
  } if (current >= max - d) {
    return max === interval ? [1, max] : [max - interval, max];
  } if (interval % 2 === 1) {
    // odd interval
    return [current - d, current + d];
  }
  // even interval
  return [current - d, current + d - 1];
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
   * a callback takes
   * @param page - page number
   * @default uses search parameter `page`
   * @returns url using the page number
   */
  onRedirect:(page:number)=> string
};

function* count(start:number, end:number) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

export function IssuePagination(props:IssuePaginationProps) {
  const { newSearchParams } = useSearchParamsUpdate();
  const {
    current = 1, max = 30, interval = 10,
    onRedirect = (page) => `?${newSearchParams({ page }).toString()}`,
  } = props;
  const [start, end] = divide(current, max, interval);
  return (
    <Pagination>
      <LinkContainer to={onRedirect(1)}>
        <Pagination.First disabled={current === 1} />
      </LinkContainer>
      <LinkContainer to={onRedirect(current - 1)}>
        <Pagination.Prev disabled={current - 1 <= 0} />
      </LinkContainer>

      {/* <Pagination.Item>{1}</Pagination.Item> */}
      {/* <Pagination.Ellipsis /> */}
      {Array.from(count(start, end))
        .map((cur) => (
          <LinkContainer key={cur} to={onRedirect(cur)}>
            <Pagination.Item active={cur === current}>{cur}</Pagination.Item>
          </LinkContainer>
        ))}
      <LinkContainer to={onRedirect(current + 1)}>
        <Pagination.Next disabled={current + 1 > max} />
      </LinkContainer>
      <LinkContainer to={onRedirect(max)}>
        <Pagination.Last disabled={current === max} />
      </LinkContainer>
    </Pagination>

  );
}
