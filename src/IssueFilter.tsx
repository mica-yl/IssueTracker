import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function Separator() {
  return <span> | </span>;
}

export default function IssueFilter(props) {
  const { filters: { status } } = props;
  return (
    <div>
      <p>
        filters :
        {' '}
        <Link to={{ pathname: '.', search: '' }}>
          clear
        </Link>
        <br />
        status :
        {' '}
        {status.map((aStatus, i, arr) => (
          <span key={aStatus}>
            <Link to={`?status=${aStatus}`}>
              {aStatus}
            </Link>
            {i < arr.length - 1 ? <Separator /> : ''}
          </span>
        ))}
      </p>
    </div>
  );
}
IssueFilter.defaultProps = {
  filters: [],
};
IssueFilter.propTypes = {
  filters: PropTypes.shape({
    status: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,

  }),
};
