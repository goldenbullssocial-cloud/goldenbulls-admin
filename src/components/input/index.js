import React from "react";
import styles from "./input.module.scss";
import classNames from "classnames";
export default function Input({
  label,
  placeholder,
  smallInput,
  icon,
  text,
  bglight,
  leftSpaceRemove,
  type = "text",
  error,
  onIconClick,
  inputRef,
  ...rest
}) {
  return (
    <div
      className={classNames(styles.input, smallInput ? styles.inputChange : "")}
    >
      <label>{label}</label>
      <div
        className={classNames(
          styles.relativeInput,
          text ? styles.inputRight : "",
          bglight ? styles.inputbgChange : "",
          leftSpaceRemove ? styles.leftSpacingRemove : "",
        )}
      >
        <input type={type} placeholder={placeholder} ref={inputRef} {...rest} />
        {icon && (
          <div
            className={styles.iconAlignment}
            onClick={onIconClick}
            style={{ cursor: onIconClick ? "pointer" : "default" }}
          >
            <img src={icon} alt={icon} />
          </div>
        )}
        {text && (
          <div className={styles.text}>
            <span>{text}</span>
          </div>
        )}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
