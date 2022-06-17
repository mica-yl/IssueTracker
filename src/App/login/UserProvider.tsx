import React, { useEffect, useState } from 'react';

export const defaultUser = {
  name: 'John Doe',
  signedIn: false,
  picture: '/favicon.ico',
};
export const UserContext = React.createContext(defaultUser);
export const UserDispatcher = React.createContext((user) => {
  console.error(user);
});

type UserContextProps = {

  children: JSX.Element []
};

export default function UserProvider(props:UserContextProps) {
  const { children } = props;
  const [user, setUser] = useState(defaultUser);
  useEffect(async () => {
    try {
      const res = await fetch('http://localhost:8082/api/v1/users/me');
      const currentUser = await res.json();
      if (currentUser.signedIn) {
        setUser(currentUser);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <UserContext.Provider value={user}>
      <UserDispatcher.Provider value={setUser}>
        {children}
      </UserDispatcher.Provider>
    </UserContext.Provider>
  );
}
