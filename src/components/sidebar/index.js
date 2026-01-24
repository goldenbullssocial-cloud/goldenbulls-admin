"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./sidebar.module.scss";
import LibraryIcon from "@/icons/libraryIcon";
import CoursesIcon from "@/icons/coursesIcon";

import classNames from "classnames";
import DashboardIcon from "@/icons/dashboardIcon";
import UserIcon from "@/icons/userIcon";
import UpIcon from "@/icons/upIcon";
import UsersIcon from "@/icons/usersIcon";
import CentersIcon from "@/icons/centersIcon";
import AlgobotsIcon from "@/icons/algobotsIcon";
import CouponsIcon from "@/icons/couponsIcon";
import RevenueIcon from "@/icons/revenueIcon";
import RequestsIcon from "@/icons/requestsIcon";
import UtilityIcon from "@/icons/utilityIcon";
import YoutubeIcon from "@/icons/youtubeIcon";
const Logo = "/assets/logo/logo.svg";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState({});
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Function to check if a path is active
  const isActive = (path) => {
    if (path === "/") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse user from localStorage", e);
        }
      }
    }
  }, []);
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarlogo}>
        <img src={Logo} alt="Logo" />
      </div>
      <div className={styles.asideBody}>
        <div
          className={classNames(styles.menu, {
            [styles.active]: isActive("/dashboard"),
          })}
          onClick={() => router.push("/dashboard")}
        >
          <DashboardIcon />
          <span>Dashboard</span>
        </div>
        <div
          className={classNames(styles.menu, {
            [styles.active]: isActive("/user"),
          })}
          onClick={() => router.push("/user")}
        >
          <UsersIcon />
          <span>Users</span>
        </div>
        <div
          className={classNames(styles.menu, {
            [styles.active]: isActive("/centers"),
          })}
          onClick={() => router.push("/centers")}
        >
          <CentersIcon />
          <span>Centers</span>
        </div>
        <div
          className={classNames(styles.menu, {
            [styles.active]: isActive("/courses"),
          })}
          onClick={() => router.push("/courses")}
        >
          <CoursesIcon />
          <span>Courses</span>
        </div>
        <div
          className={classNames(styles.menu, {
            [styles.active]: isActive("/algobots"),
          })}
          onClick={() => router.push("/algobots")}
        >
          <AlgobotsIcon />
          <span>Algobots</span>
        </div>
        <div
          className={classNames(styles.menu, {
            [styles.active]: isActive("/coupons"),
          })}
          onClick={() => router.push("/coupons")}
        >
          <CouponsIcon />
          <span>Coupons</span>
        </div>
        <div
          className={classNames(styles.menu, {
            [styles.active]: isActive("/revenue"),
          })}
          onClick={() => router.push("/revenue")}
        >
          <RevenueIcon />
          <span>Revenue</span>
        </div>
        <div
          className={classNames(styles.menu, {
            [styles.active]: isActive("/withdraw-requests"),
          })}
          onClick={() => router.push("/withdraw-requests")}
        >
          <RequestsIcon />
          <span>Requests</span>
        </div>
        <div
          className={classNames(styles.menu, {
            [styles.active]: isActive("/utility"),
          })}
          onClick={() => router.push("/utility")}
        >
          <UtilityIcon />
          <span>Utility</span>
        </div>
        <div
          className={classNames(styles.menu, {
            [styles.active]: isActive("/youtube"),
          })}
          onClick={() => router.push("/youtube")}
        >
          <YoutubeIcon />
          <span>YouTube</span>
        </div>
      </div>
      <div className={styles.asideFooter}>
        <div className={styles.profileBox}>
          <div className={styles.profile}>
            <UserIcon />
          </div>
          <div className={styles.textgrid}>
            <span>{user.name || "User"}</span>
            <UpIcon />
          </div>
        </div>
      </div>
    </aside>
  );
}
