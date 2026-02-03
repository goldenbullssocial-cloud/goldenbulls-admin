"use client";
import React, { useState, useEffect } from "react";
import styles from "./blogCategoriesTable.module.scss";
import ThreeMenuIcon from "@/icons/threeMenuIcon";
import PagePagination from "@/components/pagePagination";
import UserHeader from "@/components/userHeader";
import { useForm } from "react-hook-form";
import {
  deleteBlogCategory,
  updateBlogCategory,
  getAllBlogCategory,
  createBlogCategory,
} from "@/api/blogCategories";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import EditIcon from "../../../../public/assets/icons/Edit.svg";
import DeleteIcon from "../../../../public/assets/icons/Delete.svg";
import Dropdown from "@/components/dropdown";
import AddBlogCategory from "../addBlogCategory";
import { toast } from "sonner";
import DeleteBlogCategory from "../deleteBlogCategory";
import NoDataFound from "@/components/noDataFound";
import CommonLoader from "@/components/commonLoader";
const PlusIcon = "/assets/icons/plus.svg";

const blogCategoryFormSchema = z.object({
  categoryName: z
    .string()
    .min(3, "Category name must be at least 3 characters")
    .max(50, "Category name must be at most 50 characters"),

  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional(),
});

export default function BlogCategoriesTable() {
  const [blogCategories, setBlogCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm({
    resolver: zodResolver(blogCategoryFormSchema),
    defaultValues: {
      categoryName: "",
      description: "",
    },
  });

  // Mock data - replace with actual API calls
  const fetchBlogCategories = async () => {
    try {
      setIsLoading(true);
      const response = await getAllBlogCategory({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
      });

      setBlogCategories(response.payload.data);
      setTotalItems(response.payload.data.length);
      setTotalPages(Math.ceil(response.payload.totalPages / itemsPerPage));
    } catch (error) {
      console.error("Error fetching blog categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogCategories();
  }, [currentPage, itemsPerPage]);

  const handleEdit = (category) => {
    setIsEditMode(true);
    setCurrentCategoryId(category._id);
    setEditingCategory(category);
    form.reset({
      categoryName: category.name,
      description: category.description || "",
    });
    setIsAddCategoryOpen(true);
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setIsDeleting(true);
      await deleteBlogCategory(categoryToDelete._id);
      setBlogCategories(
        blogCategories.filter((c) => c._id !== categoryToDelete._id),
      );
      toast.success("Blog category deleted successfully");
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Error deleting blog category:", error);
      toast.error("Failed to delete blog category");
    } finally {
      setIsDeleting(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      // Generate slug from category name (convert to lowercase and replace spaces with hyphens)
      const slug = data.categoryName.toLowerCase().replace(/\s+/g, "-");

      const payload = {
        name: data.categoryName,
        slug: slug,
      };

      if (isEditMode && currentCategoryId) {
        await updateBlogCategory(currentCategoryId, payload);
        toast.success("Blog category updated successfully!");
      } else {
        await createBlogCategory(payload);
        toast.success("Blog category created successfully!");
      }

      setIsAddCategoryOpen(false);
      form.reset();
      setIsEditMode(false);
      setEditingCategory(null);
      await fetchBlogCategories();
    } catch (error) {
      console.error("Error saving blog category:", error);
      toast.error("Failed to save blog category");
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

  const filteredCategories = blogCategories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddNew = () => {
    setIsEditMode(false);
    setEditingCategory(null);
    form.reset({
      categoryName: "",
      description: "",
    });
    setIsAddCategoryOpen(true);
  };
  const getUserActions = (isActive) => [
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
  const handleAction = (action, category) => {
    if (action === "edit") handleEdit(category);
    if (action === "delete") {
      handleDeleteClick(category);
    }
  };
  return (
    <>
      <UserHeader
        buttonText="Add Category"
        onClick={handleAddNew}
        HeaderText="Blog Categories"
        DescriptionText="View and Manage all blog categories"
        icon={PlusIcon}
      />
      <div className={styles.couponsPageAlignment}>
        {isLoading ? (
          <CommonLoader />
        ) : (
          <div className={styles.couponsTableAlignment}>
            <div className={styles.tableUi}>
              <table>
                <thead>
                  <tr>
                    <th>Sr no.</th>
                    <th>Category Name</th>
                    <th>Created Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories?.length > 0 ? (
                    filteredCategories.map((category, index) => (
                      <tr key={category._id}>
                        <td>{index + 1}</td>
                        <td>{category.name}</td>
                        <td>
                          {format(
                            new Date(category.createdAt),
                            "dd/MM/yyyy, HH:mm:ss",
                          )}
                        </td>
                        <td>
                          <Dropdown
                            actions={getUserActions(category)}
                            onSelect={(action) =>
                              handleAction(action, category)
                            }
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
            />
          </div>
        )}
      </div>
      {isAddCategoryOpen && (
        <AddBlogCategory
          onClose={() => setIsAddCategoryOpen(false)}
          isEditMode={isEditMode}
          form={form}
          onSubmit={onSubmit}
        />
      )}
      {isDeleteDialogOpen && (
        <DeleteBlogCategory
          onClose={() => setIsDeleteDialogOpen(false)}
          onDelete={confirmDelete}
        />
      )}
    </>
  );
}
