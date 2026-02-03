import React from "react";
import styles from "./centerDetailsModal.module.scss";
import CloseIcon from "@/icons/closeIcon";
import EmailIcon from "@/icons/emailIcon";
import LocationIcon from "@/icons/locationIcon";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function CenterDetailsModal({ center,onClose }) {
  return (
    <div className={styles.centerDetailsModalWrapper}>
      <div className={styles.centerDetailsmodal}>
        <div className={styles.modalHeader}>
          <h2>Center Details</h2>
          <div className={styles.closeIcon} onClick={onClose}>
            <CloseIcon />
          </div>
        </div>
        <div className={styles.userInformation}>
          <div className={styles.profile}>SH</div>
          <div>
            <h3>{center.centerName}</h3>
            <div className={styles.email}>
              <LocationIcon />
              <a>{center.location}</a>
            </div>
            <span>{center.isActive ? "Active" : "Inactive"}</span>
          </div>
        </div>
        <div className={styles.textgrid}>
          <div className={styles.items}>
            <h4>Location</h4>
            <p>{center.country + ", " + center.state + ", " + center.city}</p>
          </div>
          <div className={styles.items}>
            <h4>Member Since</h4>
            <p>{formatDate(center.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
