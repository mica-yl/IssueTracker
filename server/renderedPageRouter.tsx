/* eslint-disable react/jsx-no-constructed-context-values */
// not a component ?
import React from 'react';
import {
  renderToString, renderToNodeStream,
} from 'react-dom/server';
import Router from 'express';

import { DynamicRouter } from '#client/DynamicRouter/DynamicRouter';
import { AppRoutes, AppRoutesObj } from '#client/App/App';
import { ServerContext } from '#client/DynamicRouter/ServerContext';
import { createRoutesFromChildren, matchRoutes } from 'react-router-dom';
import debug from 'debug';
import { templateStream } from './template';
import { preRenderHook } from './preRenderHook';

const log = debug(`app:index:server:${renderedPageRouter.name}`);
function renderedPageRouter() {
  const app = Router();

  app.get('*', async (request, response) => {
    const context:ServerContext = {
      request, response, inServer: true,
    };
    // server rendering
    const matches = matchRoutes(createRoutesFromChildren(AppRoutesObj), request.url);
    log('Components to be rendered: %O', matches?.map((x) => [x.pathname, x.route.element?.type?.name]));
    // pre-render
    if (matches) {
      const data = new Map();
      await matches
        .map((x) => [x.route.element?.type, x.route.element?.props])
        .filter(([x, y]) => x && y)
        .map(async ([element, providedProps]) => {
          let props;
          if (element.defaultProps) {
            props = { ...element.defaultProps };
          }
          props = { ...props, ...providedProps };
          if (preRenderHook in element) {
            const elementData = await element[preRenderHook]({ request, response, props });
            data.set(element, elementData);
            log('element data: %o → %o', element.name, elementData);
          }
        });
      log('data: %o', data);
      log('response destroyed: %o', response.destroyed);
      if (response.headersSent) {
        return;
      }
    }

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
