import React from "react";
import "./styles.css";

function Button({ blue, text, onClick, disabled }) {
  return (
    <div
      className={blue ? "btn btn-blue" : "btn"}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </div>
  );
}

export default Button;
