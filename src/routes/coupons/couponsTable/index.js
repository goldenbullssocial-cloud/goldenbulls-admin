"use client";
import React, { useState, useEffect } from "react";
import styles from "./couponsTable.module.scss";
import ThreeMenuIcon from "@/icons/threeMenuIcon";
import PagePagination from "@/components/pagePagination";
import UserHeader from "@/components/userHeader";
import { useForm } from "react-hook-form";
import { deleteCoupon, getAllCoupon, updateCoupon } from "@/api/coupon";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import ViewIcon from "../../../../public/assets/icons/Eye.svg";
import EditIcon from "../../../../public/assets/icons/Edit.svg";
import InactiveIcon from "../../../../public/assets/icons/InactiveUser.svg";
import DeleteIcon from "../../../../public/assets/icons/Delete.svg";
import Dropdown from "@/components/dropdown";
import { createCoupon } from "@/api/coupon";
import AddDiscountCoupon from "../addDiscountCoupon";
import { toast } from "sonner";
import DeleteCoupon from "../deleteCoupon";
import NoDataFound from "@/components/noDataFound";
import CommonLoader from "@/components/commonLoader";
const PlusIcon = "/assets/icons/plus.svg";

const couponFormSchema = z.object({
  couponCode: z
    .string()
    .min(3, "Coupon code must be at least 3 characters")
    .max(20, "Coupon code must be at most 20 characters")
    .regex(
      /^[A-Z0-9-_]+$/,
      "Coupon code can only contain uppercase letters, numbers, hyphens, and underscores",
    ),

  discount: z
    .string()
    .min(1, "Discount is required")
    .regex(/^[1-9]\d*$/, "Discount must be a whole number")
    .refine((val) => parseInt(val, 10) >= 1 && parseInt(val, 10) <= 99, {
      message: "Discount must be between 1% and 99%",
    }),

  expiryDate: z
    .date({
      required_error: "Expiry date is required.",
      invalid_type_error: "Please enter a valid date",
    })
    .min(new Date(), "Expiry date must be in the future"),

  usageLimit: z
    .string()
    .min(1, "Usage limit is required")
    .regex(/^[1-9]\d*$/, "Usage limit must be a positive number")
    .refine((val) => parseInt(val) >= 1 && parseInt(val) <= 10000, {
      message: "Usage limit must be between 1 and 10,000",
    }),
});

export default function CouponsTable() {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [currentCouponId, setCurrentCouponId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      couponCode: "",
      discount: "",
      expiryDate: undefined, // no default; force user to pick
      usageLimit: "",
    },
  });

  // Mock data - replace with actual API calls
  const fetchCouponsData = async () => {
    try {
      setIsLoading(true);
      const response = await getAllCoupon({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
      });

      setCoupons(response.payload.data);
      setTotalItems(response.payload.data.length);
      setTotalPages(Math.ceil(response.payload.totalPages / itemsPerPage));
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCouponsData();
  }, [currentPage, itemsPerPage]);

  const handleEdit = (coupon) => {
    setIsEditMode(true);
    setCurrentCouponId(coupon._id);
    setEditingCoupon(coupon);
    form.reset({
      couponCode: coupon.couponCode,
      discount: String(coupon.discount),
      expiryDate: new Date(coupon.expiryDate),
      usageLimit: String(coupon.usageLimit),
    });
    setIsAddCouponOpen(true);
  };

  const handleDeleteClick = (coupon) => {
    setCouponToDelete(coupon);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!couponToDelete) return;

    try {
      setIsDeleting(true);
      await deleteCoupon(couponToDelete._id);
      setCoupons(coupons.filter((c) => c._id !== couponToDelete._id));
      toast.success("Coupon deleted successfully");
      setIsDeleteDialogOpen(false);
      setCouponToDelete(null);
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error("Failed to delete coupon");
    } finally {
      setIsDeleting(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      // Ensure expiryDate is sent as YYYY-MM-DD
      const payload = {
        couponCode: data.couponCode,
        discount: data.discount,
        usageLimit: data.usageLimit,
        expiryDate: format(data.expiryDate, "yyyy-MM-dd"),
      };

      if (isEditMode && currentCouponId) {
        await updateCoupon(currentCouponId, payload);
        toast.success("Coupon updated successfully!");
      } else {
        await createCoupon(payload);
        toast.success("Coupon created successfully!");
      }

      setIsAddCouponOpen(false);
      form.reset();
      setIsEditMode(false);
      setEditingCoupon(null);
      await fetchCouponsData();
    } catch (error) {
      console.error("Error saving coupon:", error);
      toast.error("Failed to save coupon");
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

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.couponCode.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddNew = () => {
    setIsEditMode(false);
    setEditingCoupon(null);
    form.reset({
      couponCode: "",
      discount: "",
      expiryDate: undefined,
      usageLimit: "",
    });
    setIsAddCouponOpen(true);
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
  const handleAction = (action, coupon) => {
    if (action === "edit") handleEdit(coupon);
    if (action === "delete") {
      handleDeleteClick(coupon);
    }
  };
  return (
    <>
      <UserHeader
        icon={PlusIcon}
        HeaderText="Coupons"
        DescriptionText="Create and control discount codes and promotional offers"
        buttonText="Add Coupons"
        onClick={() => {
          form.reset({
            couponCode: "",
            discount: "",
            expiryDate: undefined,
            usageLimit: "",
          });
          setIsEditMode(false);
          setEditingCoupon(null);
          setIsAddCouponOpen(true);
        }}
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
                    <th>Coupon Code</th>
                    <th>Discount</th>
                    <th>Usage Limit</th>
                    <th>Usage Count</th>
                    <th>Created Date</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoupons?.length > 0 ? (
                    filteredCoupons.map((coupon, index) => (
                      <tr>
                        <td>{index + 1}</td>
                        <td>{coupon.couponCode}</td>
                        <td>{coupon.discount}%</td>
                        <td>{coupon.usageLimit}</td>
                        <td>{coupon.usageCount}</td>
                        <td>
                          {format(
                            new Date(coupon.createdAt),
                            "dd/MM/yyyy, HH:mm:ss",
                          )}
                        </td>
                        <td>
                          {format(
                            new Date(coupon.expiryDate),
                            "dd/MM/yyyy, HH:mm:ss",
                          )}
                        </td>
                        <td>
                          {new Date(coupon.expiryDate) < new Date() ? (
                            <span className={styles.red}>Inactive</span>
                          ) : (
                            <span className={styles.green}>Active</span>
                          )}
                        </td>
                        <td>
                          <Dropdown
                            actions={getUserActions(coupon.isActive)}
                            onSelect={(action) => handleAction(action, coupon)}
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
      {isAddCouponOpen && (
        <AddDiscountCoupon
          onClose={() => setIsAddCouponOpen(false)}
          isEditMode={isEditMode}
          form={form}
          onSubmit={onSubmit}
        />
      )}
      {isDeleteDialogOpen && (
        <DeleteCoupon
          onClose={() => setIsDeleteDialogOpen(false)}
          onDelete={confirmDelete}
        />
      )}
    </>
  );
}
