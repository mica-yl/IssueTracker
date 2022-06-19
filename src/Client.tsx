/* eslint-disable react/jsx-no-constructed-context-values */
// not a component
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';

import { DynamicRouter } from '#client/DynamicRouter/DynamicRouter';
import { AppRoutes } from './App/App';

const contentNode = document.getElementById('root');

ReactDOM.render(
  <DynamicRouter>
    <AppRoutes />
  </DynamicRouter>,

  contentNode,
);

if (module.hot) {
  module.hot.accept();
}
