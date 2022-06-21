import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function useAsk() {
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState('');
  const [callback, setCallback] = useState(() => (_) => 0);
  // const [result,setResult]=useState();
  function Ask(props) {
    return (
      <Modal show={show} backdrop="static" {...props}>
        <Modal.Header />
        <Modal.Body>{msg}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => (callback(true), setShow(false))}>Yes</Button>
          <Button variant="secondary" onClick={() => (callback(false), setShow(false))}>No</Button>
        </Modal.Footer>
      </Modal>
    );
  }
  async function ask(question) {
    return new Promise((resolve) => {
      setMsg(question);
      setCallback(() => resolve);
      setShow(true);
    });
  }

  return {
    Ask, ask,
  };
}

export type Ask= ReturnType<typeof useAsk>['ask'];
