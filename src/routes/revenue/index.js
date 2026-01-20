import React from 'react'
import styles from './revenue.module.scss';
import CourseSales from './courseSales';
export default function Revenue() {
    return (
        <div className={styles.revenuePageAlignment}>
            <div className={styles.tabCenter}>
                <div className={styles.tabGroup}>
                    <button className={styles.active}>
                        <span>Course Sales</span>
                    </button>
                    <button>
                        <span>Algobot Sales</span>
                    </button>
                    <button>
                        <span>Telegram Sales</span>
                    </button>
                </div>
            </div>
            <CourseSales />
        </div>
    )
}
