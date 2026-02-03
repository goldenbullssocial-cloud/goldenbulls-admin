"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./dropdown.module.scss";
import Image from "next/image";

export default function Dropdown({ actions = [], onSelect,dark }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (key) => {
    onSelect?.(key);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button
        type="button"
        className={dark ? styles.darkdropdownToggle : styles.dropdownToggle}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className={styles.dots}></span>
        <span className={styles.dots}></span>
        <span className={styles.dots}></span>
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          {actions.map(({ key, label, icon: Icon, variant }) => (
            <button
              type="button"
              key={key}
              className={`${styles.dropdownItem} ${
                variant === "danger" ? styles.delete : ""
              }`}
              onClick={() => handleSelect(key)}
            >
              <Image alt={label} src={Icon} className={styles.icon} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
