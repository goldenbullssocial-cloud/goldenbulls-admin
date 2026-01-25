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
import { getRevenueBreakdownData } from "@/api/dashboard";
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

const buildMonthlyRevenue = (payload) => {
  const map = {};

  // Initialize all MONTHS with 0 values
  MONTHS.forEach((month, index) => {
    map[index] = {
      month: month,
      total: month === "" ? null : 0,
      course: 0,
      algo: 0,
      telegram: 0,
    };
  });

  payload?.courses?.records?.forEach((r) => {
    const d = new Date(r.createdAt);
    const monthIndex = d.getMonth() + 1;

    if (monthIndex > 0 && monthIndex < MONTHS.length - 1) {
      map[monthIndex].course += r.actualAmount;
      map[monthIndex].total += r.actualAmount;
    }
  });

  return Object.values(map);
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const d = payload[0].payload;

  return (
    <div
      style={{
        position: "relative",
        background: "rgba(26,32,44,0.95)",
        border: "1px solid #4A5568",
        borderRadius: 24,
        padding: "4px",
        color: "#E2E8F0",
        minWidth: 220,
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
        {[
          ["Total Revenue", d.total],
          ["Course Sales", d.course],
          ["Algobot Sales", d.algo],
          ["Telegram Sales", d.telegram],
        ].map(([k, v]) => (
          <div
            key={k}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 16,
              fontWeight: 500,
              marginTop: 6,
            }}
          >
            <span>{k}</span>
            <span>${v.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function RevenueByMonth() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const load = async () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 11);

      const res = await getRevenueBreakdownData(
        start.toISOString().split("T")[0],
        end.toISOString().split("T")[0],
      );

      if (res?.payload) {
        setData(buildMonthlyRevenue(res.payload));
      }
    };

    load();
  }, []);

  const yTicks = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550];

  return (
    <div className={styles.revenueContainer}>
      <ResponsiveContainer width="100%">
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

          <CartesianGrid stroke="#1F2937" strokeDasharray="4 6" />

          <XAxis
            dataKey="month"
            ticks={MONTHS}
            interval={0}
            tick={{ fill: "#9CA3AF" }}
            axisLine={{ stroke: "#4B5563" }}
            tickLine={false}
            label={{
              value: "Revenue by Month",
              position: "insideCenter",
              dy: 30,
              style: { fill: "#fff", fontSize: 24, fontWeight: 500 },
            }}
          />

          <YAxis
            ticks={yTicks}
            domain={[0, 550]}
            tick={{ fill: "#9CA3AF" }}
            axisLine={{ stroke: "#4B5563" }}
            tickLine={false}
            tickFormatter={(v) => (v === 0 ? "" : `$${v}`)}
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
                    transform: `translate(${x-110}px, ${y + 20}px)`, 
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
            type="monotone"
            dataKey="total"
            stroke="#FFD700"
            strokeWidth={2.5}
            fill="url(#goldFill)"
            dot={{ r: 5, fill: "#FFD700" }}
            activeDot={{ r: 7 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
