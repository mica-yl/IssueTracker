import React, { ReactNode, useContext, useMemo } from 'react';
import useAlert, { AlertAsync } from './AlertMsg';
import useAsk, { Ask } from './Ask';

type ToastProviderProps = {
  children: ReactNode,
};

export type ToastAPI = {
  ask:Ask,
  alertAsync:AlertAsync
};

export const ToastContext = React.createContext({} as ToastAPI);

export default function ToastProvider(props:ToastProviderProps) {
  const { children } = props;
  const { Ask: AskComponent, ask } = useAsk();
  const { AlertMsg, alertAsync } = useAlert();
  const ToastAPIObj = useMemo(() => ({ ask, alertAsync }), []);
  return (
    <ToastContext.Provider value={ToastAPIObj}>
      <AskComponent />
      <AlertMsg />
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
