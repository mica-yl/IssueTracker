/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { Trash } from 'react-bootstrap-icons';
import { useSearchParamsUpdate } from '#client/react-router-hooks';
import { Issue } from '#server/issue';
import { ConditionalRender } from '#client/utils/ConditionalRender';
import { UserContext } from '../login/UserProvider';

type IssueRowProps = {
  issue: Issue,
  onDelete?: ()=>void,
};

export default function IssueRow(props:IssueRowProps) {
  const {
    issue: {
      _id,
      status, owner, title,
      effort,
      created, completionDate,
    }, onDelete,
  } = props;
  const { signedIn } = useContext(UserContext);
  const { newSearchParams } = useSearchParamsUpdate();
  return (
    <tr>
      <td><Link to={_id}>{_id.substring(_id.length - 7)}</Link></td>
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
      <ConditionalRender condition={signedIn}>
        <td><Button size="sm" variant="danger" type="button" onClick={onDelete}><Trash /></Button></td>
      </ConditionalRender>
    </tr>
  );
}

IssueRow.defualtProps = {
  onDelete: undefined,
};
