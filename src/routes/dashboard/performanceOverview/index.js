"use client";
import React, { useLayoutEffect, useState } from "react";
import styles from "./performanceOverview.module.scss";
import { useRouter } from "next/navigation";
import {
  getDashboardReportData,
  getRevenueBreakdownData,
  getTotalRevenueData,
} from "@/api/dashboard";
import MonthlyBreakdown from "../monthlyBreakdown";
import CommonLoader from "@/components/commonLoader";

const MoneyIcon = "/assets/icons/money.svg";
const UsersIcon = "/assets/icons/people.svg";
const courseIcon = "/assets/icons/course.svg";
const BotIcon = "/assets/icons/bot.svg";
const TelegramIcon = "/assets/icons/telegram.svg";
const getDateRange = (period) => {
  const endDate = new Date();
  const startDate = new Date();

  switch (period) {
    case "weekly":
      startDate.setDate(endDate.getDate() - 7);
      break;
    case "monthly":
      startDate.setMonth(endDate.getMonth() - 1);
      break;
    case "yearly":
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    default:
      startDate.setDate(endDate.getDate() - 7);
  }

  return {
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
  };
};

export default function PerformanceOverview() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [totalRevenueData, setTotalRevenueData] = useState([]);
  const [dashboardReportData, setDashboardReportData] = useState([]);
  const [revenueBreakdownData, setRevenueBreakdownData] = useState({});
  const [activeTab, setActiveTab] = useState("weekly");
  const [isLoading, setIsLoading] = useState(true);
  const [isRevenueLoading, setIsRevenueLoading] = useState(true);
  const [isReportLoading, setIsReportLoading] = useState(true);

  const fetchRevenueBreakdown = async (period) => {
    setIsLoading(true);
    const { startDate, endDate } = getDateRange(period);
    try {
      const data = await getRevenueBreakdownData(startDate, endDate);
      setRevenueBreakdownData((prev) => ({
        ...prev,
        [period]: data?.payload || [],
      }));
    } catch (error) {
      console.error("Error fetching revenue breakdown:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useLayoutEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/");
    } else {
      setChecked(true);
    }

    const fetchTotalRevenue = async () => {
      try {
        setIsRevenueLoading(true);
        const data = await getTotalRevenueData();
        setTotalRevenueData(data?.payload);
      } catch (error) {
        console.error("Error fetching total revenue:", error);
      } finally {
        setIsRevenueLoading(false);
      }
    };

    const fetchDashboardReport = async () => {
      try {
        setIsReportLoading(true);
        const data = await getDashboardReportData();
        setDashboardReportData(data?.payload);
      } catch (error) {
        console.error("Error fetching dashboard report:", error);
      } finally {
        setIsReportLoading(false);
      }
    };

    fetchTotalRevenue();
    fetchDashboardReport();

    // Initial fetch for the default tab
    fetchRevenueBreakdown("weekly");
  }, []);

  const handleTabChange = (value) => {
    setActiveTab(value);
    if (!revenueBreakdownData[value]) {
      fetchRevenueBreakdown(value);
    }
  };

  const isLoadingStats = isRevenueLoading || isReportLoading;

  const stats = [
    {
      title: "Active Users",
      value: isLoadingStats
        ? "Loading..."
        : dashboardReportData?.activeUsers?.count || "0",
      change: isLoadingStats
        ? "..."
        : `${dashboardReportData?.activeUsers?.percent || "0"}`,
      icon: UsersIcon,
    },
    {
      title: "Total Revenue",
      value: isLoadingStats
        ? "Loading..."
        : totalRevenueData?.totalRevenue || "0",
      change: isLoadingStats
        ? "..."
        : `${totalRevenueData?.revenueChange?.percent || "0"}`,
      icon: MoneyIcon,
    },
    {
      title: "Course Sales",
      value: isLoadingStats
        ? "Loading..."
        : dashboardReportData?.courseSales?.count || "0",
      change: isLoadingStats
        ? "..."
        : `${dashboardReportData?.courseSales?.percent || "0"}`,
      icon: courseIcon,
    },
    {
      title: "AlgoBot Sales",
      value: isLoadingStats
        ? "Loading..."
        : dashboardReportData?.algoBotSales?.count || "0",
      change: isLoadingStats
        ? "..."
        : `${dashboardReportData?.algoBotSales?.percent || "0"}`,
      icon: BotIcon,
    },
    {
      title: "Telegram Sales",
      value: isLoadingStats
        ? "Loading..."
        : dashboardReportData?.telegramSales?.count || "0",
      change: isLoadingStats
        ? "..."
        : `${dashboardReportData?.telegramSales?.percent || "0"}`,
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
        {isLoadingStats ? (
          <CommonLoader />
        ) : (
          stats?.map((stat, i) => {
            return (
              <div key={i} className={styles.griditems}>
                <div className={styles.textstyle}>
                  <p>{stat?.title}</p>
                  <span>{stat?.value}</span>
                </div>
                <div className={styles.icons}>
                  <img src={stat?.icon} alt={stat?.title} />
                </div>
              </div>
            );
          })
        )}
      </div>
      <MonthlyBreakdown />
    </div>
  );
}
