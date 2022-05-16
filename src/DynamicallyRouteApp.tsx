import { Response } from 'express';
import { BrowserRouter, Navigate } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import React from 'react';
import { SSRProvider } from 'react-bootstrap';

export function DynamicNavigate(props:
  {response?:Response, to?:string, status?:301|302}) {
  const { response, to, status = 302 } = props;
  if (response && to) {
    response.redirect(status, to);
    return null;
  }
  return <Navigate to={to} />;
}

export function DynamicallyRouteApp(
  { location, response, AppRoutes }:
  {response?:Response, location?:string, AppRoutes:any},
) {
  if (response) {
    return (
      <React.StrictMode>
        <SSRProvider>
          <StaticRouter location={location}>
            <AppRoutes response={response} url={location} />
          </StaticRouter>
        </SSRProvider>
      </React.StrictMode>
    );
  }
  return (
    <React.StrictMode>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </React.StrictMode>

  );
}
