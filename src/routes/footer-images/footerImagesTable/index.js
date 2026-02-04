"use client";
import React, { useState, useEffect } from "react";
import styles from "./footerImagesTable.module.scss";
import PagePagination from "@/components/pagePagination";
import UserHeader from "@/components/userHeader";
import { useForm } from "react-hook-form";
import {
  getAllFooterImages,
  deleteFooterImage,
  updateFooterImage,
  addFooterImage,
} from "@/api/footerImages";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import EditIcon from "../../../../public/assets/icons/Edit.svg";
import DeleteIcon from "../../../../public/assets/icons/Delete.svg";
import Dropdown from "@/components/dropdown";
import AddFooterImage from "../addFooterImage";
import { toast } from "sonner";
import DeleteFooterImage from "../deleteFooterImage";
import { uploadImage } from "@/api/course";
import NoDataFound from "@/components/noDataFound";
import CommonLoader from "@/components/commonLoader";
const PlusIcon = "/assets/icons/plus.svg";

const footerImageFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters"),
  imageFile: z.any().refine((file) => file, "Image is required"),
});

export default function FooterImagesTable() {
  const [footerImages, setFooterImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const [isAddFooterImageOpen, setIsAddFooterImageOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingFooterImage, setEditingFooterImage] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [footerImageToDelete, setFooterImageToDelete] = useState(null);
  const [currentFooterImageId, setCurrentFooterImageId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const form = useForm({
    resolver: zodResolver(footerImageFormSchema),
    defaultValues: {
      title: "",
      imageFile: null,
    },
  });

  // Fetch footer images
  const fetchFooterImages = async () => {
    try {
      setIsLoading(true);
      const response = await getAllFooterImages();
      setFooterImages(response?.payload || []);
      setTotalItems(response?.payload?.length || 0);
      setTotalPages(Math.ceil((response?.payload?.length || 0) / itemsPerPage));
    } catch (error) {
      console.error("Error fetching footer images:", error);
      toast.error("Failed to load footer images");
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchFooterImages();
  }, [currentPage, itemsPerPage, debouncedSearch]);

  const handleEdit = (footerImage) => {
    setIsEditMode(true);
    setCurrentFooterImageId(footerImage?._id);
    setEditingFooterImage(footerImage);
    form.reset({
      title: footerImage?.title || "",
      imageFile: footerImage?.imageUrl || null,
    });
    setIsAddFooterImageOpen(true);
  };

  const handleDeleteClick = (footerImage) => {
    setFooterImageToDelete(footerImage);
    setIsDeleteDialogOpen(true);
  };

  const handleImageChange = (file) => {
    if (!file) {
      setImageFile(null);
      form.setValue("imageFile", null);
      form.trigger("imageFile");
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
    form.setValue("imageFile", file);
    form.trigger("imageFile");
  };

  const confirmDelete = async () => {
    if (!footerImageToDelete) return;

    try {
      setIsDeleting(true);
      await deleteFooterImage(footerImageToDelete?._id);
      setFooterImages(
        footerImages?.filter((img) => img?._id !== footerImageToDelete?._id),
      );
      toast.success("Footer image deleted successfully");
      setIsDeleteDialogOpen(false);
      setFooterImageToDelete(null);
    } catch (error) {
      console.error("Error deleting footer image:", error);
      toast.error("Failed to delete footer image");
    } finally {
      setIsDeleting(false);
    }
  };

  const onSubmit = async (data) => {
    console.log("data", data);

    try {
      setIsLoading(true);

      if (isEditMode && currentFooterImageId) {
        let requestData = {};
        let hasChanges = false;

        if (data?.title !== editingFooterImage?.title) {
          requestData.title = data.title;
          hasChanges = true;
        }

        if (imageFile) {
          try {
            const imageResponse = await uploadImage(imageFile);

            if (imageResponse?.success && imageResponse?.payload) {
              requestData.imageUrl = imageResponse.payload;
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

        if (hasChanges) {
          await updateFooterImage(currentFooterImageId, requestData);
          toast.success("Footer image updated successfully!");
        } else {
          toast.info("No changes detected");
          setIsAddFooterImageOpen(false);
          return;
        }
      } else {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formData.append(key, value);
          }
        });

        if (imageFile) {
          try {
            const imageResponse = await uploadImage(imageFile);

            if (imageResponse?.success && imageResponse?.payload) {
              formData.append("imageUrl", imageResponse.payload);
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

        await addFooterImage(formData);
        toast.success("Footer image created successfully!");
      }

      setIsAddFooterImageOpen(false);
      form.reset();
      setIsEditMode(false);
      setEditingFooterImage(null);
      await fetchFooterImages();
    } catch (error) {
      console.error("Error saving footer image:", error);
      toast.error(
        error?.response?.data?.message || "Failed to save footer image",
      );
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

  const filteredFooterImages = Array.isArray(footerImages)
    ? footerImages?.filter((img) =>
        img?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()),
      )
    : [];

  const handleAddNew = () => {
    setIsEditMode(false);
    setEditingFooterImage(null);
    form.reset({
      title: "",
      imageFile: null,
    });
    setIsAddFooterImageOpen(true);
  };

  const getFooterImageActions = () => [
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

  const handleAction = (action, footerImage) => {
    if (action === "edit") handleEdit(footerImage);
    if (action === "delete") handleDeleteClick(footerImage);
  };

  return (
    <>
      <UserHeader
        buttonText="Add Footer Image"
        onClick={handleAddNew}
        value={debouncedSearch}
        onChange={(e) => setSearchTerm(e.target.value.trimStart())}
        HeaderText="Footer Images"
        DescriptionText="View and control all footer images"
        icon={PlusIcon}
      />
      {isLoading ? (
        <CommonLoader />
      ) : (
        <div className={styles.footerImagesPageAlignment}>
          <div className={styles.footerImagesTableAlignment}>
            <div className={styles.tableUi}>
              <table>
                <thead>
                  <tr>
                    <th className={styles.indexCol}>Sr no.</th>
                    <th className={styles.imageCol}>Image</th>
                    <th className={styles.titleCol}>Title</th>
                    <th className={styles.dateCol}>Created Date</th>
                    <th className={styles.actionsCol}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFooterImages.length > 0 ? (
                    filteredFooterImages.map((footerImage, index) => (
                      <tr key={footerImage?._id}>
                        <td className={styles.indexCol}>{index + 1}</td>
                        <td className={styles.imageCol}>
                          <img
                            src={
                              footerImage?.imageUrl || "/assets/placeholder.png"
                            }
                            alt={footerImage?.title || "Footer Image"}
                          />
                        </td>
                        <td
                          className={`${styles.footerImageTitle} ${styles.cellContent}`}
                          title={footerImage?.title}
                        >
                          <div className={styles.truncate}>
                            {footerImage?.title || ""}
                          </div>
                        </td>

                        <td className={styles.dateCol}>
                          {format(
                            new Date(footerImage?.createdAt),
                            "MMM d, yyyy",
                          )}
                        </td>
                        <td className={styles.actionsCol}>
                          <Dropdown
                            actions={getFooterImageActions()}
                            onSelect={(action) =>
                              handleAction(action, footerImage)
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
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
      {isAddFooterImageOpen && (
        <AddFooterImage
          onClose={() => setIsAddFooterImageOpen(false)}
          isEditMode={isEditMode}
          form={form}
          onSubmit={onSubmit}
          handleImageChange={handleImageChange}
          editingFooterImage={editingFooterImage}
        />
      )}
      {isDeleteDialogOpen && (
        <DeleteFooterImage
          onClose={() => setIsDeleteDialogOpen(false)}
          onDelete={confirmDelete}
          isLoading={isDeleting}
          footerImageTitle={footerImageToDelete?.title || ""}
        />
      )}
    </>
  );
}
