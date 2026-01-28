"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./youtube.module.scss";
import AddyoutubeVideo from "./addyoutubeVideo";
import UserHeader from "@/components/userHeader";
import youtube from "../../../public/assets/images/youtube.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { createYoutube, getAllYoutube } from "@/api/youtube";
import { uploadImage } from "@/api/course";
import Image from "next/image";
import { toast } from "sonner";
import Dropdown from "@/components/dropdown";
import EditIcon from "../../../public/assets/icons/Edit.svg";
import DeleteIcon from "../../../public/assets/icons/Delete.svg";
import PagePagination from "@/components/pagePagination";
import NoDataFound from "@/components/noDataFound";
const PlusIcon = "/assets/icons/plus.svg";

const ytUrlRegex =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[A-Za-z0-9_-]{11}([&?].*)?$/;

const formSchema = z.object({
  description: z
    .string()
    .min(1, "Description is required")
    .max(120, "Description must be at most 120 characters"),
  videoUrl: z
    .string()
    .url("Must be a valid URL")
    .refine((val) => ytUrlRegex.test(val), {
      message: "Please enter a valid YouTube URL (watch?v=... or youtu.be/...)",
    }),
  thumbnail: z
    .any()
    .refine((file) => file !== null && file !== undefined, {
      message: "Thumbnail is required",
    })
    .refine(
      (file) =>
        typeof file === "string" ||
        (file instanceof File && file.type.startsWith("image/")),
      {
        message: "Please upload a valid image file",
      },
    )
    .refine(
      (file) => {
        if (typeof file === "string") return true; // existing URL allowed when editing
        if (file instanceof File) return file.size <= 1 * 1024 * 1024;
        return true;
      },
      {
        message: "Image size must be less than 1MB",
      },
    ),
});
export default function Youtube() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      videoUrl: "",
      thumbnail: null,
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = form;

  // Get the current thumbnail value (either URL or File)
  const thumbnailFile = watch("thumbnail");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Fetch list
  const fetchList = async () => {
    try {
      setIsFetching(true);
      const res = await getAllYoutube({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
      });
      // expecting response.payload.data like in previous examples
      const data = res?.payload?.data ?? res?.data ?? [];
      const pagination = res?.payload?.count ?? {};

      console.log("API Response:", res);
      console.log("Pagination data:", pagination);
      console.log("Data length:", data.length);

      setItems(data);

      // If backend provides pagination, use it. Otherwise, calculate from all data
      if (pagination) {
        setTotalItems(pagination);
        setTotalPages(Math.ceil(pagination / itemsPerPage));
      } else {
        setTotalItems(data.length);
        const hasMorePages = data.length === itemsPerPage;
        setTotalPages(hasMorePages ? currentPage + 1 : currentPage);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch YouTube items");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [currentPage, itemsPerPage, searchTerm]);

  // Drag & drop handlers for thumbnail
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("File must be an image (JPEG, PNG, etc.)");
      return;
    }

    // Validate file size
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size must be less than 1MB");
      return;
    }

    try {
      setIsUploading(true);
      // Set preview immediately
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Upload the image
      const response = await uploadImage(file);

      if (response?.success && response?.payload) {
        // Set the thumbnail URL in the form
        setValue("thumbnail", response.payload, { shouldValidate: true });
        toast.success("Thumbnail uploaded successfully");
      } else {
        throw new Error("Failed to upload thumbnail");
      }
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      setImagePreview(null);
      toast.error("Failed to upload thumbnail");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("File must be an image (JPEG, PNG, etc.)");
      return;
    }

    // Validate file size
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size must be less than 1MB");
      return;
    }

    try {
      setIsUploading(true);
      // Set preview immediately
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Upload the image
      const response = await uploadImage(file);

      if (response?.success && response?.payload) {
        // Set the thumbnail URL in the form
        setValue("thumbnail", response.payload, { shouldValidate: true });
        toast.success("Thumbnail uploaded successfully");
      } else {
        throw new Error("Failed to upload thumbnail");
      }
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      setImagePreview(null);
      toast.error("Failed to upload thumbnail");
    } finally {
      setIsUploading(false);
    }
  };

  const openFileDialog = () => fileInputRef.current?.click();

  const removeThumbnail = () => {
    setValue("thumbnail", null, { shouldValidate: true });
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    // Revoke the object URL to avoid memory leaks
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  const onSubmit = async (data) => {
    console.log("data", data);

    setIsLoading(true);

    try {
      let requestData = {};

      if (isEditMode && currentId) {
        // In edit mode, only include changed fields
        const originalItem = items.find((item) => item._id === currentId);
        if (!originalItem) {
          throw new Error("Original item not found");
        }

        // Compare each field and only include if changed
        if (data.description !== originalItem.description) {
          requestData.description = data.description;
        }

        if (data.videoUrl !== originalItem.videoUrl) {
          requestData.videoUrl = data.videoUrl;
        }

        if (data.thumbnail && data.thumbnail !== originalItem.thumbnail) {
          requestData.thumbnail = data.thumbnail;
        }

        // Only proceed with update if there are changes
        if (Object.keys(requestData).length > 0) {
          await updateYoutube(currentId, requestData);
          toast.success("YouTube item updated successfully");
        } else {
          toast.info("No changes detected");
          setIsOpen(false);
          return;
        }
      } else {
        // For new items, include all fields
        requestData = {
          description: data.description,
          videoUrl: data.videoUrl,
          thumbnail: data.thumbnail,
        };
        await createYoutube(requestData);
        toast.success("YouTube item created successfully");
      }

      setIsOpen(false);
      reset({ description: "", videoUrl: "", thumbnail: null });
      await fetchList();
    } catch (error) {
      console.error("Error saving YouTube item:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to save item";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Edit
  const handleEdit = (item) => {
    setIsEditMode(true);
    setCurrentId(item._id);

    if (item.thumbnail) {
      setImagePreview(item.thumbnail);
    }

    reset({
      description: item.description,
      videoUrl: item.videoUrl,
      thumbnail: item.thumbnail ?? null,
    });
    setIsOpen(true);
  };

  // Delete
  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setIsDeleting(true);
      await deleteYoutube(itemToDelete);
      toast.success("Deleted successfully");
      setItems((prev) => prev.filter((p) => p._id !== itemToDelete));
      setDeleteDialogOpen(false);
      fetchList();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  // Create new
  const handleCreateNew = () => {
    setIsEditMode(false);
    setCurrentId(null);
    setImagePreview(null);
    reset({ description: "", videoUrl: "", thumbnail: null });
    setIsOpen(true);
  };

  const getActions = () => [
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
  const handleAction = (action, customer) => {
    if (action === "edit") handleEdit(customer);
    if (action === "delete") {
      handleDeleteClick(customer);
    }
  };

  // Display data directly from backend
  const displayItems = items;

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <>
      <UserHeader
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value.trimStart())}
        buttonText="Add Video"
        onClick={handleCreateNew}
        icon={PlusIcon}
        placeholder="Search Video"
        HeaderText="Youtube"
        DescriptionText="Add, remove or update YouTube videos"
      />
      <div className={styles.youtubePageAlignment}>
        <div className={styles.grid}>
          {displayItems?.length > 0 ? (
            displayItems?.map((item, index) => {
              return (
                <div className={styles.gridItems} key={index}>
                  <div className={styles.image}>
                    <Image
                      width={1000}
                      height={1000}
                      src={item?.thumbnail}
                      alt={item?.description}
                    />
                    {/* <div className={styles.playButtonOverlay}>
                    <Image
                      width={60}
                      height={60}
                      src={youtube}
                      alt="Play on YouTube"
                      className={styles.playButton}
                    />
                  </div> */}
                  </div>
                  <div className={styles.title}>
                    <span className={styles.titleText}>
                      {item?.description || "N/A"}
                    </span>
                    <div className={styles.dropdownContainer}>
                      <Dropdown
                        actions={getActions(item)}
                        onSelect={(action) => handleAction(action, item)}
                      />
                    </div>
                  </div>
                  <a
                    href={item.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.videoLink}
                    onClick={(e) => e.stopPropagation()}
                  ></a>
                </div>
              );
            })
          ) : (
            <NoDataFound />
          )}
        </div>
      </div>
      {isOpen && (
        <AddyoutubeVideo
          onClose={() => setIsOpen(false)}
          isEditMode={isEditMode}
          currentId={currentId}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
          openFileDialog={openFileDialog}
          imagePreview={imagePreview}
          isUploading={isUploading}
          onSubmit={onSubmit}
          handleSubmit={handleSubmit}
          register={register}
          errors={errors}
          setValue={setValue}
          removeThumbnail={removeThumbnail}
        />
      )}
      <PagePagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onPageChange={handlePageChange}
      />
    </>
  );
}
