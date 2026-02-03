import React from "react";
import styles from "./addBlogCategory.module.scss";
import CloseIcon from "@/icons/closeIcon";
import Input from "@/components/input";
import Button from "@/components/button";
const SaveIcon = "/assets/icons/save.svg";
export default function AddBlogCategory({
  onClose,
  isEditMode,
  form,
  onSubmit,
}) {
  return (
    <div className={styles.addBlogCategoryWrapper}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{isEditMode ? "Edit" : "Add"} Blog Category</h2>
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
          <Input
            label="Category Name"
            placeholder="Enter category name"
            name="categoryName"
            value={form.watch("categoryName") || ""}
            onChange={(e) => {
              const value = e.target.value.trim();
              form.setValue("categoryName", value);
            }}
            onBlur={(e) => {
              const value = e.target.value.trim();
              form.setValue("categoryName", value);
              form.trigger("categoryName");
            }}
            error={form.formState.errors.categoryName?.message}
            bglight
            leftSpaceRemove
          />
          <Button
            type="submit"
            text={isEditMode ? "Update Category" : "Add Category"}
            disabled={!form.formState.isDirty || form.formState.isSubmitting}
            icon={SaveIcon}
            className={styles.buttonWidth}
          />
        </form>
      </div>
    </div>
  );
}
