"use client";
import React, { useEffect, useState } from "react";
import styles from "./userHeader.module.scss";
import Button from "../button";

export default function UserHeader({
  placeholder = "Search Courses and Algobots",
  value = "",
  onChange = () => {},
  buttonText = "Search",
  onClick = () => {},
  disabled = false,
  NoRightContent,
  NoSearch,
  NoButton,
  icon,
  DescriptionText,
  HeaderText
}) {
  const [user, setUser] = useState({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Only access localStorage on the client side
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);
  return (
    <div className={styles.userHeader}>
      <div className={styles.leftContent}>
        <div className={styles.line}></div>
        <div>
          <h2>{HeaderText}</h2>
          <p>{DescriptionText}</p>
        </div>
      </div>
      {!NoRightContent && (
        <div className={styles.rightContent}>
          {!NoSearch && (
            <input
              type="search"
              placeholder={placeholder}
              value={value}
              onChange={onChange}
            />
          )}
          {!NoButton && (
            <Button
              text={buttonText}
              onClick={onClick}
              disabled={disabled}
              icon={icon}
              rightIcon
            />
          )}
        </div>
      )}
    </div>
  );
}
