import { ServerContext } from '#server/ServerContext';
import React, {
  useContext, useEffect, useMemo, useState,
} from 'react';

export const defaultUser = {
  name: 'John Doe',
  signedIn: false,
  picture: '/favicon.ico',
};

type User = typeof defaultUser;

export const UserContext = React.createContext(defaultUser);
export const UserDispatcher = React.createContext(console.error as UserDispatcher);
type UserDispatcher = ReturnType<typeof dispatchUser>;

async function getMe() {
  const res = await fetch('http://localhost:8082/api/v1/users/me');
  const currentUser: User = await res.json();
  if (currentUser.signedIn) {
    // setUser(currentUser);
    return currentUser;
  }
}

function dispatchUser(setUser:(i:User)=>void) {
  return (i:User|string) => {
    if (typeof i === 'string') {
      switch (i) {
        case 'refresh':
          return setUser(defaultUser);
        default:
          return console.error(`unknown command: ${i}`);
      }
    } else {
      return setUser(i);
    }
  };
}

type UserContextProps = {

  children: JSX.Element []
};

export default function UserProvider(props:UserContextProps) {
  const { children } = props;
  const { request } = useContext(ServerContext);
  const currentUser: User = useMemo(() => {
    if (request && request.session && request.session.user) {
      return request.session.user;
    }
    return defaultUser;
  }, []);
  const [user, setUser] = useState(currentUser);

  useEffect(() => {
    getMe()
      .then((me) => (me ? setUser(me) : null));
  }, []);

  return (
    <UserContext.Provider value={user}>
      <UserDispatcher.Provider value={dispatchUser(setUser)}>
        {children}
      </UserDispatcher.Provider>
    </UserContext.Provider>
  );
}
