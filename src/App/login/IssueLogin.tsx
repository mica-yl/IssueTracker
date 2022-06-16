import React, { useContext, useState } from 'react';
import { ConditionalRender } from '#client/utils/ConditionalRender';
import { Card } from 'react-bootstrap';
import GoogleButton from './GoogleButton';
import { clientID } from './config';
import { SimpleProfile } from './SimpleProfile';
import { UserContext, UserDispatcher } from './UserProvider';

const onSignInPrivate = console.log.bind(null, '[Private] OnSignIn :');

export default function IssueLogin() {
  // const [user, setUser] = useState({ signedIn: false });
  const user = useContext(UserContext);
  const dispatchUser = useContext(UserDispatcher);
  return (
    <>
      <p>login: </p>
      <GoogleButton
        onSignIn={(...args) => {
          const res = { ...args[0] };
          onSignInPrivate(...args);
          if (res && res.name && res.picture) {
            res.signedIn = true;
            dispatchUser(res);
          }
        }}
        clientId={clientID}
      />
      <ConditionalRender condition={user.signedIn}>
        <Card>
          <SimpleProfile
            image={user.picture}
            name={user.name}
          />
        </Card>
      </ConditionalRender>
    </>
  );
}
