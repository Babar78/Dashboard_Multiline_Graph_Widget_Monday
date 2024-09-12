import React from "react";
import style from "./Loader.module.css";

const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <div className={style.loader}></div>
    </div>
  );
};

export default Loader;
