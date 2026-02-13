import React from "react";
import styles from "./addCertificate.module.scss";
import CloseIcon from "@/icons/closeIcon";
import Input from "@/components/input";
import Button from "@/components/button";
import { ImageUpload } from "@/components/image-upload";

const SaveIcon = "/assets/icons/save.svg";

export default function AddCertificate({ onClose, onSubmit, form, handleImageChange, isEditMode }) {
    return (
        <div className={styles.addCertificateWrapper} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>{isEditMode ? "Edit" : "Add New"} Certificate</h2>
                    <div className={styles.closeIcon} onClick={onClose}>
                        <CloseIcon />
                    </div>
                </div>
                <form
                    className={styles.modalBody}
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)();
                    }}
                >
                    <div className={styles.formGrid}>
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label>Certificate Image</label>
                            <ImageUpload
                                name="image"
                                id="image"
                                onChange={handleImageChange}
                                initialImage={form.watch("image")}
                            />
                            {form?.formState?.errors?.image?.message && (
                                <span className={styles.errorText}>
                                    {form?.formState?.errors?.image?.message}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <Button
                            type="submit"
                            text={isEditMode ? "Update Certificate" : "Upload Certificate"}
                            disabled={form.formState.isSubmitting}
                            icon={SaveIcon}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
