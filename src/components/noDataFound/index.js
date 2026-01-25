import React from "react";
import styles from "./noDataFound.module.scss";
import classNames from "classnames";
import Image from "next/image";
import NoDataIcon from "../../../public/assets/images/noData.png";

export default function NoDataFound({
  message = "No data found",
  description,
  className,
  size = "medium",
}) {
  return (
    <div className={classNames(styles.noDataFound, styles[size], className)}>
      <div className={styles.iconContainer}>
        <Image src={NoDataIcon} alt="No data" className={styles.icon} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.message}>{message}</h3>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </div>
  );
}
