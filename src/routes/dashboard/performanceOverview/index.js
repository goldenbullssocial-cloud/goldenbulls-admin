"use client";
import React, { useLayoutEffect, useState } from "react";
import styles from "./performanceOverview.module.scss";
import { useRouter } from "next/navigation";
import { getDashboardReportData, getTotalRevenueData } from "@/api/dashboard";
import MonthlyBreakdown from "../monthlyBreakdown";

const MoneyIcon = "/assets/icons/money.svg";
const UsersIcon = "/assets/icons/people.svg";
const courseIcon = "/assets/icons/course.svg";
const BotIcon = "/assets/icons/bot.svg";
const TelegramIcon = "/assets/icons/telegram.svg";
export default function PerformanceOverview() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [totalRevenueData, setTotalRevenueData] = useState([]);
  const [dashboardReportData, setDashboardReportData] = useState([]);
  const [revenueBreakdownData, setRevenueBreakdownData] = useState({});
  const [activeTab, setActiveTab] = useState("weekly");
  const [isLoading, setIsLoading] = useState(true);

  const fetchRevenueBreakdown = async (period) => {
    setIsLoading(true);
    const { startDate, endDate } = getDateRange(period);
    const data = await getRevenueBreakdownData(startDate, endDate);
    setRevenueBreakdownData((prev) => ({
      ...prev,
      [period]: data?.payload || [],
    }));
    setIsLoading(false);
  };

  useLayoutEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/");
    } else {
      setChecked(true);
    }

    getTotalRevenueData().then((data) => {
      setTotalRevenueData(data?.payload);
    });

    getDashboardReportData().then((data) => {
      setDashboardReportData(data?.payload);
    });

    // Initial fetch for the default tab
    fetchRevenueBreakdown("weekly");
  }, []);

  const handleTabChange = (value) => {
    setActiveTab(value);
    if (!revenueBreakdownData[value]) {
      fetchRevenueBreakdown(value);
    }
  };

  const stats = [
      {
        title: "Active Users",
        value: dashboardReportData?.activeUsers?.count,
        change: `${dashboardReportData?.activeUsers?.percent}`,
        icon: UsersIcon,
      },
    {
      title: "Total Revenue",
      value: totalRevenueData?.totalRevenue,
      change: `${totalRevenueData?.revenueChange?.percent}`,
      icon: MoneyIcon,
    },
    {
      title: "Course Sales",
      value: dashboardReportData?.courseSales?.count,
      change: `${dashboardReportData?.courseSales?.percent}`,
      icon: courseIcon,
    },
    {
      title: "AlgoBot Sales",
      value: dashboardReportData?.algoBotSales?.count,
      change: `${dashboardReportData?.algoBotSales?.percent}`,
      icon: BotIcon,
    },
     {
      title: "Telegram Sales",
      value: dashboardReportData?.telegramSales?.count,
      change: `${dashboardReportData?.telegramSales?.percent}`,
      icon: TelegramIcon,
    },
  ];

  if (!checked) {
    // Skip rendering until token is verified
    return null;
  }
  return (
    <div className={styles.performanceOverview}>
      <div className={styles.title}>
        <h2>performance overview</h2>
      </div>
      <div className={styles.grid}>
        {stats.map((stat) => {
          return (
            <div className={styles.griditems}>
              <div className={styles.textstyle}>
                <p>{stat.title}</p>
                <span>{stat.value}</span>
              </div>
              <div className={styles.icons}>
                <img src={stat.icon} alt="MoneyIcon" />
              </div>
            </div>
          );
        })}
      </div>
      <MonthlyBreakdown />


    </div>
  );
}
