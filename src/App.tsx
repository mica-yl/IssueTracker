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
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { Plus, ThreeDots } from 'react-bootstrap-icons';

import IssueList from './IssueList';
import IssueEdit from './IssueEdit';
import { APIAndComponents, useAPI } from './IssueAPI';
import IssueAddNavItem from './IssueAddNavItem';
import { DynamicNavigate } from './DynamicallyRouteApp';
import { IssueReport } from './IssueReport';

function NotFound() {
  return (<p>Page Not found</p>);
}

function Header(props) {
  const { API: { createIssue } } = props;
  return (
    <Navbar bg="light" variant="light" className="fluid">

      <Container>
        <Navbar.Brand>Issue Tracker</Navbar.Brand>
        <Nav variant="tabs" className="me-auto">
          <Nav.Item>
            <LinkContainer to="/issues">
              <Nav.Link>
                Issues
              </Nav.Link>
            </LinkContainer>
          </Nav.Item>
          <Nav.Item>
            <LinkContainer to="/reports">
              <Nav.Link>
                Reports
              </Nav.Link>
            </LinkContainer>
          </Nav.Item>
        </Nav>
        <Nav className="pull-right">
          <IssueAddNavItem onSubmit={createIssue}>
            <Plus />
            {' '}
            Create Issue
          </IssueAddNavItem>
          <NavDropdown bsPrefix="no-caret" title={<ThreeDots />}>
            <NavDropdown.Item>
              Sign Out
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
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
        <Route path="issues/:id" element={<IssueEdit API={API} Components={Components} />} />
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
