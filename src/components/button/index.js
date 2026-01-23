import React from 'react'
import styles from './button.module.scss';
import classNames from 'classnames';
export default function Button({
  text,
  className,
  icon,
  text,
  className,
  icon,
  onClick,
  type,
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
        {text}
        {icon && <img src={icon} altl={icon} />}
      </button>
    </div>
  );
}
