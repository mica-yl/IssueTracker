import React from 'react';
import GoogleButton from './GoogleButton';
import { clientID } from './config';

const onSignInPrivate = console.log.bind(null, '[Private] OnSignIn :');

export default function IssueLogin() {
  return (
    <>
      <p>login: </p>
      <GoogleButton
        onSignIn={onSignInPrivate}
        clientId={clientID}
      />
    </>
  );
}
