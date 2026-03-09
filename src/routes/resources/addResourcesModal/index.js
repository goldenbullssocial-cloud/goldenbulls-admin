import React from "react";
import styles from "./addResourcesModal.module.scss";
import CloseIcon from "@/icons/closeIcon";
import Input from "@/components/input";
import OutlineButton from "@/components/outlineButton";
import Button from "@/components/button";
import Dropicon from "@/icons/dropicon";

const Close = "/assets/icons/close.svg";
const SaveIcon = "/assets/icons/save.svg";

export default function AddResourcesModal({
  onClose,
  register,
  setValue,
  errors,
  fileValue,
  isUploading,
  removeFile,
  fileInputRef,
  handleFileChange,
  openFileDialog,
  onSubmit,
  handleSubmit,
  isEditMode,
  isLoading
}) {
  return (
    <div className={styles.addResourcesModalWrapper}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{isEditMode ? "Edit Resource" : "Add Resource"}</h2>
          <div className={styles.closeIcon} onClick={onClose}>
            <CloseIcon />
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.modalBody}>
          <div className={styles.bottomSpacing}>
            <Input
              label="Title"
              placeholder="Enter Resource Title"
              bglight
              leftSpaceRemove
              id="title"
              {...register("title")}
              onChange={(e) =>
                setValue("title", e.target.value.trimStart(), { shouldValidate: true })
              }
              error={errors?.title?.message}
            />
          </div>
          
          <div className={styles.text}>
            <p>Upload File (PDF, PPT, DOC, DOCX, Images)</p>
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.ppt,.pptx,.doc,.docx,image/*"
            style={{ display: "none" }}
          />

          <div
            onClick={openFileDialog}
            className={styles.fileUploadBox}
          >
            <div className={styles.dragBox}>
              <div className={styles.text}>
                <span>Upload File Document</span>
              </div>
              
              {fileValue && !isUploading ? (
                <div className={styles.filePreviewContainer}>
                   <div className={styles.filePreview}>
                     <div className={styles.successText}>File successfully uploaded</div>
                     <a href={fileValue} target="_blank" rel="noopener noreferrer" className={styles.fileLink} onClick={(e) => e.stopPropagation()}>
                       {fileValue.replace(/^.*[\\\/]/, '')}
                     </a>
                   </div>
                   <button
                    type="button"
                    className={styles.removeButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                  >
                    <CloseIcon />
                  </button>
                </div>
              ) : isUploading ? (
                <div className={styles.uploadingState}>
                  <h5>Uploading...</h5>
                </div>
              ) : (
                <>
                  <div className={styles.iconCenter}>
                    <Dropicon />
                  </div>
                  <h5>Click to select file</h5>
                  <p>(PDF, PPT, DOC, Image)</p>
                </>
              )}
            </div>
            {errors?.fileUrl?.message && (
              <p className={styles.error}>{errors?.fileUrl?.message}</p>
            )}
          </div>

          <div className={styles.buttonRightAlignment}>
            <OutlineButton text="Cancel" icon={Close} onClick={onClose} />
            <Button
              type="submit"
              text={isLoading ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update Resource" : "Save Resource")}
              icon={SaveIcon}
              disabled={isLoading || isUploading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
