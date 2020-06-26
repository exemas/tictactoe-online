import React, { useState, useEffect } from "react";
import { Card, Col, Row, Badge } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import io from "socket.io-client";
import { useAlert } from "react-alert";

import styles from "./Join.module.css";

let socket;
function Join() {
  const alert = useAlert();
  const [room, setRoom] = useState([
    Math.floor(Math.random() * (9999 - 1000)) + 1000,
  ]);
  const [name, setName] = useState(
    `Jugador${[Math.floor(Math.random() * (99999 - 1000)) + 1000]}`
  );
  const [roomJoin, setRoomJoin] = useState("");
  const [canContinueJoin, setcanContinueJoin] = useState(false);
  const [canContinueCreate, setcanContinueCreate] = useState(false);
  const [roomsAvailable, setRoomsAvailable] = useState([]);

  let avatars = require("../avatars.json");
  const [picture, setPicture] = useState(0);

  const changeAvatar = () => {
    let avatarIndex = picture;
    avatarIndex = avatarIndex < avatars.length - 1 ? ++avatarIndex : 0;
    setPicture(avatarIndex);
  };

  useEffect(() => {
    socket = io("localhost:5000");
    socket.emit("getRoomsAvailable", null, (callback) => {
      if (callback) {
        setRoomsAvailable(callback);
      }
    });
    return () => {
      socket.close();
    };
  }, []);

  const joinRoom = () => {
    socket.emit("getRoom", roomJoin, (callback) => {
      if (callback) {
        if (typeof callback === "object") {
          alert.error(callback.error);
        } else {
          setcanContinueJoin(true);
        }
      }
    });
  };

  const createRoom = () => {
    socket.emit("getRoom", room, (callback) => {
      if (callback) {
        if (typeof callback === "object") {
          setcanContinueCreate(true);
        } else {
          alert.error(`La sala ${room} ya existe.`);
        }
      }
    });
  };

  useEffect(() => {
    socket.on("roomsAvailable", (roomData) => {
      setRoomsAvailable(roomData);
    });
  });

  return (
    <div>
      <Card className={`mb-3 ${styles.outerCardContainer}`}>
        <Card.Body>
          <h3 className={styles.title}>Ingresar</h3>
          <Row>
            <Col>
              <div className="form-inline d-flex justify-content-center my-2">
                <div className="form-group">
                  <label htmlFor="nickname">Apodo&emsp;</label>
                  <input
                    id="nickname"
                    value={name}
                    type="text"
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Apodo"
                    className="form-control my-1 mr-2"
                  />
                </div>
                <img
                  src={avatars[picture.toString()]}
                  alt=""
                  height="70px"
                  className={styles.imgProfile}
                  onClick={changeAvatar}
                />
              </div>
            </Col>
          </Row>
          <hr />
          <Row className="mb-4">
            <Col md="8" sm="12">
              <label htmlFor="create-room">Crear una Sala</label>
              <input
                id="create-room"
                type="number"
                placeholder="ID de la Sala"
                value={room}
                onChange={(event) => setRoom(event.target.value)}
                className="form-control my-1"
              />
            </Col>
            <Col md="4" sm="12">
              {/*<Link
                to={`/game?room=${room}&name=${name}&img=${picture}`}
                className={styles.noLink}
              >*/}
              <div
                className={`btn btn-secondary ${styles.btnFull}`}
                onClick={createRoom}
              >
                Crear Sala
              </div>
              {/*</Link>*/}
            </Col>
          </Row>
          <hr />
          <Row className="mb-4">
            <Col md="8" sm="12">
              <label htmlFor="join-room">Ingresar a una Sala</label>
              <input
                id="join-room"
                type="number"
                placeholder="ID de la Sala"
                onChange={(event) => setRoomJoin(event.target.value)}
                className="form-control my-1"
              />
            </Col>
            <Col md="4" sm="12">
              <div
                className={`btn btn-secondary ${styles.btnFull}`}
                onClick={joinRoom}
              >
                Ingresar
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <label>Salas disponibles: </label>
            </Col>
          </Row>
          <Row>
            <Col xs="12">
              {roomsAvailable.map((value, index) => {
                return (
                  <LinkContainer
                    to={`/game?room=${value}&name=${name}&img=${picture}`}
                    key={index}
                  >
                    <Badge pill variant="primary" className={styles.badge}>
                      {value}
                    </Badge>
                  </LinkContainer>
                );
              })}
            </Col>
          </Row>
        </Card.Body>
      </Card>
      {canContinueJoin ? (
        <Redirect to={`/game?room=${roomJoin}&name=${name}&img=${picture}`} />
      ) : null}
      {canContinueCreate ? (
        <Redirect to={`/game?room=${room}&name=${name}&img=${picture}`} />
      ) : null}
    </div>
  );
}

export default Join;
