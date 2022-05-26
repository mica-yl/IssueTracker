import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

export function IssuePagination(props) {
  const { max = 30, limit = 5 } = props;

  return (
    <Pagination>
      <Pagination.First />
      <Pagination.Prev />

      <Pagination.Item>{1}</Pagination.Item>
      <Pagination.Ellipsis />

      <Pagination.Item>{10}</Pagination.Item>
      <Pagination.Item>{11}</Pagination.Item>
      <Pagination.Item active>{12}</Pagination.Item>
      <Pagination.Item>{13}</Pagination.Item>
      <Pagination.Ellipsis />
      <Pagination.Item>{20}</Pagination.Item>
      <Pagination.Next />
      <Pagination.Last />
    </Pagination>

  );
}
