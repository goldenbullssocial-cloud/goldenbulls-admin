import React from "react";
import styles from "./deleteUser.module.scss";
import CloseIcon from "@/icons/closeIcon";
export default function DeleteUser({ customer, onClose, onDelete }) {
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
            <h2>Delete User</h2>
            <div className={styles.closeIcon}>
              <CloseIcon />
            </div>
          </div>
          <div className={styles.text}>
            <p>
              Are you sure you want to permanently delete{" "}
              {customer
                ? ` ${customer.name}`
                : " this user"}{" "}
              They will no longer be able to access their account. And you will
              no longer be able to restore their account and data.
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
            <button className={styles.remove} onClick={onDelete}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M10 11V17"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M14 11V17"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3 6H21"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Delete Permantly
            </button>
          </div>
        </div>
      </div>
    );
}
