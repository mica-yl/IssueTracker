import React from 'react';
import makeAsyncScriptLoader from 'react-async-script';
import { clientID } from './config';

if ('document' in globalThis) {
  globalThis.onSignIn = console.log.bind(null, 'OnSignIn :');
}
const onSignIn = console.log.bind(null, '[Private] OnSignIn :');

function GoogleButton() {
  // return (<p>google is loaded !</p>);
  return (
    <>
      <div
        id="g_id_onload"
        data-client_id={clientID}
        data-context="signin"
        data-ux_mode="popup"
        data-callback="onSignIn"
        data-auto_prompt="false"
      />

      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left"
      />
    </>

  );
}
const src = 'https://accounts.google.com/gsi/client';
const AsyncScriptComponent = makeAsyncScriptLoader(
  src,
  {
    attributes: {
      defer: '',
      async: '',
    },
    removeOnUnmount: true,
  },
)(GoogleButton);

export default function IssueLogin() {
  return (
    <>
      <p>login: </p>
      <AsyncScriptComponent asyncScriptOnLoad={() => {
        console.log('done!', globalThis.google);
        google.accounts.id.initialize({
          client_id: clientID,
          callback: onSignIn,
        });
        google.accounts.id.prompt();
      }}
      />
    </>
  );
}
