import React from "react";
import styles from "./deleteWhoweare.module.scss";
import CloseIcon from "@/icons/closeIcon";
import Button from "@/components/button";
import OutlineButton from "@/components/outlineButton";
const Close = "/assets/icons/close.svg";
const DeleteIcon = "/assets/icons/Delete.svg";

export default function DeleteWhoweare({ onClose, onDelete }) {
  return (
    <div className={styles.deleteWhoweareAlignment}>
      <div className={styles.usermodal}>
        <div className={styles.modalHeader}>
          <h2>Delete Who We Are Image</h2>
          <div className={styles.closeIcon} onClick={onClose}>
            <CloseIcon />
          </div>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.deleteContent}>
            <div className={styles.iconCenter}>
              <img src={DeleteIcon} alt="Delete" />
            </div>
            <h3>Are you sure you want to delete this image?</h3>
            <p>This action cannot be undone. The image will be permanently removed from the system.</p>
          </div>
          <div className={styles.buttonRightAlignment}>
            <OutlineButton text="Cancel" icon={Close} onClick={onClose} />
            <Button text="Delete" icon={DeleteIcon} onClick={onDelete} />
          </div>
        </div>
      </div>
    </div>
  );
}
