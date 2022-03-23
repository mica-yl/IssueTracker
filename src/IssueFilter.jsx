import React from 'react';
import { Link } from 'react-router-dom';

export default function IssueFilter(props) {
  const { filters: { status }, onRefresh } = props;
  return (
    <div>
      <h2>filters:</h2>
      <p>status :</p>
      {status.map((aStatus) => (
        <div>
          <Link to={`?status=${aStatus}`} onClick={onRefresh}>{aStatus}</Link>
          {' '}
        </div>
      ))}
    </div>
  );
}
