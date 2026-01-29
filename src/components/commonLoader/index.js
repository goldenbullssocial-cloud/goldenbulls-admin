import React from "react";
import styles from "./commonLoader.module.scss";

const CommonLoader = ({
  size = "medium",
  overlay = false,
  className = "",
}) => {
  const loaderClasses = [
    styles.commonLoader,
    styles[size],
    overlay && styles.overlay,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={loaderClasses}>
      <div className={styles.loaderContainer}>
        <div className={styles.spinner}>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
        </div>
      </div>
    </div>
  );
};

export default CommonLoader;
