import React, { ReactNode, useContext, useMemo } from 'react';

type DataProviderProps = {
  children: ReactNode,
};

type DataContext = Map<Function, unknown>;

const DataContextObj = new Map();
export const DataContext = React.createContext(DataContextObj as DataContext);

export default function DataProvider(props:DataProviderProps) {
  const { children } = props;
  return (
    <DataContext.Provider value={DataContextObj}>
      {children}
    </DataContext.Provider>
  );
}

export function useData(key:Function) {
  return useContext(DataContext)?.get(key);
}
