/* eslint-disable import/no-import-module-exports */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter,
  Route, Routes,
  Navigate,
} from 'react-router-dom';

import IssueList from './IssueList.jsx';
import IssueEdit from './IssueEdit.jsx';

const root = document.getElementById('root');

function NotFound() {
  return (<p>Page Not found</p>);
}

function App() {
  return (
    <React.StrictMode>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Navigate to="issues" />} />
          <Route path="issues" element={<IssueList />} />
          <Route path="issues/:id" element={<IssueEdit />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </React.StrictMode>
  );
}

ReactDOM.render(<App />, root);

if (module.hot) {
  module.hot.accept();
}
