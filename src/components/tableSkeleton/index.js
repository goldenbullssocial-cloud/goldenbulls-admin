import React from "react";
import styles from "./tableSkeleton.module.scss";

const TableSkeleton = ({ rows = 10, columns = 8 }) => {
  return (
    <div className={styles.skeletonContainer}>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className={`${styles.skeletonRow} ${styles[`cols-${columns}`]}`}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className={styles.skeletonCell}>
              <div className={styles.skeleton}></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;
