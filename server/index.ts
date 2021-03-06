/* eslint-disable import/no-import-module-exports */
import 'source-map-support/register'; // load source map
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import http from 'http';
import { MongoClient } from 'mongodb';
import debug from 'debug';
import type { Express } from 'express';
import getApp from './server';

const log = debug('app:server:index');

// eslint-disable-next-line @typescript-eslint/no-var-requires

const server = http.createServer();
(async () => {
  const client = await MongoClient.connect('mongodb://localhost:27017/issuetracker');

  const appInstance = getApp(client);
  server.on('request', appInstance);
  server.listen(getApp.port, () => {
    console.log(`App started on port ${getApp.port}`);
  });

  function counter() {
    let n = 0;
    return () => n++;
  }
  function dispatchServer(firstAppInstance:Express) {
    let localAppInstance = firstAppInstance;
    const tick = counter();
    return () => {
      log(`App dispatching [${tick()}] ...`);// why it doesn't change ?
      server.removeAllListeners('request');
      // server.removeListener('request', localAppInstance);// triggers a bug ?
      const getAppPatched = require('./server').default;     // eslint-disable-line
      localAppInstance = getAppPatched(client);
      server.on('request', localAppInstance);
    };
  }

  if ('hot' in module) {
    module.hot.accept(['./server.ts', './renderedPageRouter.tsx'], dispatchServer(appInstance));
  }
})();
