import React, { ReactNode } from 'react';
import { useAPI, API } from './IssueAPI';

type ApiProviderProps = {
  children: ReactNode,
};

export const ApiContext = React.createContext({} as API);

export default function ApiProvider({ children }: ApiProviderProps) {
  const { API: api, Components: { Ask, AlertMsg } } = useAPI();
  return (
    <ApiContext.Provider value={api}>
      <Ask />
      <AlertMsg />
      {children}
    </ApiContext.Provider>
  );
}
