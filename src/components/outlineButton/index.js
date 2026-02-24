import React from "react";
import styles from "./outlineButton.module.scss";
import classNames from "classnames";
export default function OutlineButton({ text, className, icon, onClick }) {
  return (
    <div
      className={classNames(
        styles.outlineButton,
        className,
        icon ? styles.buttonIconAlignment : "",
      )}
    >
      <button aria-label={text} onClick={onClick}>
        <span>{text}</span>
        {icon && <img src={icon} alt={icon} />}
      </button>
    </div>
  );
}
