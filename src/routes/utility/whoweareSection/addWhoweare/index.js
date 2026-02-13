import React from "react";
import styles from "./addWhoweare.module.scss";
import CloseIcon from "@/icons/closeIcon";
import Dropicon from "@/icons/dropicon";
import Button from "@/components/button";
import OutlineButton from "@/components/outlineButton";
const Close = "/assets/icons/close.svg";
const SaveIcon = "/assets/icons/save.svg";
export default function AddWhoweare({
  onClose,
  onSubmit,
  fileInputRef,
  handleFileChange,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  openFileDialog,
  imageFile,
  removeImage,
  isDragging,
  errors,
  isLoading,
}) {
  return (
    <div className={styles.addWhoweareAlignment}>
      <div className={styles.usermodal}>
        <div className={styles.modalHeader}>
          <h2>Add Who We Are Image</h2>
          <div className={styles.closeIcon} onClick={onClose}>
            <CloseIcon />
          </div>
        </div>
        <form className={styles.modalBody} onSubmit={onSubmit}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <div className={styles.dragBox}>
              <div className={styles.text}>
                <span>Upload Who We Are Image</span>
              </div>
              <div className={styles.dragBox}>
                {imageFile ? (
                  <div className={styles.imagePreview}>
                    <img
                      src={
                        typeof imageFile === "string"
                          ? imageFile
                          : URL.createObjectURL(imageFile)
                      }
                      alt="Preview"
                    />
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                    >
                      <CloseIcon />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className={styles.iconCenter}>
                      <Dropicon />
                    </div>
                    <h5>Drag and drop image here, or click to select</h5>
                    <p>(PNG, JPG or WEBP)</p>
                  </>
                )}
              </div>
            </div>
          </div>
          {errors?.image && (
            <div className={styles.errorMessage}>{errors.image.message}</div>
          )}
          <div className={styles.buttonRightAlignment}>
            <OutlineButton text="Cancel" icon={Close} />
            <Button type="submit" text="Save Image" icon={SaveIcon} disabled={isLoading} />
          </div>
        </form>
      </div>
    </div>
  );
}
