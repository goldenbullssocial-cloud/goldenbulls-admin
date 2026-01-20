import React from 'react'
import styles from './userHeader.module.scss';
import Button from '../button';
export default function UserHeader() {
    return (
        <div className={styles.userHeader}>
            <div className={styles.leftContent}>
                <div className={styles.line}></div>
                <div>
                    <h2>
                        Hello <span>Steve</span>
                    </h2>
                    <p>
                        Keep learning, and grow your understanding of trading step by step.
                    </p>
                </div>
            </div>
            <div className={styles.rightContent}>
                <input type='text' placeholder='Search Courses and Algobots' />
                <Button text="Search" />
            </div>
        </div>
    )
}
