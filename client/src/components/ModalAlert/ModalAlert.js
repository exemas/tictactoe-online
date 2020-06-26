import React from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";

function ModalAlert(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.handleClose}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col className="d-flex justify-content-center align-items-center">
            <img src={props.image} alt="" width="60%" />
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={props.action1}>
          {props.button1}
        </Button>
        <Button variant="success" onClick={props.action2}>
          {props.button2}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalAlert;
