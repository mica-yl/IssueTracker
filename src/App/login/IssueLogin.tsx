import React, { useContext, useState } from 'react';
import { ConditionalRender } from '#client/utils/ConditionalRender';
import { Card } from 'react-bootstrap';

import GoogleButton from './GoogleButton';
import { clientID } from './config';
import { SimpleProfile } from './SimpleProfile';
import { UserContext, UserDispatcher } from './UserProvider';

const onSignInPrivate = console.log.bind(null, '[Private] OnSignIn :');

type Person = {
  name:string,
  picture:string,
  id:string,
};

function signIn(user:Person) {
  fetch('/api/v1/users/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    console.error(response);
    throw response;
  });
}



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
            const userFixed = {
              name: res.name, id: res.sub, picture: res.picture, signedIn: true,
            };
            res.signedIn = true;
            signIn(userFixed);
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
