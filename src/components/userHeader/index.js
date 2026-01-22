"use client";
import React, { useEffect, useState } from "react";
import styles from "./userHeader.module.scss";
import Button from "../button";

export default function UserHeader({
  inputType = "text",
  placeholder = "Search Courses and Algobots",
  value = "",
  onChange = () => {},
  buttonText = "Search",
  onClick = () => {},
  disabled = false,
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
          <h2>
            Hello <span>{isClient ? user?.name || "User" : "User"}</span>
          </h2>
          <p>
            Keep learning, and grow your understanding of trading step by step.
          </p>
        </div>
      </div>
      <div className={styles.rightContent}>
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <Button text={buttonText} onClick={onClick} disabled={disabled} />
      </div>
    </div>
  );
}
