import React, { useEffect } from "react";
import styles from "./addBlog.module.scss";
import CloseIcon from "@/icons/closeIcon";
import Input from "@/components/input";
import Button from "@/components/button";
import { getAllBlogCategory } from "@/api/blogCategories";
import { toast } from "sonner";
import StyledSelect from "@/components/styledSelect";
import { ImageUpload } from "@/components/image-upload";

const SaveIcon = "/assets/icons/save.svg";

export default function AddBlog({
  onClose,
  handleImageChange,
  isEditMode,
  form,
  onSubmit,
}) {
  const [categories, setCategories] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await getAllBlogCategory();
        setCategories(response?.payload?.data || []);
        console.log("Categories loaded:", response?.payload?.data);
        console.log("Current categoryId value:", form.watch("categoryId"));
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Auto-generate slug from title
  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();

    form.setValue("title", title);
    form.setValue("slug", slug);
  };

  return (
    <div className={styles.addBlogWrapper}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{isEditMode ? "Edit" : "Add New"} Blog Post</h2>
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
            <Input
              label="Title"
              placeholder="Enter blog title"
              name="title"
              value={form.watch("title") || ""}
              onChange={handleTitleChange}
              onBlur={() => form.trigger("title")}
              error={form.formState.errors.title?.message}
              bglight
              leftSpaceRemove
              required
            />

            <Input
              label="Author"
              placeholder="Author name"
              name="name"
              value={form.watch("name") || ""}
              onChange={(e) => form.setValue("name", e.target.value)}
              onBlur={() => form.trigger("name")}
              error={form.formState.errors.name?.message}
              bglight
              leftSpaceRemove
              required
            />
            <div className={styles.formGroup}>
              <label>Category</label>
              <select
                className={`${styles.selectInput} ${form.formState.errors.categoryId ? styles.error : ""}`}
                value={form.watch("categoryId") || ""}
                onChange={(e) =>
                  form.setValue("categoryId", e.target.value, {
                    shouldValidate: true,
                  })
                }
                required
              >
                <option value="">Select a category</option>
                {categories?.map((category) => (
                  <option key={category?._id} value={category?._id}>
                    {category?.name}
                  </option>
                ))}
              </select>
              {form.formState.errors.categoryId && (
                <span className={styles.errorText}>
                  {form.formState.errors.categoryId.message}
                </span>
              )}
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Content</label>
              <textarea
                className={`${styles.textarea} ${form.formState.errors.description ? styles.error : ""}`}
                placeholder="Write your blog description here..."
                value={form.watch("description") || ""}
                onChange={(e) => form.setValue("description", e.target.value)}
                rows={8}
                required
              />
              {form.formState.errors.description && (
                <span className={styles.errorText}>
                  {form.formState.errors.description.message}
                </span>
              )}
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Cover Image</label>
              <ImageUpload
                name="coverImage"
                id="coverImage"
                error={form?.formState?.errors?.coverImage?.message}
                onChange={handleImageChange}
                initialImage={form.watch("coverImage")}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <Button
              type="submit"
              text={isEditMode ? "Update Blog" : "Publish Blog"}
              disabled={!form.formState.isDirty || form.formState.isSubmitting}
              icon={SaveIcon}
              // className={styles.submitButton}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
