import React, { useState } from 'react';
import { ConditionalRender } from '#client/utils/ConditionalRender';
import GoogleButton from './GoogleButton';
import { clientID } from './config';
import { SimpleProfile } from './SimpleProfile';

const onSignInPrivate = console.log.bind(null, '[Private] OnSignIn :');

export default function IssueLogin() {
  const [user, setUser] = useState({ signedIn: false });
  return (
    <>
      <p>login: </p>
      <GoogleButton
        onSignIn={(...args) => {
          const res = { ...args[0] };
          onSignInPrivate(...args);
          if (res && res.name && res.picture) {
            res.signedIn = true;
            setUser(res);
          }
        }}
        clientId={clientID}
      />
      <ConditionalRender condition={user.signedIn}>
        <SimpleProfile
          image={user.picture}
          name={user.name}
        />
      </ConditionalRender>
    </>
  );
}
