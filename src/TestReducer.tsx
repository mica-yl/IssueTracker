import React, { useReducer, useState } from 'react';

function reducer(state, action) {
  return { ...state, ...action };
}
const withHandle = (f) => (ev) => f(ev.target.value);

export default function TestReducer() {
  const [key, setKey] = useState('key');
  const [value, setValue] = useState('value');
  const [state, dispatch] = useReducer(reducer, {});

  return (
    <>
      {`state: ${JSON.stringify(state)}`}
      <input onChange={withHandle(setKey)} />
      <input onChange={withHandle(setValue)} />
      <button onClick={() => dispatch({ [key]: value })}>Apply</button>
    </>
  );
}
