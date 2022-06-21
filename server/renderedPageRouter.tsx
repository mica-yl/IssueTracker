/* eslint-disable react/jsx-no-constructed-context-values */
// not a component ?
import React from 'react';
import {
  renderToString, renderToStaticNodeStream, renderToStaticMarkup, renderToNodeStream,
} from 'react-dom/server';
import Router from 'express';

import { DynamicRouter } from '#client/DynamicRouter/DynamicRouter';
import { AppRoutes } from '#client/App/App';
import { ServerContext } from '#client/DynamicRouter/ServerContext';
import { templateStream } from './template';

function renderedPageRouter() {
  const app = Router();
  app.get('*', (request, response, next) => {
    const context:ServerContext = {
      request, response, inServer: true,
    };
    const App = (
      <ServerContext.Provider value={context}>
        <DynamicRouter>
          <AppRoutes />
        </DynamicRouter>
      </ServerContext.Provider>
    );
    renderToNodeStream(App)
      .pipe(templateStream())
      // TODO html stream formater
      .pipe(response);
  });
  return app;
}

export default renderedPageRouter;
