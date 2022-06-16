import React, { useState } from 'react';

export const defaultUser = {
  name: 'John Doe',
  signedIn: false,
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

  return (
    <UserContext.Provider value={user}>
      <UserDispatcher.Provider value={setUser}>
        {children}
      </UserDispatcher.Provider>
    </UserContext.Provider>
  );
}
