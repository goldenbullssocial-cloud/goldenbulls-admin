"use client";
import React, { useEffect, useState } from "react";
import styles from "./centersTable.module.scss";
import PagePagination from "@/components/pagePagination";
import z from "zod";
import {
  createCenter,
  deleteCenter,
  getAllCenter,
  updateCenter,
} from "@/api/center";
import ViewIcon from "../../../../public/assets/icons/Eye.svg";
import EditIcon from "../../../../public/assets/icons/Edit.svg";
import InactiveIcon from "../../../../public/assets/icons/InactiveUser.svg";
import DeleteIcon from "../../../../public/assets/icons/Delete.svg";
import Dropdown from "@/components/dropdown";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import UserHeader from "@/components/userHeader";
import AddCenter from "../addCenter";
import { toast } from "sonner";
import CenterDetailsModal from "../centerDetailsModal";
import DeleteCenter from "../deleteCenter";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
};

const centerFormSchema = z
  .object({
    centerName: z
      .string()
      .min(3, "Center name must be at least 3 characters")
      .max(100, "Center name must be at most 100 characters"),

    location: z
      .string()
      .url("Location must be a valid URL (e.g., https://example.com)")
      .min(3, "Location must be at least 3 characters")
      .max(500, "Location link must be at most 500 characters"),

    country: z.string().min(1, "Please select a country"),
    state: z.string().min(1, "Please select a state"),
    city: z.string().min(1, "Please select a city"),
  })
  .refine(
    (data) => {
      if (data.state && !data.country) return false;
      return true;
    },
    {
      message: "Please select a country first",
      path: ["state"],
    },
  )
  .refine(
    (data) => {
      if (data.city && !data.state) return false;
      return true;
    },
    {
      message: "Please select a state first",
      path: ["city"],
    },
  );
export default function CentersTable() {
  const [centers, setCenters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAddCenterOpen, setIsAddCenterOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCenter, setEditingCenter] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [centerToDelete, setCenterToDelete] = useState(null);
  const [currentCenterId, setCurrentCenterId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [viewingCenter, setViewingCenter] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(centerFormSchema),
    defaultValues: {
      centerName: "",
      location: "",
      city: "",
      state: "",
      country: "",
    },
  });

  const fetchCentersData = async () => {
    try {
      setIsLoading(true);
      const response = await getAllCenter({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearchTerm,
      });

      setCenters(response.payload?.data || []);
      setTotalItems(response.payload?.totalRecords || 0);
      setTotalPages(response.payload?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching centers:", error);
      toast.error("Failed to fetch centers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 500); // 500ms delay

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  useEffect(() => {
    fetchCentersData();
  }, [currentPage, itemsPerPage, debouncedSearchTerm]);

  const handleEdit = (center) => {
    setIsEditMode(true);
    setCurrentCenterId(center._id);
    setEditingCenter(center);
    form.reset({
      centerName: center.centerName,
      location: center.location,
      city: center.city,
      state: center.state,
      country: center.country,
    });
    setIsAddCenterOpen(true);
  };

  const handleDeleteClick = (center) => {
    setCenterToDelete(center);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!centerToDelete) return;

    try {
      setIsDeleting(true);
      await deleteCenter(centerToDelete._id);
      setCenters(centers.filter((c) => c._id !== centerToDelete._id));
      toast.success("Center deleted successfully");
      setIsDeleteDialogOpen(false);
      setCenterToDelete(null);
      await fetchCentersData();
    } catch (error) {
      console.error("Error deleting center:", error);
      toast.error("Failed to delete center");
    } finally {
      setIsDeleting(false);
    }
  };

  const onSubmit = async (data) => {

    try {
      setIsLoading(true);
      const centerData = {
        centerName: data.centerName,
        location: data.location,
        country: data.country,
        state: data.state,
        city: data.city,
        // isActive: data.isActive || "true",
      };

      if (isEditMode && currentCenterId) {
        await updateCenter(currentCenterId, centerData);
        toast.success("Center updated successfully!");
      } else {
        await createCenter(centerData);
        toast.success("Center created successfully!");
      }

      setIsAddCenterOpen(false);
      form.reset();
      setIsEditMode(false);
      setEditingCenter(null);
      await fetchCentersData();
    } catch (error) {
      console.error("Error saving center:", error);
      toast.error(error.response?.data?.message || "Failed to save center");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCentersData();
  };

  const handleView = (center) => {
    setViewingCenter(center);
    setIsViewModalOpen(true);
  };

  const getUserActions = (isActive) => [
    {
      key: "view",
      label: "View",
      icon: ViewIcon,
    },
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
  const handleAction = (action, center) => {
    if (action === "view") handleView(center);
    if (action === "edit") handleEdit(center);
    if (action === "delete") {
      handleDeleteClick(center);
    }
  };

  return (
    <>
      <UserHeader
        type="search"
        inputType="Center"
        placeholder="Search Centers"
        onChange={(e) => setSearchTerm(e.target.value.trimStart())}
        value={searchTerm}
        buttonText="Add Center"
        onClick={() => {
          setIsAddCenterOpen(true);
          form.reset({
            centerName: "",
            location: "",
            city: "",
            state: "",
            country: "",
          });
          setIsEditMode(false);
          setEditingCenter(null);
        }}
      />
      <div className={styles.centersTableAlignment}>
        <div className={styles.tableUi}>
          <table>
            <thead>
              <tr>
                <th>Sr no.</th>
                <th>Name</th>
                <th>Location</th>
                <th>City</th>
                <th>State</th>
                <th>Country</th>
                <th>Date Created</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {centers.map((center, i) => {
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{center.centerName}</td>
                    <td>{center.location}</td>
                    <td>{center.city}</td>
                    <td>{center.state}</td>
                    <td>{center.country}</td>
                    <td>{formatDate(center.createdAt)}</td>
                    <td>
                      <span
                        className={`${styles.status} ${center.isActive ? styles.active : styles.inactive}`}
                      >
                        {center.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <Dropdown
                        actions={getUserActions(center.isActive)}
                        onSelect={(action) => handleAction(action, center)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <PagePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
        />
      </div>
      {isViewModalOpen && (
        <CenterDetailsModal
          center={viewingCenter}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}
      {isAddCenterOpen && (
        <AddCenter
          isEditMode={isEditMode}
          form={form}
          isOpen={isAddCenterOpen}
          isLoading={isLoading}
          onClose={() => {
            setIsAddCenterOpen(false);
            form.reset();
            setIsEditMode(false);
            setEditingCenter(null);
          }}
          onSubmit={onSubmit}
        />
      )}
      {isDeleteDialogOpen && (
        <DeleteCenter
          center={centerToDelete}
          onClose={() => setIsDeleteDialogOpen(false)}
          onDelete={confirmDelete}
        />
      )}
    </>
  );
}
