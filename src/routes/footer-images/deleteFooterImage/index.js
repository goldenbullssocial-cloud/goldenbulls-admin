"use client";
import React from "react";
import styles from "./deleteFooterImage.module.scss";

const WarningIcon = "/assets/icons/warning.svg";

export default function DeleteFooterImage({
  onClose,
  onDelete,
  isLoading,
  footerImageTitle,
}) {
  return (
    <div className={styles.deleteFooterImageModalOverlay}>
      <div className={styles.deleteFooterImageModalContent}>
        <div className={styles.modalHeader}>
          <img src={WarningIcon} alt="Warning" width="48" height="48" style={{ marginBottom: "16px" }} />
          <h2>Delete Footer Image</h2>
          <p>Are you sure you want to delete this footer image? This action cannot be undone.</p>
        </div>

        <div className={styles.footerImageInfo}>
          <div className={styles.footerImageTitle}>{footerImageTitle}</div>
          <div className={styles.footerImageDetails}>
            <div>This footer image will be permanently removed from the system.</div>
            <div>Any links or references to this image will be broken.</div>
          </div>
        </div>

        <div className={styles.modalActions}>
          <button
            className={styles.cancelButton}
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className={styles.deleteButton}
            onClick={onDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Footer Image"}
          </button>
        </div>
      </div>
    </div>
  );
}
