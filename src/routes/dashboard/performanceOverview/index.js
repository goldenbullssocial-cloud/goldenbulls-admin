import React from 'react'
import styles from './performanceOverview.module.scss';
const MoneyIcon = '/assets/icons/money.svg';
export default function PerformanceOverview() {
    return (
        <div className={styles.performanceOverview}>
            <div className={styles.title}>
                <h2>
                    performance overview
                </h2>
            </div>
            <div className={styles.grid}>
                {
                    [...Array(5)].map(() => {
                        return (
                            <div className={styles.griditems}>
                                <div className={styles.textstyle}>
                                    <p>
                                        Active Users
                                    </p>
                                    <span>
                                        1344
                                    </span>
                                </div>
                                <div className={styles.icons}>
                                    <img src={MoneyIcon} alt='MoneyIcon' />
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
