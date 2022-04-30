import React, { useState } from 'react';

export default function HelloWorld({ addressee = '' }:{addressee:string}) {
  const [name, setName] = useState(addressee);
  return (
    <>
      <h1>
        Hello
        {' '}
        <input value={name} onChange={(e) => { setName(e.target.value); }} />
        !
      </h1>
      <button type="button" onClick={() => alert(name)}>say hi</button>

    </>
  );
}
