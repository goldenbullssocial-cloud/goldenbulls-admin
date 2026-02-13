"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./whoweareSection.module.scss";
import Button from "@/components/button";
import { toast } from "sonner";
import z from "zod";
import {
  createBanner,
  deleteBanner,
  getAllBanners,
  updateBanner,
} from "@/api/banner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AddWhoweare from "./addWhoweare";
import ViewIcon from "../../../../public/assets/icons/Eye.svg";
import EditIcon from "../../../../public/assets/icons/Edit.svg";
import InactiveIcon from "../../../../public/assets/icons/InactiveUser.svg";
import DeleteIcon from "../../../../public/assets/icons/Delete.svg";
import Dropdown from "@/components/dropdown";
import DeleteWhoweare from "./deleteWhoweare";
import PagePagination from "@/components/pagePagination";
import NoDataFound from "@/components/noDataFound";
import CommonLoader from "@/components/commonLoader";
import BannerSkeleton from "@/components/bannerSkeleton";
const PlusIcon = "/assets/icons/plus.svg";
const WhoweareImage = "/assets/images/whoweare1.png";
const formSchema = z.object({
  image: z
    .any()
    .refine((file) => file !== undefined && file !== null, {
      message: "Please upload a valid image file",
    })
    .refine(
      (file) => {
        if (file === null || file === undefined) return false;
        if (typeof file === "string") return true;
        return file.size <= 1 * 1024 * 1024;
      },
      { message: "Image size must be under 1MB" },
    ),
});

export default function WhoweareSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentWhoweareId, setCurrentWhoweareId] = useState(null);
  const [whoweareImages, setWhoweareImages] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [whoweareToDelete, setWhoweareToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 4;

  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { image: null },
  });

  const {
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;
  const imageFile = watch("image");

  const fetchWhoweareImages = async (page = 1) => {
    try {
      setIsFetching(true);
      const response = await getAllBanners(page, itemsPerPage);
      // Filter for whoweare images where isWhoWeare is true
      const filteredWhoweare = (response?.payload?.data || []).filter(
        (image) => image.isWhoWeare == true,
      );
      setWhoweareImages(filteredWhoweare);

      const totalCount = response?.payload?.count || 0;
      const calculatedTotalPages = Math.ceil(totalCount / itemsPerPage);

      setTotalPages(calculatedTotalPages);
      setTotalItems(totalCount);
      setCurrentPage(page);
    } catch (error) {
      toast.error("Failed to fetch whoweare images");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchWhoweareImages();
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      let response;

      if (isEditMode && currentWhoweareId) {
        // update whoweare image
        response = await updateBanner(currentWhoweareId, data.image);
      } else {
        // create whoweare image with isWhoWeare: true, isBanner: false
        response = await createBanner(data.image, false, false, true);
      }

      if (response?.success) {
        toast.success(
          isEditMode
            ? "Whoweare image updated successfully!"
            : "Whoweare image created successfully!",
        );
        fetchWhoweareImages();
        setIsOpen(false);
        reset();
      } else {
        toast.error(response?.message || "Operation failed");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (whoweare) => {
    setIsEditMode(true);
    setCurrentWhoweareId(whoweare._id);
    setValue("image", whoweare.image, { shouldValidate: true });
    setIsOpen(true);
  };

  const handleDeleteClick = (id) => {
    setWhoweareToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!whoweareToDelete) return;

    try {
      setIsDeleting(true);
      const response = await deleteBanner(whoweareToDelete);
      if (response?.success) {
        toast.success("Whoweare image deleted successfully");
        fetchWhoweareImages();
      } else {
        toast.error("Failed to delete whoweare image");
      }
    } catch {
      toast.error("Error deleting whoweare image");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setWhoweareToDelete(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/"))
      setValue("image", file, { shouldValidate: true });
    if (file && file.size > 1 * 1024 * 1024) {
      setValue("image", null, { shouldValidate: true });
      toast.error("Image size must be less than 1MB");
      return;
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/"))
      setValue("image", file, { shouldValidate: true });
  };
  const removeImage = () => setValue("image", null, { shouldValidate: true });
  const openFileDialog = () => fileInputRef.current?.click();

  const handleCreateNew = () => {
    reset({ image: null });
    setIsEditMode(false);
    setIsOpen(true);
  };
  const getWhoweareActions = () => [
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
  const handleAction = (action, whoweare) => {
    if (action === "edit") handleEdit(whoweare);

    if (action === "delete") {
      handleDeleteClick(whoweare?._id);
    }
  };
  return (
    <div className={styles.whoweareSection}>
      <div className={styles.headerAlignment}>
        <h3>Who We Are Images</h3>
        <Button text="Add Image" icon={PlusIcon} onClick={handleCreateNew} />
      </div>
      {isFetching ? (
        <BannerSkeleton count={4} />
      ) : whoweareImages?.length > 0 ? (
        <div className={styles.imageGrid}>
          {whoweareImages.map((whoweare) => {
            return (
              <div className={styles.items} key={whoweare._id}>
                <div className={styles.imageContainer}>
                  <img
                    className={styles.images}
                    src={whoweare.image}
                    alt="WhoweareImage"
                  />
                  <div className={styles.dropdownOverlay}>
                    <Dropdown
                      dark
                      actions={getWhoweareActions(whoweare)}
                      onSelect={(action) => handleAction(action, whoweare)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // <NoDataFound />
        <></>
      )}
      {isOpen && (
        <AddWhoweare
          onClose={() => setIsOpen(false)}
          onSubmit={handleSubmit(onSubmit)}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
          openFileDialog={openFileDialog}
          imageFile={imageFile}
          removeImage={removeImage}
          isDragging={isDragging}
          errors={errors}
          isLoading={isLoading}
        />
      )}
      {deleteDialogOpen && (
        <DeleteWhoweare
          onClose={() => setDeleteDialogOpen(false)}
          onDelete={confirmDelete}
        />
      )}
      <PagePagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onPageChange={fetchWhoweareImages}
      />
    </div>
  );
}
