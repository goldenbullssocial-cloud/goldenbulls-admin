import React from "react";
import styles from "./noDataFound.module.scss";
import classNames from "classnames";
import Image from "next/image";
import NoDataIcon from "../../../public/assets/images/noData.png";

export default function NoDataFound({
  message = "No data found",
  description = "There are no items to display at the moment. Please check back later or adjust your search criteria.",
  className,
  size = "medium",
  showIcon = true,
  actionButton,
}) {
  return (
    <div className={classNames(styles.noDataFound, styles[size], className)}>
      {showIcon && (
        <div className={styles.iconContainer}>
          <Image src={NoDataIcon} alt="No data found" className={styles.icon} />
        </div>
      )}
      <div className={styles.content}>
        <h3 className={styles.message}>{message}</h3>
        {description && <p className={styles.description}>{description}</p>}
        {actionButton && (
          <div className={styles.actionButton}>{actionButton}</div>
        )}
      </div>
    </div>
  );
}
