"use client";
import React, { useEffect } from "react";
import styles from "./addFooterImage.module.scss";
import { useForm } from "react-hook-form";
import { ImageUpload } from "@/components/image-upload";
import Button from "@/components/button";

const CloseIcon = "/assets/icons/close.svg";

export default function AddFooterImage({
  onClose,
  isEditMode,
  form,
  onSubmit,
  handleImageChange,
  editingFooterImage,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    trigger,
  } = form;

  const imageFile = watch("imageFile");

  useEffect(() => {
    if (isEditMode && editingFooterImage) {
      setValue("title", editingFooterImage.title || "");
      setValue("redirectUrl", editingFooterImage.redirectUrl || "");
    }
  }, [isEditMode, editingFooterImage, setValue]);

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  const handleSubmitClick = () => {
    handleSubmit(onFormSubmit)();
  };

  return (
    <div className={styles.addFooterImageWrapper}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{isEditMode ? "Edit Footer Image" : "Add Footer Image"}</h2>
          <div className={styles.closeIcon} onClick={onClose}>
            <img src={CloseIcon} alt="Close" width="24" height="24" />
          </div>
        </div>

        <div className={styles.modalBody}>
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <div className={styles.formGrid}>
              <div className={styles.fullWidth}>
                <div className={styles.formGroup}>
                  <label htmlFor="title">Title</label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Enter footer image title"
                    {...register("title", {
                      onChange: (e) => {
                        e.target.value = e.target.value.trimStart();
                      },
                    })}
                  />
                  {errors.title && (
                    <span className={styles.errorText}>
                      {errors.title.message}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.fullWidth}>
                <div className={styles.formGroup}>
                  <label htmlFor="imageFile">Image</label>
                  <ImageUpload
                    id="imageFile"
                    name="imageFile"
                    onChange={handleImageChange}
                    initialImage={editingFooterImage?.imageUrl}
                    error={errors.imageFile?.message}
                  />
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <Button
                text={
                  isEditMode ? "Update Footer Image" : "Create Footer Image"
                }
                disabled={isSubmitting}
                loading={isSubmitting}
                onClick={handleSubmitClick}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
