"use client";
import React from "react";
import styles from "./monthlyBreakdown.module.scss";
import RevenuebyMonth from "@/components/dashboard/RevenuebyMonth";
import ActiveUsersbyMonth from "@/components/dashboard/ActiveUsersbyMonth";
export default function MonthlyBreakdown() {
  return (
    <div className={styles.monthlyBreakdown}>
      <div className={styles.title}>
        <h2>Monthly Breakdown</h2>
      </div>
      <div className={styles.dashboardContainer}>
        <div className={styles.chartRow}>
          <div className={styles.chartColumn}>
            <RevenuebyMonth />
          </div>
          <div className={styles.chartColumn}>
            <ActiveUsersbyMonth />
          </div>
        </div>
      </div>
    </div>
  );
}
