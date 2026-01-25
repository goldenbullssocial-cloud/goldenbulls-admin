"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./bannerSection.module.scss";
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
import AddBanner from "./addBanner";
import ViewIcon from "../../../../public/assets/icons/Eye.svg";
import EditIcon from "../../../../public/assets/icons/Edit.svg";
import InactiveIcon from "../../../../public/assets/icons/InactiveUser.svg";
import DeleteIcon from "../../../../public/assets/icons/Delete.svg";
import Dropdown from "@/components/dropdown";
import DeleteBanner from "./deleteBanner";
// import { useForm } from "react-hook-form";
const PlusIcon = "/assets/icons/plus.svg";
const BannerImage = "/assets/images/banner1.png";
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

export default function BannerSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBannerId, setCurrentBannerId] = useState(null);
  const [banners, setBanners] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const fetchBanners = async () => {
    try {
      setIsFetching(true);
      const response = await getAllBanners();
      // Filter out banners where isOnboarding is true or not present
      const filteredBanners = (response?.payload?.data || []).filter(
        (banner) => banner.isOnboarding == false && banner.isBanner == true,
      );
      setBanners(filteredBanners);
    } catch (error) {
      toast.error("Failed to fetch banners");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const onSubmit = async () => {
    const data = form.getValues();
    console.log(data, "datata");

    try {
      setIsLoading(true);

      if (!data.image) throw new Error("Image file is required");

      let response;

      if (isEditMode && currentBannerId) {
        // update banner
        response = await updateBanner(currentBannerId, data.image);
      } else {
        // create banner
        response = await createBanner(data.image, false, true);
      }

      if (response?.success) {
        toast.success(
          isEditMode
            ? "Banner updated successfully!"
            : "Banner created successfully!",
        );
        fetchBanners();
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

  const handleEdit = (banner) => {
    setIsEditMode(true);
    setCurrentBannerId(banner._id);
    setValue("image", banner.image, { shouldValidate: true });
    setIsOpen(true);
  };

  const handleDeleteClick = (id) => {
    setBannerToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!bannerToDelete) return;

    try {
      setIsDeleting(true);
      const response = await deleteBanner(bannerToDelete);
      if (response?.success) {
        toast.success("Banner deleted successfully");
        fetchBanners();
      } else {
        toast.error("Failed to delete banner");
      }
    } catch {
      toast.error("Error deleting banner");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setBannerToDelete(null);
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
  const getBannerActions = () => [
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
  const handleAction = (action, banner) => {
    if (action === "edit") handleEdit(banner);

    if (action === "delete") {
      handleDeleteClick(banner?._id);
    }
  };
  return (
    <div className={styles.bannerSection}>
      <div className={styles.headerAlignment}>
        <h3>Banner Images of Mobile app</h3>
        <Button text="Add Banner" icon={PlusIcon} onClick={handleCreateNew} />
      </div>
      <div className={styles.imageGrid}>
        {banners.map((banner) => {
          return (
            <div className={styles.items} key={banner._id}>
              <div className={styles.imageContainer}>
                <img
                  className={styles.images}
                  src={banner.image}
                  alt="BannerImage"
                />
                <div className={styles.dropdownOverlay}>
                  <Dropdown
                    actions={getBannerActions(banner)}
                    onSelect={(action) => handleAction(action, banner)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {isOpen && (
        <AddBanner
          onClose={() => setIsOpen(false)}
          onSubmit={onSubmit}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
          openFileDialog={openFileDialog}
          imageFile={imageFile}
          removeImage={removeImage}
          isDragging={isDragging}
        />
      )}
      {deleteDialogOpen && (
        <DeleteBanner
          onClose={() => setDeleteDialogOpen(false)}
          onDelete={confirmDelete}
        />
      )}
    </div>
  );
}
