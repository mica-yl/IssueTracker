import React from 'react';
import { renderToString } from 'react-dom/server';
import Router from 'express';

import { DynamicallyRouteApp } from '#client/DynamicallyRouteApp';
import { AppRoutes } from '#client/App/App';
import template from './template';

function renderedPageRouter() {
  const app = Router();
  app.get('*', (req, res, next) => {
    const html = renderToString(
      <DynamicallyRouteApp
        location={req.url}
        response={res}
        AppRoutes={AppRoutes}
      />,
    );
    if (!res.headersSent) {
      res.send(template(html));
    }
  });
  return app;
}

export default renderedPageRouter;
