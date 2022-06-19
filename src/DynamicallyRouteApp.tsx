import { Response } from 'express';
import { BrowserRouter, Navigate } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import React, { ReactNode, useContext } from 'react';
import { SSRProvider } from 'react-bootstrap';
import { ServerContext } from '#server/ServerContext';

type Props = {
  to: string;
  status?: 301 | 302;
};

export function DynamicNavigate(props:
  Props) {
  const { to, status = 302 } = props;
  const { response } = useContext(ServerContext);
  if (response) {
    response.redirect(status, to);
    return null;
  }
  return <Navigate to={to} />;
}
DynamicNavigate.defaultProps = {
  status: 302,
};

type DynamicallyRouteAppProps = {
  // response?: Response;
  // location?: string;
  // AppRoutes: any;
  children:ReactNode
};

export function DynamicallyRouteApp(
  { children }:
  DynamicallyRouteAppProps,
) {
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

DynamicallyRouteApp.defaultProps = {};
