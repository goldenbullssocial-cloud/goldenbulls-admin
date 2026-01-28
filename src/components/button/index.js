import React from "react";
import styles from "./button.module.scss";
import classNames from "classnames";
export default function Button({
  text,
  className,
  icon,
  onClick,
  type = "button",
  rightIcon,
}) {
  return (
    <div
      className={classNames(
        styles.button,
        className,
        icon ? styles.buttonIconAlignment : "",
      )}
    >
      <button aria-label={text} onClick={onClick} type={type}>
        {icon && rightIcon && <img src={icon} alt={icon} />}

        {text}
        {icon && !rightIcon && <img src={icon} alt={icon} />}
      </button>
    </div>
  );
}
