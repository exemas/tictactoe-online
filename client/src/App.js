import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Board from "./components/Board/Board";
import Join from "./components/Join/Join";
import Footer from "./Footer";

import styles from "./App.module.css";

function App() {
  return (
    <BrowserRouter>
      <div className={styles.outerContainer}>
        <div className={styles.innerContainer}>
          <div className="d-flex flex-row justify-content-center align-items-center">
            <img src="./img/logo.png" alt="" height="60px" />
            <h1 className={styles.title}>&nbsp;TaTeTi.io</h1>
          </div>
          <Route path="/" exact component={Join} />
          <Route path="/game" component={Board} />
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
