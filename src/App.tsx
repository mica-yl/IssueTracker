/* eslint-disable import/no-import-module-exports */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Route, Routes,
  Navigate,
  Outlet,
} from 'react-router-dom';
// bootstrap
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { Plus, ThreeDots } from 'react-bootstrap-icons';

import { Alert, Modal } from 'react-bootstrap';
import IssueList from './IssueList';
import IssueEdit from './IssueEdit';
import { APIAndComponents, useAPI } from './IssueAPI';
import IssueAddNavItem from './IssueAddNavItem';
// import useIssues, { APIContext, useAPIContext } from './IssueAPI';
// import useAlert from './AlertMsg';

const root = document.getElementById('root');

function NotFound() {
  return (<p>Page Not found</p>);
}

function Header(props) {
  // const { AlertMsg, alertAsync } = useAlert();
  // const { createIssue } = useIssues(alertAsync, async () => false);
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
        {/* <APIContext consumer>{header}</APIContext> */}
        <Header API={API} />
        <Outlet />
        <div className="footer">
          <h1>A Footer</h1>
        </div>
      </div>
    </>
  );
}

function AppRoutes() {
  const { API, Components } = useAPI();

  return (
    <Routes>
      <Route index element={<Navigate to="issues" />} />
      <Route element={<App Components={Components} API={API} />}>
        <Route path="issues" element={<IssueList API={API} />} />
        <Route path="issues/:id" element={<IssueEdit API={API} />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function RoutedApp() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </React.StrictMode>
  );
}

ReactDOM.render(<RoutedApp />, root);

if (module.hot) {
  module.hot.accept();
}
