import React, { useState, useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Link, Redirect } from "react-router";
import queryString from "query-string";
import io from "socket.io-client";
import useStateWithCallback from "use-state-with-callback";
import { useAlert } from "react-alert";

import InfoBar from "../InfoBar/InfoBar";
import Square from "../Square/Square";
import ModalAlert from "../ModalAlert/ModalAlert";

import styles from "./Board.module.css";

let socket;
let clicked = false;

function Board({ location }) {
  const alert = useAlert();
  const [show, setShow] = useState(false);
  const [modal, setModal] = useState([]);
  const [leave, setLeave] = useState(false);
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [yourID, setYourID] = useState("");
  const [currentRoom, setCurrentRoom] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [score, setScore] = useState([0, 0]);
  const [fullRoom, setFullRoom] = useState(false);
  const [step, setStep] = useState(-1);
  const [turn, setTurn] = useState("");
  const [mark, setMark] = useState("");
  const [squares, setSquares] = useStateWithCallback(
    Array(9).fill(null),
    () => {
      if (socket && clicked) {
        socket.emit("nextTurn", { room, squares });
        clicked = false; //evita loop
      }
    }
  );
  useEffect(() => {
    //recupero los valores de la URL.
    const { name, room, img } = queryString.parse(location.search);

    socket = io("localhost:5000");

    socket.emit("join", { name, room, img }, (callback) => {
      if (callback) {
        if (typeof callback === "string") {
          setErrorMsg(callback);
        } else {
          if (yourID === "") {
            setYourID(callback.id);
            setMark(callback.type);
          }
          setRoom(callback.room);
          setStep(callback.roomStep);
          setCurrentRoom(callback.currentRoom);
        }
      }
    });
  }, [location.search]);

  useEffect(() => {
    if (currentRoom.length === 2) {
      setFullRoom(true);
      socket.emit("getTurn", room);
    } else {
      setFullRoom(false);
    }
  }, [currentRoom]);

  useEffect(() => {
    socket.on("roomData", (roomData) => {
      if (roomData) {
        setCurrentRoom(roomData.currentRoom);
        setStep(roomData.roomStep);
      }
    });

    socket.on("sendTurn", (sendTurn) => {
      if (sendTurn) {
        setTurn(sendTurn);
      }
    });

    socket.on("sendSquares", (squares) => {
      setSquares(squares);
      const winner = calculateWinner(squares);

      if (winner) {
        var player1Score = score[0];
        var player2Score = score[1];
        if (winner == "X") {
          player1Score += 1;
        } else {
          player2Score += 1;
        }
        setScore([player1Score, player2Score]);
        setShow(true);
        var winnerName = "";
        console.log([currentRoom[0][name]]);
        /*if (currentRoom[0].type === winner) {
          winnerName = currentRoom[0].name;
        } else {
          winnerName = currentRoom[1].name;
        }*/

        setModal([1, winner]);
      }
    });
  }, [currentRoom]);

  const leaveRoom = () => {
    socket.emit("leaveRoom");
    alert.success("Se ha abandonado la sala.");
    setLeave(true);
  };

  const handleClick = (event) => {
    if (yourID === turn) {
      const newSquares = squares.slice();
      newSquares[event.target.id] = mark;
      clicked = true; //para evitar el loop
      setSquares(newSquares);
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]; //Asignación desestructurante
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  }

  return (
    <div>
      <Card className={`mb-3 ${styles.outerCardContainer}`}>
        <Card.Body>
          {errorMsg}
          {yourID}
          <br />
          {step}
          <br />
          {turn}
          {fullRoom}
          {fullRoom ? (
            <Row>
              <Col className="d-flex justify-content-center">
                <div className={styles.rowContainer}>
                  <div className={styles.row}>
                    <Square
                      id="0"
                      value={squares[0]}
                      handleClick={handleClick}
                    />
                    <Square
                      id="1"
                      value={squares[1]}
                      handleClick={handleClick}
                    />
                    <Square
                      id="2"
                      value={squares[2]}
                      handleClick={handleClick}
                    />
                  </div>
                  <div className={styles.row}>
                    <Square
                      id="3"
                      value={squares[3]}
                      handleClick={handleClick}
                    />
                    <Square
                      id="4"
                      value={squares[4]}
                      handleClick={handleClick}
                    />
                    <Square
                      id="5"
                      value={squares[5]}
                      handleClick={handleClick}
                    />
                  </div>
                  <div className={styles.row}>
                    <Square
                      id="6"
                      value={squares[6]}
                      handleClick={handleClick}
                    />
                    <Square
                      id="7"
                      value={squares[7]}
                      handleClick={handleClick}
                    />
                    <Square
                      id="8"
                      value={squares[8]}
                      handleClick={handleClick}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          ) : null}
          <hr />
          <p className="btn btn-secondary" onClick={leaveRoom}>
            Dejar Sala
          </p>
        </Card.Body>
        <Card.Footer>
          {errorMsg === "" ? (
            <InfoBar
              currentRoom={currentRoom}
              score={score}
              yourID={yourID}
              turn={turn}
            />
          ) : null}
        </Card.Footer>
      </Card>
      {leave ? <Redirect to="/" /> : null}
      {modal[0] === 1 ? (
        <ModalAlert
          show={show}
          handleClose={handleClose}
          title={`${modal[1]}`}
          body={`Ganó la partida`}
          button1="Continuar"
          action1={handleClose}
          button2="Abandonar"
          action2={handleClose}
        />
      ) : null}
    </div>
  );
}

export default Board;
