/* eslint-disable import/no-import-module-exports */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import {
  Route, Routes,
  Outlet,
} from 'react-router-dom';

import ApiProvider from '#client/API/ApiProvider';
import ToastProvider from '#client/Toast/ToastProvider';
import IssueList from './issues/IssueList';
import IssueEdit from './issues/edit/IssueEdit';
import { DynamicNavigate } from '../DynamicRouter/DynamicNavigate';
import { IssueReport } from './report/IssueReport';
import Header from './Header/Header';
import IssueLogin from './login/IssueLogin';
import UserProvider from './login/UserProvider';

function NotFound() {
  return (<p>Page Not found</p>);
}

function App() {
  return (
    <div className="container-fluid">
      <UserProvider>
        <Header />
        <Outlet />
        <div className="footer">
          <h1>A Footer</h1>
        </div>
      </UserProvider>
    </div>
  );
}

export const AppRoutesObj = (
  [
    <Route index element={<DynamicNavigate to="issues" />} key="root" />,
    <Route element={<App />} key="App">
      <Route path="issues" element={<IssueList />} />
      <Route path="issues/:id" element={<IssueEdit />} />
      <Route path="login" element={<IssueLogin />} />
      <Route path="reports" element={<IssueReport />} />
      <Route path="*" element={<NotFound />} />
    </Route>,
  ]
);

export function AppRoutes() {
  return (
    <ToastProvider>
      <ApiProvider>
        <Routes>
          {AppRoutesObj}
        </Routes>
      </ApiProvider>
    </ToastProvider>
  );
}
