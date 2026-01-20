import React from 'react'
import styles from './coursesTab.module.scss';
export default function CoursesTab() {
    return (
        <div className={styles.coursesTabCenter}>
            <div className={styles.tabGroup}>
                <button className={styles.active}>
                    <span>Recorded Courses</span>
                </button>
                <button>
                    <span>Live Online Courses</span>
                </button>
                <button>
                    <span>In Person Courses</span>
                </button>
            </div>
        </div>
    )
}
