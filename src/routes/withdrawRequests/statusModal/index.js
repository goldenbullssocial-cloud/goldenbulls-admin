import React from "react";
import styles from "./statusModal.module.scss";
import CloseIcon from "@/icons/closeIcon";
import Input from "@/components/input";
import Button from "@/components/button";
import OutlineButton from "@/components/outlineButton";
import StyledSelect from "@/components/styledSelect";

const SaveIcon = "/assets/icons/save.svg";
const Close = "/assets/icons/close.svg";

const statusOptions = [
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function StatusModal({
  editDialogOpen,
  setEditDialogOpen,
  editStatus,
  setEditStatus,
  transactionId,
  setTransactionId,
  formErrors,
  setFormErrors,
  isLoadingAction,
  handleUpdateWithdrawal,
}) {
  const handleStatusChange = (selectedOption) => {
    const value = selectedOption.value;
    setEditStatus(value);
    // Clear transaction ID when status changes to rejected
    if (value === "rejected") {
      setTransactionId("");
    }
  };

  const handleTransactionIdChange = (e) => {
    setTransactionId(e.target.value);
    // Clear error when user starts typing
    if (formErrors.transactionId) {
      setFormErrors((prev) => ({
        ...prev,
        transactionId: undefined,
      }));
    }
  };

  const clearTransactionId = () => {
    setTransactionId("");
    if (formErrors.transactionId) {
      setFormErrors((prev) => ({
        ...prev,
        transactionId: undefined,
      }));
    }
  };

  return (
    editDialogOpen && (
      <div className={styles.statusModalWrapper}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h2>Update Withdrawal Status</h2>
            <div
              className={styles.closeIcon}
              onClick={() => setEditDialogOpen(false)}
            >
              <CloseIcon />
            </div>
          </div>
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Status</label>
              <StyledSelect
                options={statusOptions}
                value={statusOptions.find(
                  (option) => option.value === editStatus,
                )}
                onChange={handleStatusChange}
                placeholder="Select status"
                error={formErrors.status}
              />
              {formErrors.status && (
                <span className={styles.errorText}>{formErrors.status}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Transaction ID</label>
              <div className={styles.inputWrapper}>
                <Input
                  placeholder="Enter transaction ID"
                  value={transactionId}
                  onChange={handleTransactionIdChange}
                  bglight
                  leftSpaceRemove
                  disabled={isLoadingAction || editStatus !== "approved"}
                  error={formErrors.transactionId}
                />
                {transactionId && (
                  <button
                    type="button"
                    onClick={clearTransactionId}
                    className={styles.clearButton}
                    disabled={isLoadingAction || editStatus !== "approved"}
                  >
                    <CloseIcon />
                  </button>
                )}
              </div>
              {formErrors.transactionId ? (
                <span className={styles.errorText}>
                  {formErrors.transactionId}
                </span>
              ) : editStatus === "approved" ? (
                <span className={styles.helperText}>
                  Please enter the transaction ID for the approved withdrawal.
                </span>
              ) : null}
            </div>

            <div className={styles.twoButtonAlignment}>
              <OutlineButton
                text="Cancel"
                icon={Close}
                onClick={() => setEditDialogOpen(false)}
              />
              <Button
                text={isLoadingAction ? "Updating..." : "Update Status"}
                icon={SaveIcon}
                onClick={handleUpdateWithdrawal}
                disabled={
                  isLoadingAction ||
                  !editStatus ||
                  (editStatus === "approved" && !transactionId.trim())
                }
              />
            </div>
          </div>
        </div>
      </div>
    )
  );
}
