import { useToast } from '#client/Toast/ToastProvider';
import React, { ReactNode } from 'react';
import { useAPI, API } from './IssueAPI';

type ApiProviderProps = {
  children: ReactNode,
};

export const ApiContext = React.createContext({} as API);

export default function ApiProvider({ children }: ApiProviderProps) {
  const ToastAPI = useToast();
  const api = useAPI(ToastAPI);
  return (
    <ApiContext.Provider value={api}>
      {children}
    </ApiContext.Provider>
  );
}
