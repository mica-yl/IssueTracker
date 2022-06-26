/* eslint-disable react/jsx-no-constructed-context-values */
// not a component ?
import React from 'react';
import {
  renderToString, renderToNodeStream,
} from 'react-dom/server';
import Router from 'express';

import { DynamicRouter } from '#client/DynamicRouter/DynamicRouter';
import { AppRoutes } from '#client/App/App';
import { ServerContext } from '#client/DynamicRouter/ServerContext';
import { templateStream } from './template';

function renderedPageRouter() {
  const app = Router();
  app.get('/', (req, res) => {
    // static solution in
    res.redirect('/issues');
  });
  app.get('*', (request, response) => {
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
      // .pipe(safeRedirect(response))
      .pipe(response);
  });
  return app;
}

export default renderedPageRouter;
