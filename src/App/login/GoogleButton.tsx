import React, { useRef } from 'react';
import { decodeJwt, jwtDecrypt, JWTPayload } from 'jose';
import GoogleSignInClient from './GoogleSignIn';

type DecodedPayload = JWTPayload & {
  /**
   * client id
   */
  azp : string,
  name : string,
  given_name : string,
  family_name : string,
  email : string,
  email_verified : boolean,
  picture : string,
}
type CerdentialCallback= (payload:DecodedPayload)=>void;

function decoder(callback:CerdentialCallback) {
  return (res:google.accounts.id.CredentialResponse) => {
    const payload = decodeJwt(res.credential);
    setTimeout(() => (callback ? callback(payload) : null));
  };
}

export type GoogleButtonProps = {
  onSignIn:CerdentialCallback,
  clientId:google.accounts.id.IdConfiguration['client_id'],
};

export default function GoogleButton(props:GoogleButtonProps) {
  const { onSignIn, clientId } = props;
  const googleButtonRef = useRef(null);
  return (
    <>
      <GoogleSignInClient
        onLoad={({ google, gapi }) => {
          if (google && gapi) {
            // https://www.googleapis.com/auth/userinfo.profile
          /*
          google.accounts.oauth2.initCodeClient(
            {
              client_id: clientId,
              callback: onSignIn,
              scope: 'https://www.googleapis.com/auth/userinfo.profile',
            },

          );
          */
            /*
          google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            callback: onSignIn,
            scope: 'https://www.googleapis.com/auth/userinfo.profile',
          }).requestAccessToken();
          */

            google.accounts.id.initialize({
              client_id: clientId,
              callback: decoder(onSignIn),
              // native_callback: onSignIn,
              ux_mode: 'popup', // default
            });
            google.accounts.id.renderButton(
              googleButtonRef.current,
              {
                type: 'standard',
                theme: 'filled_blue',
              },
            );
          }
        }}
      />
      <div ref={googleButtonRef} id="google-button">
        loading google Sign-In...
      </div>
    </>
  );
}
