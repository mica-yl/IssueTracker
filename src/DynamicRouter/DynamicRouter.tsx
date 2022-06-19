import { BrowserRouter } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import React, { ReactNode, useContext } from 'react';
import { SSRProvider } from 'react-bootstrap';
import { ServerContext } from './ServerContext';

type DynamicRouterProps = {
  children:ReactNode
};

export function DynamicRouter({ children }: DynamicRouterProps) {
  const { request } = useContext(ServerContext);
  if (request) {
    return (
      <React.StrictMode>
        <SSRProvider>
          <StaticRouter location={request.url}>
            {children}
          </StaticRouter>
        </SSRProvider>
      </React.StrictMode>
    );
  }
  return (
    <React.StrictMode>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </React.StrictMode>

  );
}

DynamicRouter.defaultProps = {};
