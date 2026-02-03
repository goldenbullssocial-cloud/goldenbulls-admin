import React from "react";
import styles from "./settingsModal.module.scss";
import CloseIcon from "@/icons/closeIcon";
import Input from "@/components/input";
import Button from "@/components/button";
import OutlineButton from "@/components/outlineButton";
import { CryptoChainModal } from "../CryptoChainModal";
const SaveIcon = "/assets/icons/save.svg";
const Close = "/assets/icons/close.svg";
export default function SettingsModal({
  onSave,
  onClose,
  commissionPercent,
  setCommissionPercent,
}) {
  return (
    <div className={styles.settingsModalWrapper}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Settings</h2>
          <div className={styles.closeIcon} onClick={onClose}>
            <CloseIcon />
          </div>
        </div>
        <div className={styles.modalBody}>
          <Input
            label="Commission %"
            placeholder="20"
            leftSpaceRemove
            bglight
            id="rate"
            type="number"
            min="0"
            step="1"
            max="100"
            value={commissionPercent}
            onKeyDown={(e) => {
              if (e.key === "." || e.key === "e") {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              setCommissionPercent(e.target.value.replace(/\D/g, ""));
            }}
          />
          <CryptoChainModal />

          <div className={styles.twoButtonAlignment}>
            <OutlineButton text="Cancel" icon={Close} onClick={onClose} />
            <Button text="Save" icon={SaveIcon} onClick={onSave} />
          </div>
        </div>
      </div>
    </div>
  );
}
