import React from 'react'
import styles from './outlineButton.module.scss';
import classNames from 'classnames';
export default function OutlineButton({ text, className, icon }) {
    return (
        <div className={classNames(styles.outlineButton, className, icon ? styles.buttonIconAlignment : "")}>
            <button aria-label={text}>
                <span>
                    {text}
                </span>
                {
                    icon && (
                        <img src={icon} altl={icon} />
                    )
                }
            </button>
        </div>
    )
}
