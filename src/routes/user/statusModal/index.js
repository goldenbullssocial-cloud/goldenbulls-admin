import React from "react";
import styles from "./status.module.scss";
import CloseIcon from "@/icons/closeIcon";
export default function StatusModal({
  customer,
  onClose,
  onStatusChange,
  statusLoading,
}) {
  return (
    <div
      className={styles.deleteUserModalWrapper}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Status User</h2>
          <div className={styles.closeIcon}>
            <CloseIcon />
          </div>
        </div>
        <div className={styles.text}>
          <p>
            Are you sure you want to inactive
            {customer ? ` ${customer.name}` : " this user"}? They will no longer
            be able to access their account.
          </p>
        </div>
        <div className={styles.footerButtonalignment}>
          <button onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M18 6L6 18"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6 6L18 18"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Cancel
          </button>
          <button
            className={styles.remove}
            onClick={onStatusChange}
            disabled={statusLoading}
          >
            {statusLoading ? (
              <>
                {customer?.currentStatus ? "Inactivating..." : "Activating..."}
              </>
            ) : (
              <>
                <img
                  src={
                    customer?.currentStatus
                      ? "/assets/icons/InactiveUser.svg"
                      : "/assets/icons/activeUser.svg"
                  }
                  alt=""
                  width={24}
                  height={24}
                />
                {customer?.currentStatus ? "Inactive" : "Activate"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
