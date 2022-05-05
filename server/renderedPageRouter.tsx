import React from 'react';
import { renderToString } from 'react-dom/server';
import Router from 'express';
import debug from 'debug';

import HelloWorld from '../src/HelloWorld';
import template from './template.js';

const log = debug('app:server:renderedPageRouter');

const renderedPageRouter = Router();
renderedPageRouter.get('*', (req, res) => {
  const html = renderToString(
    <HelloWorld addressee="Server" />,
  );
  res.send(template(html));
});

renderedPageRouter.uuid = Date.now();

// browser routing
const { renderedPageRouterProxy, setRenderedPageRouter } = (() => {
  let currentTarget = renderedPageRouter;
  function setRenderedPageRouter(Router) {
    currentTarget = Router;
  }
  const renderedPageRouterProxy = new Proxy(
    currentTarget,
    {
      apply(target, thisArg, argArray) {
        log(`[${currentTarget.uuid}] : proxying a call ...`);
        return Reflect.apply(currentTarget, thisArg, argArray);
      },
      get(target, p, receiver) {
        log(`[${currentTarget.uuid}]: proxying prop[${p}] ...`);
        return Reflect.get(currentTarget, p, receiver);
      },
    },
  );
  return { renderedPageRouterProxy, setRenderedPageRouter };
})();

if ('hot' in module) {
  module.hot.accept(['../src/HelloWorld.tsx'], () => {
    const routerDispatch = require('./renderedPageRouter').default;
    setRenderedPageRouter(routerDispatch);
    log(`dispatching with ${routerDispatch.uuid}`);
  });
}

export default renderedPageRouterProxy;
