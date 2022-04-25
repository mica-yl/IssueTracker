import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function useAlert() {
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState('');
  const [callback, setCallback] = useState(() => (_) => 0);
  // const [result,setResult]=useState();
  function AlertMsg(props) {
    return (
      <Modal show={show} backdrop="static" {...props}>
        <Modal.Header />
        <Modal.Body>{msg}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => (callback(true), setShow(false))}>Ok</Button>
        </Modal.Footer>
      </Modal>
    );
  }
  async function alertAsync(message:string):Promise<true> {
    return new Promise((resolve) => {
      setMsg(message);
      setCallback(() => resolve);
      setShow(true);
    });
  }

  return {
    AlertMsg, alertAsync,
  };
}
