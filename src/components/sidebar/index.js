"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./sidebar.module.scss";
import classNames from "classnames";
import LibraryIcon from "@/icons/libraryIcon";
import CoursesIcon from "@/icons/coursesIcon";
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
import BlogsIcon from "@/icons/blogsIcon";
import BlogCategoriesIcon from "@/icons/blogCategoriesIcon";
import YoutubeIcon from "@/icons/youtubeIcon";
import NewsletterIcon from "@/icons/newsletterIcon";
import ContactIcon from "@/icons/contactIcon";
import FooterImagesIcon from "@/icons/footerImagesIcon";
import CertificateIcon from "@/icons/certificateIcon";
import LogoutIcon from "@/icons/logoutIcon";
const Logo = "/assets/logo/logo.svg";

export default function Sidebar({ unreadCount }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState({});
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const modalRef = useRef(null);

  // Handle body scroll and overlay when modal is open
  useEffect(() => {
    if (showLogoutModal) {
      // Add class to body when modal is open
      document.body.classList.add("modal-open");
      // Prevent scrolling
      document.body.style.overflow = "hidden";
    } else {
      // Remove class when modal is closed
      document.body.classList.remove("modal-open");
      // Re-enable scrolling
      document.body.style.overflow = "auto";
    }

    // Cleanup function
    return () => {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "auto";
    };
  }, [showLogoutModal]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowLogoutModal(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to check if a path is active
  const isActive = (path) => {
    if (path === "/") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setIsDropdownOpen(false);
  };

  const handleSignOut = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.querySelector(`.${styles.profileDropdown}`);
      const profileBox = document.querySelector(`.${styles.profileBox}`);

      if (
        dropdown &&
        profileBox &&
        !dropdown.contains(event.target) &&
        !profileBox.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    <>
      <aside className={styles.sidebar}>
        <div
          className={styles.sidebarlogo}
          onClick={() => window.location.reload()}
        >
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
            <div className="relative">
              <RequestsIcon />
              {unreadCount > 0 && (
                <span className={styles.notificationBadge}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
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
              [styles.active]: isActive("/blog-categories"),
            })}
            onClick={() => router.push("/blog-categories")}
          >
            <BlogCategoriesIcon />
            <span>Blog Categories</span>
          </div>
          <div
            className={classNames(styles.menu, {
              [styles.active]: isActive("/blogs"),
            })}
            onClick={() => router.push("/blogs")}
          >
            <BlogsIcon />
            <span>Blogs</span>
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
          <div
            className={classNames(styles.menu, {
              [styles.active]: isActive("/newsletter"),
            })}
            onClick={() => router.push("/newsletter")}
          >
            <NewsletterIcon />
            <span>Newsletter</span>
          </div>
          <div
            className={classNames(styles.menu, {
              [styles.active]: isActive("/contact"),
            })}
            onClick={() => router.push("/contact")}
          >
            <ContactIcon />
            <span>Contact</span>
          </div>
          <div
            className={classNames(styles.menu, {
              [styles.active]: isActive("/footer-images"),
            })}
            onClick={() => router.push("/footer-images")}
          >
            <FooterImagesIcon />
            <span>Footer Images</span>
          </div>
          <div
            className={classNames(styles.menu, {
              [styles.active]: isActive("/certificate"),
            })}
            onClick={() => router.push("/certificate")}
          >
            <CertificateIcon />
            <span>Certificate</span>
          </div>
        </div>
        <div className={styles.asideFooter}>
          <div className={styles.profileBox} onClick={toggleDropdown}>
            <div className={styles.profile}>
              <UserIcon />
            </div>
            <div className={styles.textgrid}>
              <span>{user.name || "Admin"}</span>
              <UpIcon
                className={classNames({ [styles.rotate]: isDropdownOpen })}
              />
            </div>
            {isDropdownOpen && (
              <div className={styles.profileDropdown}>
                <div
                  className={styles.dropdownItem}
                  onClick={handleLogoutClick}
                >
                  <LogoutIcon className={styles.dropdownIcon} />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Logout Confirmation Modal */}
      </aside>
      {showLogoutModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} ref={modalRef}>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={handleCancelLogout}
              >
                Cancel
              </button>
              <button className={styles.logoutButton} onClick={handleSignOut}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
