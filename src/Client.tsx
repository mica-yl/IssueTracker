import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';

import { DynamicallyRouteApp } from './DynamicallyRouteApp';
import { AppRoutes } from './App/App';

const contentNode = document.getElementById('root');

ReactDOM.render(<DynamicallyRouteApp AppRoutes={AppRoutes} />, contentNode);

if (module.hot) {
  module.hot.accept();
}
