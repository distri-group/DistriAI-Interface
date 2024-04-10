import React from "react";

export const Button = (props) => {
  return (
    <button
      className={`wallet-adapter-button ${props.className || ""}`}
      disabled={props.disabled}
      style={props.style}
      onClick={props.onClick}
      tabIndex={props.tabIndex || 0}
      type="button">
      {props.startIcon && (
        <i className="wallet-adapter-button-start-icon">{props.startIcon}</i>
      )}
      {props.children}
      {props.endIcon && (
        <i className="wallet-adapter-button-end-icon">{props.endIcon}</i>
      )}
    </button>
  );
};
