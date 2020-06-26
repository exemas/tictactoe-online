import React from "react";

function Footer() {
  return (
    <div
      style={{
        color: "white",
        height: "100px",
        textAlign: "center",
        textShadow: "1px 1px 3px #333333",
      }}
    >
      <p>
        Desarrollado con{" "}
        <span>
          <img src="./img/corazon.png" alt="" height="20px" />
        </span>{" "}
        por Exequiel Schvartz
      </p>
    </div>
  );
}

export default Footer;
