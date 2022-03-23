import React from 'react';
import { useParams, Link } from 'react-router-dom';

// eslint-disable-next-line no-unused-vars
export default function IssueEdit(props) {
  const { id } = useParams();
  return (
    <div>
      <Link to="/issues">Back</Link>
      <p>
        Place Holder for the issueEdit Page of issue :
      </p>
      <p>
        {id}
      </p>
    </div>
  );
}
