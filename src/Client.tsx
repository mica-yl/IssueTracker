/* eslint-disable react/jsx-no-constructed-context-values */
// not a component
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';

import { ServerContext } from '#server/ServerContext';
import { DynamicallyRouteApp } from './DynamicallyRouteApp';
import { AppRoutes } from './App/App';

const contentNode = document.getElementById('root');

const context:ServerContext = { inServer: false };
ReactDOM.render(
  <DynamicallyRouteApp>
    <AppRoutes />
  </DynamicallyRouteApp>,

  contentNode,
);

if (module.hot) {
  module.hot.accept();
}
