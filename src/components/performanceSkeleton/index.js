import React from "react";
import styles from "./performanceSkeleton.module.scss";

const PerformanceSkeleton = ({ count = 5 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div className={styles.skeletonItem} key={index}>
          <div className={styles.textSkeleton}>
            <div className={`${styles.skeleton} ${styles.titleSkeleton}`}></div>
            <div className={`${styles.skeleton} ${styles.valueSkeleton}`}></div>
          </div>
          <div className={styles.iconSkeleton}>
            <div className={`${styles.skeleton} ${styles.iconPlaceholder}`}></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default PerformanceSkeleton;
