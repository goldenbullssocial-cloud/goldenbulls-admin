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
  initialTocItems = [],
}) {
  const [categories, setCategories] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [tocInput, setTocInput] = React.useState("");
  const [tocItems, setTocItems] = React.useState(initialTocItems);

  // Initialize table of content items from form data
  React.useEffect(() => {
    const currentToc = form.watch("tableOfContent") || [];
    setTocItems(currentToc);
  }, [form.watch("tableOfContent")]);

  // Also initialize on mount for edit mode
  React.useEffect(() => {
    if (isEditMode) {
      const currentToc = form.getValues("tableOfContent") || [];
      setTocItems(currentToc);
    }
  }, [isEditMode]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await getAllBlogCategory();
        setCategories(response?.payload?.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Table of Contents handlers
  const handleAddTocItem = () => {
    if (tocInput.trim()) {
      const newTocItems = [...tocItems, tocInput.trim()];
      setTocItems(newTocItems);
      form.setValue("tableOfContent", newTocItems);
      form.trigger("tableOfContent"); // Trigger validation
      setTocInput("");
    }
  };

  const handleRemoveTocItem = (index) => {
    const newTocItems = tocItems.filter((_, i) => i !== index);
    setTocItems(newTocItems);
    form.setValue("tableOfContent", newTocItems);
    form.trigger("tableOfContent"); // Trigger validation
  };

  const handleTocKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTocItem();
    }
  };

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
            />
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Table of Contents *</label>
              <div className={styles.tocContainer}>
                <div className={styles.tocInputWrapper}>
                  <input
                    type="text"
                    placeholder="Enter table of content item and press Enter or click Add"
                    value={tocInput}
                    onChange={(e) => setTocInput(e.target.value)}
                    onKeyPress={handleTocKeyPress}
                    className={styles.tocInput}
                  />
                  <Button text="Add" type="button" onClick={handleAddTocItem} />
                </div>
                {tocItems.length > 0 && (
                  <div className={styles.tocItems}>
                    {tocItems.map((item, index) => (
                      <div key={index} className={styles.tocItem}>
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTocItem(index)}
                          className={styles.removeTocItem}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {form.formState.errors.tableOfContent && (
                  <span className={styles.errorText}>
                    {form.formState.errors.tableOfContent.message}
                  </span>
                )}
              </div>
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Category</label>
              <StyledSelect
                placeholder="Select a category"
                options={categories?.map((category) => ({
                  value: category?._id,
                  label: category?.name,
                }))}
                value={
                  form.watch("categoryId")
                    ? {
                        value: form.watch("categoryId"),
                        label:
                          categories?.find(
                            (cat) => cat._id === form.watch("categoryId"),
                          )?.name || "Select category",
                      }
                    : null
                }
                onChange={(selectedOption) => {
                  form.setValue("categoryId", selectedOption?.value || "", {
                    shouldValidate: true,
                  });
                }}
                onBlur={() => form.trigger("categoryId")}
                error={form.formState.errors.categoryId?.message}
              />
              {form.formState.errors.categoryId?.message && (
                <span className={styles.errorText}>
                  {form.formState.errors.categoryId?.message}
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
                onChange={handleImageChange}
                initialImage={form.watch("coverImage")}
              />
              {form?.formState?.errors?.coverImage?.message && (
                <span className={styles.errorText}>
                  {form?.formState?.errors?.coverImage?.message}
                </span>
              )}
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
