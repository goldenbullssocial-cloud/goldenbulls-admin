import React from "react";
import styles from "./addyoutubeVideo.module.scss";
import CloseIcon from "@/icons/closeIcon";
import Input from "@/components/input";
import Dropicon from "@/icons/dropicon";
import OutlineButton from "@/components/outlineButton";
import Button from "@/components/button";
import Image from "next/image";
const Close = "/assets/icons/close.svg";
const SaveIcon = "/assets/icons/save.svg";
export default function AddyoutubeVideo({
  onClose,
  register,
  setValue,
  errors,
  thumbnailFile,
  isUploading,
  removeThumbnail,
  fileInputRef,
  handleFileChange,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  openFileDialog,
  imagePreview,
  onSubmit,
  handleSubmit,
  isEditMode,
}) {
  return (
    <div className={styles.addyoutubeVideoWrapper}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{isEditMode ? "Edit youtube video" : "Add youtube video"}</h2>
          <div className={styles.closeIcon} onClick={onClose}>
            <CloseIcon />
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.modalBody}>
          <div className={styles.bottomSpacing}>
            <Input
              label="Title"
              placeholder="Enter Video Title"
              bglight
              leftSpaceRemove
              id="description"
              {...register("description")}
              onBlur={(e) =>
                setValue("description", e.target.value.trim(), {
                  shouldValidate: true,
                })
              }
              onKeyDown={(e) => {
                if (e.key === "" && !e.currentTarget.value.trim())
                  e.preventDefault();
              }}
              error={errors?.description?.message}
            />
          </div>
          <div className={styles.bottomSpacing}>
            <Input
              label="YouTube URL"
              placeholder="https://youtube.com"
              bglight
              leftSpaceRemove
              id="videoUrl"
              {...register("videoUrl")}
              error={errors?.videoUrl?.message}
            />
          </div>
          <div className={styles.text}>
            <p>Upload Thumbnail Image (16:9 Ratio)</p>
          </div>
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
                <span>Upload Banner Image (16:9 Ratio)</span>
              </div>
              {imagePreview || thumbnailFile ? (
                <div className={styles.imagePreview}>
                  <Image
                    src={imagePreview || thumbnailFile}
                    alt="Preview"
                    width={400}
                    height={300}
                    style={{ objectFit: "cover" }}
                  />
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeThumbnail();
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
            {errors?.thumbnail?.message && (
              <p className={styles.error}>{errors?.thumbnail?.message}</p>
            )}
          </div>

          <div className={styles.buttonRightAlignment}>
            <OutlineButton text="Cancel" icon={Close} onClick={onClose} />
            <Button
              type="submit"
              text={isEditMode ? "Update Video" : "Save Video"}
              icon={SaveIcon}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
