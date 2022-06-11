import React, { useRef } from 'react';
import makeAsyncScriptLoader from 'react-async-script';

const gsiClientScriptSrc = 'https://accounts.google.com/gsi/client';
// eslint-disable-next-line react/function-component-definition
const Null = () => null;
const AsyncScriptComponent = makeAsyncScriptLoader(
  gsiClientScriptSrc,
  {
    attributes: {
      defer: '',
      async: '',
    },
    removeOnUnmount: true,
  },
)(Null);

export type GoogleButtonProps = {
  onSignIn:google.accounts.id.IdConfiguration['callback'],
  clientId:google.accounts.id.IdConfiguration['client_id'],
};

export default function GoogleButton(props:GoogleButtonProps) {
  const { onSignIn, clientId } = props;
  const googleButtonRef = useRef(null);
  return (
    <>
      <AsyncScriptComponent
        asyncScriptOnLoad={() => {
          google.accounts.id.initialize({
            client_id: clientId,
            callback: onSignIn,
          });
          google.accounts.id.renderButton(
            googleButtonRef.current,
            {
              type: 'standard',
              theme: 'filled_blue',
            },
          );
        }}
      />
      <div ref={googleButtonRef} id="google-button">
        loading google Sign-In...
      </div>
    </>
  );
}
