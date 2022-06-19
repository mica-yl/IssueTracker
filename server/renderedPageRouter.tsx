/* eslint-disable react/jsx-no-constructed-context-values */
// not a component ?
import React from 'react';
import { renderToString } from 'react-dom/server';
import Router from 'express';

import { DynamicallyRouteApp } from '#client/DynamicallyRouteApp';
import { AppRoutes } from '#client/App/App';
import template from './template';
import { ServerContext } from './ServerContext';

function renderedPageRouter() {
  const app = Router();
  app.get('*', (request, response, next) => {
    const context:ServerContext = {
      request, response, inServer: true,
    };
    const html = renderToString(
      <ServerContext.Provider value={context}>
        <DynamicallyRouteApp>
          <AppRoutes />
        </DynamicallyRouteApp>

      </ServerContext.Provider>
      ,
    );
    if (!response.headersSent) {
      response.send(template(html));
    }
  });
  return app;
}

export default renderedPageRouter;
