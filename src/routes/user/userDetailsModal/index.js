import React from "react";
import styles from "./userDetailsModal.module.scss";
import CloseIcon from "@/icons/closeIcon";
import EmailIcon from "@/icons/emailIcon";
export default function UserDetailsModal({ customer, onClose }) {
  return (
    <div
      className={styles.userDetailsModal}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div className={styles.usermodal}>
        <div className={styles.modalHeader}>
          <h2>User Details</h2>
          <div className={styles.closeIcon}>
            <CloseIcon onClick={onClose} />
          </div>
        </div>
        <div className={styles.userInformation}>
          <div className={styles.profile}>SH</div>
          <div>
            <h3>
              {customer?.firstName && customer?.lastName
                ? `${customer.firstName} ${customer.lastName}`
                : customer?.firstName || customer?.lastName || "N/A"}
            </h3>
            <div className={styles.email}>
              <EmailIcon />
              <a>{customer?.email || "N/A"}</a>
            </div>
            <span>Active</span>
          </div>
        </div>
        <div className={styles.textgrid}>
          <div className={styles.items}>
            <h4>Location</h4>
            <p>{customer?.location || "N/A"}</p>
          </div>
          <div className={styles.items}>
            <h4>Member Since</h4>
            <p>
              {customer?.createdAt
                ? new Date(customer.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
          <div className={styles.items}>
            <h4>Referral Code</h4>
            <p>{customer?.referralCode || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
