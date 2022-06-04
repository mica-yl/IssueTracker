/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { Trash } from 'react-bootstrap-icons';
import { useSearchParamsUpdate } from '#client/react-router-hooks';

export default function IssueRow(props:{issue:Issue}) {
  const {
    issue: {
      _id,
      status, owner, title,
      effort,
      created, completionDate,
    }, onDelete,
  } = props;
  const { newSearchParams } = useSearchParamsUpdate();
  return (
    <tr>
      <td><Link to={_id}>{_id.substr(-6)}</Link></td>
      <td>
        <Link to={`?${newSearchParams({ status }).toString()}`}>
          {status}
        </Link>
      </td>
      <td>
        <Link to={`?${newSearchParams({ owner }).toString()}`}>
          {owner}
        </Link>
      </td>
      <td>{created.toDateString()}</td>
      <td>{effort}</td>
      <td>{completionDate ? completionDate.toDateString() : ''}</td>
      <td>{title}</td>
      <td><Button size="sm" variant="danger" type="button" onClick={onDelete}><Trash /></Button></td>
    </tr>
  );
}
