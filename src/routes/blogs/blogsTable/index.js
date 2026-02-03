"use client";
import React, { useState, useEffect } from "react";
import styles from "./blogsTable.module.scss";
import PagePagination from "@/components/pagePagination";
import UserHeader from "@/components/userHeader";
import { useForm } from "react-hook-form";
import { deleteBlog, updateBlog, getAllBlog, createBlog } from "@/api/blogs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import EditIcon from "../../../../public/assets/icons/Edit.svg";
import DeleteIcon from "../../../../public/assets/icons/Delete.svg";
import Dropdown from "@/components/dropdown";
import AddBlog from "../addBlog";
import { toast } from "sonner";
import DeleteBlog from "../deleteBlog";
import { uploadImage } from "@/api/course";
import NoDataFound from "@/components/noDataFound";
import CommonLoader from "@/components/commonLoader";
const PlusIcon = "/assets/icons/plus.svg";

const blogFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be at most 200 characters"),
  categoryId: z.string().min(1, "Category is required"),
  name: z.string().min(2, "Author name is required"),
  description: z.string().min(100, "Content must be at least 100 characters"),
  coverImage: z.any().refine((file) => file, "Cover image is required"),
  tableOfContent: z
    .array(z.string())
    .min(1, "At least one table of content item is required"),
});

export default function BlogsTable() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const [isAddBlogOpen, setIsAddBlogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [currentBlogId, setCurrentBlogId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const form = useForm({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      categoryId: "",
      name: "",
      description: "",
      coverImage: null,
      tableOfContent: [],
    },
  });

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      const response = await getAllBlog(params);

      // Flatten all blogs from all categories
      const allBlogs =
        response?.payload?.data?.flatMap(
          (category) =>
            category?.blogs?.map((blog) => ({
              ...blog,
              categoryName: category?.name || "Uncategorized",
            })) || [],
        ) || [];

      setBlogs(allBlogs);

      setTotalItems(response?.payload?.count);
      setTotalPages(Math.ceil((response?.payload?.count || 1) / itemsPerPage));
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to load blogs");
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, itemsPerPage, debouncedSearch]);

  const handleEdit = (blog) => {
    setIsEditMode(true);
    setCurrentBlogId(blog?._id);
    setEditingBlog(blog);
    form.reset({
      title: blog?.title || "",
      categoryId: blog?.categoryId || blog?.categoryId?._id || "",
      name: blog?.name || "",
      description: blog?.description || "",
      coverImage: blog?.coverImage || null,
      tableOfContent: blog?.tableOfContent || [],
    });
    setIsAddBlogOpen(true);
  };

  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog);
    setIsDeleteDialogOpen(true);
  };
  const handleImageChange = (file) => {
    if (!file) {
      setImageFile(null);
      form.setValue("coverImage", null);
      form.trigger("coverImage"); // Trigger validation
      return;
    }

    const maxSize = 1 * 1024 * 1024;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image");
      return;
    }

    if (file.size > maxSize) {
      toast.error("Image must be under 1MB");
      return;
    }

    setImageFile(file);
    form.setValue("coverImage", file);
    form.trigger("coverImage"); // Trigger validation
  };

  const confirmDelete = async () => {
    if (!blogToDelete) return;

    try {
      setIsDeleting(true);
      await deleteBlog(blogToDelete?._id);
      setBlogs(blogs?.filter((b) => b?._id !== blogToDelete?._id));
      toast.success("Blog post deleted successfully");
      setIsDeleteDialogOpen(false);
      setBlogToDelete(null);
    } catch (error) {
      console.error("Error deleting blog post:", error);
      toast.error("Failed to delete blog post");
    } finally {
      setIsDeleting(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      if (isEditMode && currentBlogId) {
        // In edit mode, only include changed fields
        const originalBlog = blogs?.find((blog) => blog?._id === currentBlogId);
        if (!originalBlog) {
          throw new Error("Original blog not found");
        }

        let requestData = {};
        let hasChanges = false;

        // Compare each field and only include if changed
        if (data?.title !== originalBlog?.title) {
          requestData.title = data.title;
          hasChanges = true;
        }

        if (data?.categoryId !== originalBlog?.categoryId) {
          requestData.categoryId = data.categoryId;
          hasChanges = true;
        }

        if (data?.name !== originalBlog?.name) {
          requestData.name = data.name;
          hasChanges = true;
        }

        if (data?.description !== originalBlog?.description) {
          requestData.description = data.description;
          hasChanges = true;
        }

        // Compare table of content arrays
        const originalToc = originalBlog?.tableOfContent || [];
        const currentToc = data?.tableOfContent || [];
        if (JSON.stringify(originalToc) !== JSON.stringify(currentToc)) {
          requestData.tableOfContent = currentToc;
          hasChanges = true;
        }

        // Handle image upload if new image is provided
        if (imageFile) {
          try {
            const imageResponse = await uploadImage(imageFile);

            if (imageResponse?.success && imageResponse?.payload) {
              requestData.coverImage = imageResponse.payload;
              hasChanges = true;
            } else {
              throw new Error("Failed to upload image: Invalid response");
            }
          } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image");
            setIsLoading(false);
            return;
          }
        }

        // Only proceed with update if there are changes
        if (hasChanges) {
          await updateBlog(currentBlogId, requestData);
          toast.success("Blog post updated successfully!");
        } else {
          toast.info("No changes detected");
          setIsAddBlogOpen(false);
          return;
        }
      } else {
        // For new blogs, use FormData as before
        const formData = new FormData();

        // Append all fields to formData
        Object.entries(data).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            // Handle array fields like tableOfContent
            if (key === "tableOfContent" && Array.isArray(value)) {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, value);
            }
          }
        });

        // Append image file if it exists
        if (imageFile) {
          try {
            const imageResponse = await uploadImage(imageFile);

            if (imageResponse?.success && imageResponse?.payload) {
              formData.append("coverImage", imageResponse.payload);
            } else {
              throw new Error("Failed to upload image: Invalid response");
            }
          } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image");
            setIsLoading(false);
            return;
          }
        }

        // Generate slug from title
        const title = formData.get("title");
        if (title) {
          const slug = title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/--+/g, "-")
            .trim();
          formData.set("slug", slug);
        }

        await createBlog(formData);
        toast.success("Blog post created successfully!");
      }

      setIsAddBlogOpen(false);
      form.reset();
      setIsEditMode(false);
      setEditingBlog(null);
      await fetchBlogs();
    } catch (error) {
      console.error("Error saving blog post:", error);
      toast.error(error?.response?.data?.message || "Failed to save blog post");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value.trimStart());
  };

  const filteredBlogs = blogs?.filter(
    (blog) =>
      blog?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      blog?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      (blog?.description &&
        blog?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase())),
  );

  const handleAddNew = () => {
    setIsEditMode(false);
    setEditingBlog(null);
    form.reset({
      title: "",
      slug: "",
      categoryId: "",
      name: "",
      description: "",
      coverImage: null,
    });
    setIsAddBlogOpen(true);
  };

  const getBlogActions = () => [
    {
      key: "edit",
      label: "Edit",
      icon: EditIcon,
    },
    {
      key: "delete",
      label: "Delete",
      icon: DeleteIcon,
      variant: "danger",
    },
  ];

  const handleAction = (action, blog) => {
    if (action === "edit") handleEdit(blog);
    if (action === "delete") handleDeleteClick(blog);
  };

  return (
    <>
      <UserHeader
        buttonText="Add New Blog"
        onClick={handleAddNew}
        value={debouncedSearch}
        onChange={(e) => setSearchTerm(e.target.value.trimStart())}
        HeaderText="Blogs"
        DescriptionText="View and control all blog posts"
        icon={PlusIcon}
      />
      {isLoading ? (
        <CommonLoader />
      ) : (
        <div className={styles.blogsPageAlignment}>
          <div className={styles.blogsTableAlignment}>
            <div className={styles.tableUi}>
              <table>
                <thead>
                  <tr>
                    <th className={styles.indexCol}>Sr no.</th>
                    <th className={styles.titleCol}>Title</th>
                    <th className={styles.authorCol}>Author</th>
                    <th className={styles.categoryCol}>Category</th>
                    <th className={styles.dateCol}>Created Date</th>
                    <th className={styles.actionsCol}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBlogs.length > 0 ? (
                    filteredBlogs.map((blog, index) => (
                      <tr key={blog?._id}>
                        <td className={styles.indexCol}>{index + 1}</td>
                        <td
                          className={`${styles.blogTitle} ${styles.cellContent}`}
                          title={blog?.title}
                        >
                          <div className={styles.truncate}>
                            {blog?.title || ""}
                          </div>
                        </td>
                        <td className={styles.cellContent} title={blog?.name}>
                          <div className={styles.truncate}>
                            {blog?.name || ""}
                          </div>
                        </td>
                        <td
                          className={styles.cellContent}
                          title={blog?.categoryName || "Uncategorized"}
                        >
                          <div className={styles.truncate}>
                            {blog?.categoryName || "Uncategorized"}
                          </div>
                        </td>
                        <td className={styles.dateCol}>
                          {format(new Date(blog?.createdAt), "MMM d, yyyy")}
                        </td>
                        <td className={styles.actionsCol}>
                          <Dropdown
                            actions={getBlogActions()}
                            onSelect={(action) => handleAction(action, blog)}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <NoDataFound />
                  )}
                </tbody>
              </table>
            </div>
            <PagePagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
      {isAddBlogOpen && (
        <AddBlog
          onClose={() => setIsAddBlogOpen(false)}
          isEditMode={isEditMode}
          form={form}
          onSubmit={onSubmit}
          handleImageChange={handleImageChange}
          initialTocItems={editingBlog?.tableOfContent || []}
        />
      )}
      {isDeleteDialogOpen && (
        <DeleteBlog
          onClose={() => setIsDeleteDialogOpen(false)}
          onDelete={confirmDelete}
          isLoading={isDeleting}
          blogTitle={blogToDelete?.title || ""}
        />
      )}
    </>
  );
}
