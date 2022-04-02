/* eslint-disable import/no-import-module-exports */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Route, Routes,
  Navigate,
  Outlet,
} from 'react-router-dom';

import IssueList from './IssueList';
import IssueEdit from './IssueEdit';

const root = document.getElementById('root');

function NotFound() {
  return (<p>Page Not found</p>);
}

function App() {
  return (
    <div>
      <div className="header">
        <h1>Issue Tracker</h1>
      </div>
      <Outlet />
      <div className="footer">
        <h1>A Footer</h1>
      </div>
    </div>
  );
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
