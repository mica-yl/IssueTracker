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
import { createRoutesFromChildren, matchPath, matchRoutes } from 'react-router-dom';
import debug from 'debug';
import { DataContext } from '#client/DataContext/DataProvider';
import { ObjectId } from 'mongodb';
import { templateStream } from './template';
import { preRenderHook } from './preRenderHook.static';

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
    const data = new Map();
    if (matches) {
      // dependences
      request.db.ObjectId = ObjectId;

      // request params
      const patterns = matches
        .map((x) => x.params)
        .filter((x) => x);

      request.params = {
        ...request.params,
        ...patterns.reduce((prev, curr) => ({ ...prev, ...curr })),
      };
      log('params: %O', request.params);

      // pre-render hooks : wait for all data first
      await Promise.all(
        matches
          .map((x) => [x.route.element?.type, x.route.element?.props])
          .filter(([x, y]) => x && y)// could cause a problem ?
          .map(async ([element, providedProps]) => {
            let props;
            if (element.defaultProps) {
              props = { ...element.defaultProps };
            }
            props = { ...props, ...providedProps };
            if (preRenderHook in element) {
              const elementData = await element[preRenderHook]({ request, response, props });
              data.set(element, elementData?.data);
              log('element return: %o → %o', element.name, elementData);
            }
          }),
      );
      log('data: %o', data);
      // if redirect quit.
      if (response.headersSent) {
        return;
      }
    }

    const App = (
      <ServerContext.Provider value={context}>
        <DataContext.Provider value={data}>
          <DynamicRouter>
            <AppRoutes />
          </DynamicRouter>
        </DataContext.Provider>
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
