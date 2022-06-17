import React, { ReactNode, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Nav from 'react-bootstrap/Nav';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import { NavDropdown } from 'react-bootstrap';

async function signOut() {
  return fetch('http://localhost:8082/api/v1/users/signout', {
    method: 'POST',
  });
}
type SignOutNavDropDownItemProps= {
  refresh:()=> void,
  children: ReactNode,
};

export default function SignOutNavDropDownItem(props:SignOutNavDropDownItemProps) {
  const { refresh, children } = props;
  const [show, setShow] = useState(false);
  return (
    <>
      <NavDropdown.Item onClick={() => setShow(true)}>
        {children}
      </NavDropdown.Item>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>Sign Out</Modal.Header>
        <Modal.Body>
          Are you sure that you want to Sign out?
        </Modal.Body>
        <Modal.Footer>
          <ButtonToolbar className="gap-2">
            <Button
              variant="danger"
              onClick={() => {
                signOut()
                  .then(() => refresh());
              }}
            >
              Yes, Sign me out!
            </Button>
            <Button variant="outline-dark" onClick={() => setShow(false)}>Cancel</Button>
          </ButtonToolbar>
        </Modal.Footer>
      </Modal>
    </>

  );
}
