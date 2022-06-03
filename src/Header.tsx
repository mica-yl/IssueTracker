import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { Plus, ThreeDots } from 'react-bootstrap-icons';
import IssueAddNavItem from './IssueAddNavItem';
import { API } from './IssueAPI';


export function Header(props:{API:API}) {
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
