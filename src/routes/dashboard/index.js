import React from 'react'
import PerformanceOverview from './performanceOverview'
import MonthlyBreakdown from './monthlyBreakdown'

export default function Dashboard() {
  return (
    <div>
      <PerformanceOverview />
      <MonthlyBreakdown />
    </div>
  )
}
