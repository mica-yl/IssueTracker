/* eslint-disable import/no-import-module-exports */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter, BrowserRouter,
  Route, Routes,
  Navigate,
} from 'react-router-dom';

import IssueList, { App } from './IssueList';
import IssueEdit from './IssueEdit';

const root = document.getElementById('root');

function NotFound() {
  return (<p>Page Not found</p>);
}

function RoutedApp() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route index element={<Navigate to="issues" />} />
          <Route element={<App />}>
            <Route path="issues" element={<IssueList />} />
            <Route path="issues/:id" element={<IssueEdit />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}

ReactDOM.render(<RoutedApp />, root);

if (module.hot) {
  module.hot.accept();
}
