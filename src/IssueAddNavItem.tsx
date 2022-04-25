import React from 'react';
import propTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Nav from 'react-bootstrap/Nav';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
// import Container from 'react-bootstrap/Container';

const { useState } = React;

export default function IssueAddNavItem(props) {
  const { onSubmit, children } = props;
  const [owner, setOwner] = useState('');
  const [title, setTitle] = useState('');
  const [show, setShow] = useState(false);
  /* TODO? : function need to be defined only once */
  function handleSubmit(event) {
    onSubmit({
      title,
      owner,
      status: 'New',
      created: new Date(),
    }).then((isDone) => {
    // clear state.
      if (isDone === true) {
        setOwner('');
        setTitle('');
      }
    });
    event.preventDefault();
  }
  function handleChange(setter) {
    return (event) => setter(event.target.value);
  }
  return (
    <>
      <Nav.Item onClick={() => setShow(true)}>
        {children}
      </Nav.Item>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>Create Issue</Modal.Header>
        <Form name="issueAdd" onSubmit={handleSubmit}>
          <Modal.Body>
            {[['Owner', owner, setOwner],
              ['Title', title, setTitle],
            ].map(([name, state, setter]) => (
              <Form.Group className="mb-3">
                <Form.Label>{name}</Form.Label>
                <Form.Control placeholder={name} value={state} onChange={handleChange(setter)} />
              </Form.Group>
            ))}

          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar className="pull-left">
              <Button type="submit">Submit</Button>
              <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
            </ButtonToolbar>
          </Modal.Footer>
        </Form>
      </Modal>
    </>

  );
}

IssueAddNavItem.propTypes = {
  onSubmit: propTypes.func.isRequired,
};
