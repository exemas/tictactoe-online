import React from "react";
import styles from "./Square.module.css";

function Square(props) {
  return (
    <div id={props.id} className={styles.square} onClick={props.handleClick}>
      {props.value}
    </div>
  );
}

export default Square;
