import React from 'react'
import styles from './textarea.module.scss';
export default function Textarea({ label, placeholder, name, value, onChange, rows }) {
    return (
        <div className={styles.textarea}>
            <label>{label}</label>
            <textarea placeholder={placeholder} name={name} value={value} onChange={onChange} rows={rows}></textarea>
        </div>
    )
}
