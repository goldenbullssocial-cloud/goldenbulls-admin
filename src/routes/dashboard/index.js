import React from 'react'
import PerformanceOverview from './performanceOverview'
import styles from './dashboard.module.scss'

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <PerformanceOverview />
    </div>
  )
}
