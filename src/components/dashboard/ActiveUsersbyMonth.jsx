"use client";
import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getUserSignupReport } from "@/api/dashboard";
import styles from "./dashboard.module.scss";
const MONTHS = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const d = payload[0].payload;
  const hasUsers = d?.userDetails?.length > 0;

  return (
    <div
      style={{
        position: "relative",
        background: "rgba(26,32,44,0.95)",
        border: "1px solid #4A5568",
        borderRadius: 24,
        padding: "4px",
        color: "#E2E8F0",
        minWidth: 300,
        maxWidth: 400,
        marginBottom: "10px",
      }}
    >
      {/* Arrow pointing upward */}
      <div
        style={{
          position: "absolute",
          top: "-9px",
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "9px solid transparent",
          borderRight: "9px solid transparent",
          borderBottom: "9px solid #4A5568",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-8px",
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderBottom: "8px solid rgba(26,32,44,0.95)",
        }}
      />
      <div
        style={{
          background:
            "linear-gradient(90deg, #F9F490 0%, #E4AB40 25.48%, #FEFBA5 75%, #BD894E 100%)",
          color: "#1A202C",
          fontWeight: 700,
          padding: "6px 12px",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderBottomLeftRadius: 6,
          borderBottomRightRadius: 6,
          textAlign: "center",
        }}
      >
        {label} 2026
      </div>
      <div style={{ padding: "12px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 16,
            fontWeight: 500,
            marginBottom: hasUsers ? 10 : 0,
          }}
        >
          <span>Active Users</span>
          <span>{d?.users?.toLocaleString() || 0}</span>
        </div>
        {hasUsers && (
          <div style={{ fontSize: 12, color: "#A0AEC0" }}>
            {d?.userDetails?.slice(0, 3).map((user, idx) => (
              <div key={idx} style={{ marginBottom: 2 }}>
                {user.name || user.email}
              </div>
            ))}
            {d?.userDetails?.length > 3 && (
              <div>+{d?.userDetails?.length - 3} more users</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ActiveUsersbyMonth = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getUserSignupReport();

        if (result?.payload) {
          // Process the monthly data from the API
          const monthlyData = MONTHS.map((month, index) => {
            if (month === "") return { month, users: null };

            // Find the corresponding month data from the API response by month name
            const monthData = result.payload.find(
              (item) =>
                item.month === month ||
                (index === 1 && item.month === "January") ||
                (index === 2 && item.month === "February") ||
                (index === 3 && item.month === "March") ||
                (index === 4 && item.month === "April") ||
                (index === 5 && item.month === "May") ||
                (index === 6 && item.month === "June") ||
                (index === 7 && item.month === "July") ||
                (index === 8 && item.month === "August") ||
                (index === 9 && item.month === "September") ||
                (index === 10 && item.month === "October") ||
                (index === 11 && item.month === "November") ||
                (index === 12 && item.month === "December"),
            );

            return {
              month,
              users: monthData?.userCount || 0,
              userDetails: monthData?.users || [],
            };
          });

          setData(monthlyData);
        } else {
          // Fallback to sample data if no payload
          const sampleData = Array.from({ length: 12 }, (_, i) => ({
            month: MONTHS[i + 1], // Skip the first empty string
            users: Math.floor(Math.random() * 10) + 5,
            userDetails: [],
          }));
          setData(sampleData);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message);
        // Create sample data in case of error - all months from Jan to Dec
        const sampleData = Array.from({ length: 14 }, (_, i) => ({
          month: MONTHS[i],
          users:
            MONTHS[i] === "" ? null : Math.floor(Math.random() * 1000) + 500,
        }));
        setData(sampleData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  if (error) {
    return (
      <div style={{ padding: "20px", color: "#F56565" }}>
        Error: {error}. Showing sample data.
      </div>
    );
  }

  return (
    <div className={styles.activeUsersContainer}>
      <div className={styles.activeUsersChart}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 10, bottom: 30 }}
          >
            <defs>
              <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFD700" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#FFD700" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
            <XAxis
              dataKey="month"
              interval={0}
              tick={{ fill: "#9CA3AF" }}
              axisLine={{ stroke: "#4B5563" }}
              tickLine={false}
              label={{
                value: "Active Users by Month",
                position: "insideCenter",
                dy: 30,
                style: { fill: "#fff", fontSize: 24, fontWeight: 500 },
              }}
            />

            <YAxis
              tick={{ fill: "#9CA3AF" }}
              axisLine={{ stroke: "#4B5563" }}
              tickLine={false}
              tickFormatter={(v) => (v === 0 ? "" : ` ${v}`)}
              allowDecimals={false}
            />
            <Tooltip
              cursor={false}
              content={({ active, payload, label, coordinate }) => {
                if (!active || !payload?.length || !coordinate) return null;

                const { x, y } = coordinate;

                return (
                  <div
                    style={{
                      position: "absolute",
                      transform: `translate(${x - 110}px, ${y + 20}px)`,
                      pointerEvents: "none",
                    }}
                  >
                    <CustomTooltip
                      active={active}
                      payload={payload}
                      label={label}
                    />
                  </div>
                );
              }}
            />
            <Area
              type="stepAfter"
              dataKey="users"
              stroke="#FFD700"
              strokeWidth={2.5}
              fill="url(#goldFill)"
              dot={{ r: 6, fill: "#FFD700" }}
              activeDot={{ r: 8 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActiveUsersbyMonth;
