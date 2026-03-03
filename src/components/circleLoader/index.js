import React from "react";
import styles from "./circleLoader.module.scss";

const CircleLoader = ({ size = "small", className = "" }) => {
  const loaderClasses = [
    styles.circleLoader,
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={loaderClasses}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default CircleLoader;
