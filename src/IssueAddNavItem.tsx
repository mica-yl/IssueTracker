import React from 'react';
import propTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Nav from 'react-bootstrap/Nav';

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
        <Modal.Header closeButton>Add Issue</Modal.Header>
        <Form name="issueAdd" onSubmit={handleSubmit}>
          <Form.Group>
            <Modal.Body>
              <Row>
                <Col xs={4} md={3} lg={2}>
                  <Form.Control placeholder="Owner" value={owner} onChange={handleChange(setOwner)} />
                </Col>
                <Col xs={6} md={5} lg={4}>
                  <Form.Control placeholder="Title" value={title} onChange={handleChange(setTitle)} />
                </Col>

              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Row>

                <Col>
                  <Button type="submit">Submit</Button>
                </Col>
                <Col>
                  <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
                </Col>
              </Row>
            </Modal.Footer>
          </Form.Group>
        </Form>
      </Modal>
    </>

  );
}

IssueAddNavItem.propTypes = {
  onSubmit: propTypes.func.isRequired,
};
