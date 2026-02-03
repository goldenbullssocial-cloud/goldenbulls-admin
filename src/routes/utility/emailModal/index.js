import React, { useRef } from "react";
import styles from "./emailModal.module.scss";
import CloseIcon from "@/icons/closeIcon";
import Input from "@/components/input";
import OutlineButton from "@/components/outlineButton";
import Button from "@/components/button";
const Close = "/assets/icons/close.svg";
const SaveIcon = "/assets/icons/save.svg";
export default function EmailModal({
  onSave,
  onClose,
  label,
  currentField,
  utilitySettings,
  fieldLabels,
}) {
  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentField) return;

    const formData = new FormData(formRef.current);
    const value = formData.get(currentField);

    if (value) {
      onSave(currentField, value);
    }
  };

  return (
    <div className={styles.emailModalWrapper}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{label}</h2>
          <div className={styles.closeIcon} onClick={onClose}>
            <CloseIcon />
          </div>
        </div>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className={styles.modalBody}
        >
          <Input
            label={label}
            name={currentField || ""}
            defaultValue={currentField ? utilitySettings[currentField] : ""}
            placeholder={`Enter ${
              currentField ? fieldLabels[currentField].toLowerCase() : "value"
            }`}
            required
          />

          <div className={styles.buttonRightAlignment}>
            <OutlineButton text="Cancel" icon={Close} onClick={onClose} />
            <Button text="Save" icon={SaveIcon} type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
}
