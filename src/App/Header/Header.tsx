import React, { useContext } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { Plus, ThreeDots } from 'react-bootstrap-icons';
import { API } from '#client/IssueAPI';
import { Image, Stack } from 'react-bootstrap';
import IssueAddNavItem from './IssueAddNavItem';
import UserNavItem from './UserNavItem';
import { UserContext } from '../login/UserProvider';

export default function Header(props:{API:API}) {
  const { API: { createIssue } } = props;
  const user = useContext(UserContext);

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
          {/* <UserNavItem /> */}
          <NavDropdown
            bsPrefix="no-caret"
            title={(
              <Stack direction="horizontal">
                <Image src={user.picture} fluid roundedCircle />
                <Nav.Item>
                  {user.name}
                </Nav.Item>
                <ThreeDots />

              </Stack>
        )}
          >
            <NavDropdown.Item>
              Sign Out
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}
