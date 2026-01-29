import React from "react";
import styles from "./bannerSkeleton.module.scss";

const BannerSkeleton = ({ count = 8 }) => {
  return (
    <div className={styles.imageGrid}>
      {Array.from({ length: count }).map((_, index) => (
        <div className={styles.skeletonItem} key={index}>
          <div className={styles.skeletonImage}>
            <div className={styles.skeleton}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BannerSkeleton;
