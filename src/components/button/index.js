import React from "react";
import styles from "./button.module.scss";
import classNames from "classnames";
export default function Button({ text, className, icon, onClick, type }) {
  return (
    <div
      className={classNames(
        styles.button,
        className,
        icon ? styles.buttonIconAlignment : "",
      )}
    >
      <button type={type} aria-label={text} onClick={onClick}>
        {icon && <img src={icon} altl={icon} />}
        {text}
      </button>
    </div>
  );
}
