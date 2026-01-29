"use client";
import Sidebar from "@/components/sidebar";
import UserHeader from "@/components/userHeader";
import { getSocket } from "@/utils/webSocket";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function layout({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  const socket = getSocket();

  useEffect(() => {
    if (!socket) {
      console.error("Socket not available");
      return;
    }

    const handleConnect = () => {
      socket.emit("check-withdrawal-request", {});
    };

    const handleCheckWithdrawalResponse = (data) => {
      const unread = data?.data || data?.unreadNotification || 0;

      setUnreadCount(() => unread);

      console.log("Updated unread: ", unread, data);
    };

    socket.on("connect", handleConnect);
    socket.on("check-withdrawal-request", handleCheckWithdrawalResponse);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("check-withdrawal-request", handleCheckWithdrawalResponse);
    };
  }, [socket]); // Only depend on socket

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("token");
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [router]);
  return (
    <div className="user-panel-layout">
      <div className="sidebar-panel">
        <Sidebar unreadCount={unreadCount} />
      </div>
      <div className="children-layout">
        {/* <UserHeader /> */}
        {children}
      </div>
    </div>
  );
}
