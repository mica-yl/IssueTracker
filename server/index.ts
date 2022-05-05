/* eslint-disable import/no-import-module-exports */
import SourceMapSupport from 'source-map-support';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import http from 'http';
import { MongoClient } from 'mongodb';

SourceMapSupport.install();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const getApp = require('./server').default;

const server = http.createServer();
(async () => {
  const db = await MongoClient.connect('mongodb://localhost:27017')
    .then((Client) => Client.db('issuetracker'))
    .catch((error) => {
      console.log('ERROR:', error);
    });

  const appInstance = getApp(db);
  server.on('request', appInstance);
  server.listen(getApp.port, () => {
    console.log(`App started on port ${getApp.port}`);
  });

  function dispatchServer(firstAppInstance) {
    let localAppInstance = firstAppInstance;
    return () => {
      server.removeListener('request', localAppInstance);
      const getAppPatched = require('./server').default;     // eslint-disable-line
      localAppInstance = getAppPatched(db);
      server.on('request', localAppInstance);
    };
  }

  // if ('hot' in module) {
  //   module.hot.accept(
  //     ['./renderedPageRouter.tsx'],
  //     //  dispatchServer(appInstance));
  //     // module.hot.accept('../src/HelloWorld.tsx',
  //     () => {
  //       const routerDispatch = require('./renderedPageRouter').default;
  //       console.log(`dispatching with ${routerDispatch.uuid}`);
  //       appInstance.setRenderedPageRouter(routerDispatch);
  //     },
  //   );
  // }
})();
