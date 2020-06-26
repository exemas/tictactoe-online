import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faGithub,
  faReact,
  faNodeJs,
} from "@fortawesome/free-brands-svg-icons";

function Footer() {
  return (
    <div
      style={{
        color: "white",
        height: "150px",
        textAlign: "center",
        textShadow: "1px 1px 3px #333333",
      }}
    >
      <p>
        Desarrollado con{" "}
        <span>
          <img src="./img/corazon.png" alt="" height="20px" />
        </span>{" "}
        por Exequiel Schvartz. Powered by{" "}
        <FontAwesomeIcon icon={faReact} style={{ fontSize: "20px" }} /> &{" "}
        <FontAwesomeIcon icon={faNodeJs} style={{ fontSize: "20px" }} />.
      </p>
      <p>
        <a
          href="https://linkedin.com/in/exequielschvartz"
          target="_blank"
          style={{ color: "white" }}
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faLinkedin} size="2x" />
        </a>
        {"  "}
        <a
          href="https://github.com/exemas/tictactoe-online"
          target="_blank"
          style={{ color: "white" }}
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faGithub} size="2x" />
        </a>
      </p>
    </div>
  );
}

export default Footer;
