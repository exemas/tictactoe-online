import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";

import styles from "./InfoBar.module.css";

function InfoBar({ currentRoom, score, yourID, turn }) {
  let avatars = require("../avatars.json");
  const [player1, setPlayer1] = useState([]);
  const [player2, setPlayer2] = useState([]);

  useEffect(() => {
    if (typeof currentRoom[0] === "object") {
      const player_1 = Object.values(currentRoom[0]);
      setPlayer1(player_1);
    }
    if (typeof currentRoom[1] === "object") {
      const player_2 = Object.values(currentRoom[1]);
      setPlayer2(player_2);
    } else {
      setPlayer2([null, "Aguardando un jugador...", null, null]);
    }
  }, [currentRoom]);

  const turno = (player) => {
    if (turn === player) {
      if (yourID === player) {
        return <p className={styles.myturn}>Mi turno</p>;
      } else {
        return <p className={styles.waiting}>Esperando...</p>;
      }
    }
  };

  return (
    <Row>
      <Col md="4" xs="6">
        <div className="d-flex flex-column align-items-center mt-3">
          <img src={avatars[player1[2]]} alt="" className={styles.avatar} />
          <p className={styles.title}>{player1[1]}</p>
          {turno(player1[0])}
        </div>
      </Col>
      <Col md={{ order: 1, span: 4 }} xs={{ order: 2, span: 12 }}>
        <p className={styles.scoreBoard}>
          {score[0]}:{score[1]}
        </p>
      </Col>
      <Col md={{ order: 2, span: 4 }} xs={{ order: 1, span: 6 }}>
        <div className="d-flex flex-column align-items-center mt-3">
          <img src={avatars[player2[2]]} alt="" className={styles.avatar} />
          <p className={styles.title}>{player2[1]}</p>
          {turno(player2[0])}
        </div>
      </Col>
    </Row>
  );
}

export default InfoBar;
