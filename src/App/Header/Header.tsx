import React, { useContext } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { Plus, ThreeDots } from 'react-bootstrap-icons';
import { API } from '#client/IssueAPI';
import { Image, Stack } from 'react-bootstrap';
import { ConditionalRender } from '#client/utils/ConditionalRender';
import IssueAddNavItem from './IssueAddNavItem';
import UserNavItem from './UserNavItem';
import { UserContext, UserDispatcher } from '../login/UserProvider';
import SignOutNavDropDownItem from './SignOutNavDropDownItem';

export default function Header(props:{API:API}) {
  const { API: { createIssue } } = props;
  const user = useContext(UserContext);
  const dispatchUser = useContext(UserDispatcher);

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
          <ConditionalRender condition={user.signedIn}>
            <IssueAddNavItem onSubmit={createIssue}>
              <Plus />
              {' '}
              Create Issue
            </IssueAddNavItem>
          </ConditionalRender>
          {/* <UserNavItem /> */}
          <NavDropdown
            bsPrefix="no-caret"
            align="end"
            title={(
              // needs adaptive resizing
              <Image src={user.picture} fluid roundedCircle width="50px" />
        )}
          >
            <NavDropdown.Header>
              {user.name}
            </NavDropdown.Header>
            <NavDropdown.Divider />
            <ConditionalRender condition={user.signedIn}>
              <SignOutNavDropDownItem
                refresh={() => dispatchUser('refresh')}
              >
                Sign Out
              </SignOutNavDropDownItem>
            </ConditionalRender>
            <ConditionalRender condition={!user.signedIn}>
              <LinkContainer to="/login">
                <NavDropdown.Item>
                  Log In
                </NavDropdown.Item>
              </LinkContainer>
            </ConditionalRender>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}
