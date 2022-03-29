import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { StatusFilter } from './StatusFilter';

function EffortFilter() {

  return (
    <>
      effort :
      {' from'}
      <input />
      {' to '}
      <input />
      <button>Apply</button>
      <button>Reset</button>
    </>
  );
}

export default function IssueFilter(props) {
  const { filters: { status: $status } } : {filters: {status : string[]}} = props;
  return (
    <div>
      <p>
        filters :
        {' '}
        <Link to={{ pathname: '.', search: '' }}>
          clear
        </Link>
        <br />
        <StatusFilter statusArr={$status} />
        <br />
        <EffortFilter />
      </p>
    </div>
  );
}
