import React from 'react'
import styles from './textarea.module.scss';
export default function Textarea({ label, placeholder }) {
    return (
        <div className={styles.textarea}>
            <label>{label}</label>
            <textarea placeholder={placeholder}></textarea>
        </div>
    )
}
