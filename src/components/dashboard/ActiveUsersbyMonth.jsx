"use client";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getUserSignupReport } from "@/api/dashboard";
import styles from "./dashboard.module.scss";

// Add this for debugging
const CustomizedAxisTick = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#94A3B8"
        transform="rotate(-45)"
      >
        {payload.value}
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        backgroundColor: "rgba(26, 32, 44, 0.95)",
        border: "1px solid #4A5568",
        borderRadius: "6px",
        padding: "12px",
        color: "#E2E8F0",
      }}
    >
      <div
        style={{
          color: "#E2E8F0",
          fontWeight: "600",
          marginBottom: "8px",
          fontSize: "14px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: "#A0AEC0",
          fontSize: "13px",
        }}
      >
        <span>Active Users: </span>
        <strong>{payload[0].value}</strong>
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
          const formattedData = result.payload.map((item, index) => ({
            name: item.day || `Day ${index + 1}`,
            users: item.userCount || 0,
          }));
          setData(formattedData);
        } else {
          // Create sample data for testing
          const sampleData = Array.from({ length: 12 }, (_, i) => ({
            name: `Month ${i + 1}`,
            users: Math.floor(Math.random() * 1000) + 500,
          }));
          setData(sampleData);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message);
        // Create sample data in case of error
        const sampleData = Array.from({ length: 12 }, (_, i) => ({
          name: `Month ${i + 1}`,
          users: Math.floor(Math.random() * 1000) + 500,
        }));
        setData(sampleData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "20px", color: "#E2E8F0" }}>
        Loading user data...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", color: "#F56565" }}>
        Error: {error}. Showing sample data.
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#1A202C",
        borderRadius: "12px",
        padding: "20px",
        height: "400px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3
        style={{
          color: "#E2E8F0",
          marginBottom: "20px",
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        Active Users by Month
      </h3>

      <div style={{ flex: 1, minHeight: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#2D3748"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={<CustomizedAxisTick />}
              interval={0}
              height={60}
              axisLine={{ stroke: "#4A5568" }}
              tickLine={false}
            />
            <YAxis
              axisLine={{ stroke: "#4A5568" }}
              tickLine={false}
              tick={{ fill: "#94A3B8" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="stepAfter"
              dataKey="users"
              stroke="#FFD700"
              strokeWidth={2.5}
              dot={{ r: 6, fill: "#FFD700" }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActiveUsersbyMonth;
