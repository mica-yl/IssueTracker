import React from 'react';
import propTypes from 'prop-types';

const { useState } = React;

export default function IssueAdd(props) {
  const { onSubmit } = props;
  const [owner, setOwner] = useState('');
  const [title, setTitle] = useState('');
  /* TODO? : function need to be defined only once */
  function handleSubmit(event) {
    onSubmit({
      title,
      owner,
      status: 'New',
      created: new Date(),
    }).then((isDone) => {
    // clear state.
      if (isDone === true) {
        setOwner('');
        setTitle('');
      }
    });
    event.preventDefault();
  }
  function handleChange(setter) {
    return (event) => setter(event.target.value);
  }
  return (
    <div>
      <form name="issueAdd" onSubmit={handleSubmit}>
        <input placeholder="Owner" value={owner} onChange={handleChange(setOwner)} />
        <input placeholder="Title" value={title} onChange={handleChange(setTitle)} />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

IssueAdd.propTypes = {
  onSubmit: propTypes.func.isRequired,
};
