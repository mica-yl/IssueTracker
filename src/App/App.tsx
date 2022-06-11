/* eslint-disable import/no-import-module-exports */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React, { useState } from 'react';
import {
  BrowserRouter,
  Route, Routes,
  Outlet,
} from 'react-router-dom';
// bootstrap

import { Button } from 'react-bootstrap';
import IssueList from './issues/IssueList';
import IssueEdit from './issues/edit/IssueEdit';
import { APIAndComponents, useAPI } from '../IssueAPI';
import { DynamicNavigate } from '../DynamicallyRouteApp';
import { IssueReport } from './report/IssueReport';
import Header from './Header';
import IssueLogin from './login/IssueLogin';

function NotFound() {
  return (<p>Page Not found</p>);
}

function App(props: APIAndComponents) {
  const { API, Components: { Ask, AlertMsg } } = props;
  return (
    <>
      <>
        <Ask />
        <AlertMsg />
      </>
      <div className="container-fluid">
        <Header API={API} />
        <Outlet />
        <div className="footer">
          <h1>A Footer</h1>
        </div>
      </div>
    </>
  );
}

export function AppRoutes({ response }) {
  const { API, Components } = useAPI();

  return (
    <Routes>
      <Route index element={<DynamicNavigate response={response} to="issues" />} />
      <Route element={<App Components={Components} API={API} />}>
        <Route path="issues" element={<IssueList API={API} />} />
        <Route path="issues/:id" element={<IssueEdit API={API} />} />
        <Route path="login" element={<IssueLogin />} />
        <Route path="reports" element={<IssueReport />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function RoutedApp() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        {/* <MemoryRouter> */}
        <AppRoutes response={undefined} />
        {/* </MemoryRouter> */}
      </BrowserRouter>
    </React.StrictMode>
  );
}
