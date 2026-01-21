import React from "react";
import styles from "./status.module.scss";
import CloseIcon from "@/icons/closeIcon";
export default function StatusModal({
  customer,
  onClose,
  onStatusChange,
  statusLoading,
}) {
  console.log(customer, "customer");
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
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {customer?.currentStatus ? "Inactivating..." : "Activating..."}
              </>
            ) : customer?.currentStatus ? (
              "Inactive"
            ) : (
              "Activate"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
