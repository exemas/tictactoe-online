import React, { useState, useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Redirect } from "react-router";
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
let newgame = false;

function Board({ location }) {
  const alert = useAlert();
  const [show, setShow] = useState(false);
  const [modal, setModal] = useState([]);
  const [leave, setLeave] = useState(false);

  const [room, setRoom] = useState("");
  const [myStats, setMyStats] = useState({});
  const [oponentStats, setOponentStats] = useState([]);
  const [currentRoom, setCurrentRoom] = useState([]);

  const [errorMsg, setErrorMsg] = useState("");
  const [score, setScore] = useState([0, 0]);
  const [fullRoom, setFullRoom] = useState(false);
  const [turn, setTurn] = useState("");
  const [squares, setSquares] = useStateWithCallback(
    Array(9).fill(null),
    () => {
      if (socket && clicked) {
        socket.emit("nextTurn", { room, squares });
        clicked = false; //evita loop
      }
      if (socket && newgame) {
        socket.emit("newGame", { room, squares });
        newgame = false; //evita loop
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
          setErrorMsg(callback); //Si hubo un error.
        } else {
          setMyStats({
            id: callback.id,
            name: callback.name,
            room: callback.room,
            player: callback.player,
            type: callback.type,
          });
          if (callback.currentRoom.length === 2) {
            setOponentStats({
              id: callback.currentRoom[0].id,
              name: callback.currentRoom[0].name,
              room: callback.currentRoom[0].room,
              player: callback.currentRoom[0].player,
              type: callback.currentRoom[0].type,
            });
          }
          setRoom(callback.room);
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
  }, [currentRoom, room]);

  useEffect(() => {
    socket.on("roomData", (roomData) => {
      if (roomData) {
        if (roomData.currentRoom.length > 1) {
          const oponent = myStats.id === roomData.currentRoom[0].id ? 1 : 0;

          setOponentStats({
            id: roomData.currentRoom[oponent].id,
            name: roomData.currentRoom[oponent].name,
            room: roomData.currentRoom[oponent].room,
            player: roomData.currentRoom[oponent].player,
            type: roomData.currentRoom[oponent].type,
          });
        }
        setCurrentRoom(roomData.currentRoom);
      }
    });
  }, [myStats, currentRoom]);

  useEffect(() => {
    socket.on("leave", () => {
      alert.error("El oponente abandonó. Se ha cerrado la sala.");
      setLeave(true);
    });
  }, [alert]);

  useEffect(() => {
    socket.on("sendTurn", (sendTurn) => {
      if (sendTurn) {
        setTurn(sendTurn);
      }
    });
    return () => socket.close();
  }, []);

  useEffect(() => {
    socket.on("sendSquares", (squares) => {
      setSquares(squares);
      const win = calculateWinner(squares);
      if (win) {
        var player1Score = score[0];
        var player2Score = score[1];
        if (win === "X") {
          player1Score += 1;
        } else {
          player2Score += 1;
        }
        setScore([player1Score, player2Score]);
        setShow(true);
        const winnerName =
          win === myStats.type ? myStats.name : oponentStats.name;
        setModal([1, `Ganó ${winnerName}!`, winnerName]);
      } else {
        const emptySquares = squares.filter((square) => square === null).length;
        if (emptySquares === 0) {
          setShow(true);
          setModal([1, "Empate!", "Empate"]);
        }
      }
    });
  }, [score, setSquares, myStats, oponentStats, alert]);

  const leaveRoom = () => {
    socket.emit("leaveRoom");
    alert.success("Se ha abandonado la sala.");
    setLeave(true);
  };

  const handleClick = (event) => {
    if (myStats.id === turn && squares[event.target.id] === null) {
      const newSquares = squares.slice();
      newSquares[event.target.id] = myStats.type;
      clicked = true; //para evitar el loop
      setSquares(newSquares);
    }
  };

  const newGame = () => {
    newgame = true;
    setSquares(Array(9).fill(null));
    setShow(false);
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
          <p className="text-center">{errorMsg}</p>
          <Row>
            <Col className="d-flex justify-content-center">
              <div className={styles.rowContainer}>
                <div className={styles.row}>
                  <Square id="0" value={squares[0]} handleClick={handleClick} />
                  <Square id="1" value={squares[1]} handleClick={handleClick} />
                  <Square id="2" value={squares[2]} handleClick={handleClick} />
                </div>
                <div className={styles.row}>
                  <Square id="3" value={squares[3]} handleClick={handleClick} />
                  <Square id="4" value={squares[4]} handleClick={handleClick} />
                  <Square id="5" value={squares[5]} handleClick={handleClick} />
                </div>
                <div className={styles.row}>
                  <Square id="6" value={squares[6]} handleClick={handleClick} />
                  <Square id="7" value={squares[7]} handleClick={handleClick} />
                  <Square id="8" value={squares[8]} handleClick={handleClick} />
                </div>
              </div>
            </Col>
          </Row>
          <hr />
          <p className="btn btn-secondary" onClick={leaveRoom}>
            Abandonar
          </p>
        </Card.Body>
        <Card.Footer>
          {errorMsg === "" ? (
            <InfoBar
              currentRoom={currentRoom}
              score={score}
              yourID={myStats.id}
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
          button2="Continuar"
          action2={newGame}
          button1="Abandonar"
          action1={leaveRoom}
          image={
            modal[2] !== "Empate"
              ? modal[2] === myStats.name
                ? "./img/winner.gif"
                : "./img/loser.gif"
              : "./img/tie.gif"
          }
        />
      ) : null}
      <p stlye={{ display: "none" }}>{fullRoom}</p>
    </div>
  );
}

export default Board;
