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

const MONTHS = [
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
];

const buildMonthlyRevenue = (payload) => {
  const map = {};

  payload?.courses?.records?.forEach((r) => {
    const d = new Date(r.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;

    if (!map[key]) {
      map[key] = {
        month: MONTHS[d.getMonth()],
        total: 0,
        course: 0,
        algo: 0,
        telegram: 0,
      };
    }

    map[key].course += r.actualAmount;
    map[key].total += r.actualAmount;
  });

  return Object.values(map);
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const d = payload[0].payload;

  return (
    <div
      style={{
        background: "rgba(26,32,44,0.95)",
        border: "1px solid #4A5568",
        borderRadius: 14,
        padding: "14px 16px",
        color: "#E2E8F0",
        minWidth: 220,
      }}
    >
      <div
        style={{
          background: "linear-gradient(90deg,#F6E05E,#ECC94B)",
          color: "#1A202C",
          fontWeight: 700,
          padding: "6px 12px",
          borderRadius: 10,
          textAlign: "center",
          marginBottom: 10,
        }}
      >
        {label} 2026
      </div>

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
            fontSize: 13,
            marginTop: 6,
          }}
        >
          <span>{k}</span>
          <span>${v.toLocaleString()}</span>
        </div>
      ))}
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

  return (
    <div
      style={{
        background: "#0F172A",
        borderRadius: 18,
        padding: 20,
        height: 380,
      }}
    >
      <h3
        style={{
          color: "#E5E7EB",
          marginBottom: 16,
          fontSize: 18,
        }}
      >
        Revenue by Month
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 10 }}>
          <defs>
            <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFD700" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#FFD700" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#1F2937" strokeDasharray="4 6" />

          <XAxis
            dataKey="month"
            tick={{ fill: "#9CA3AF" }}
            axisLine={{ stroke: "#4B5563" }}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: "#9CA3AF" }}
            axisLine={{ stroke: "#4B5563" }}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
          />

          <Tooltip content={<CustomTooltip />} />

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
