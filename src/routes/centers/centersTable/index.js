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
import Dropdown from "@/components/dropdown";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import UserHeader from "@/components/userHeader";
import AddCenter from "../addCenter";
import { toast } from "sonner";

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
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [selectedStateId, setSelectedStateId] = useState(null);
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

      setCenters(response.payload.data);
      setTotalItems(response.payload.count);
      setTotalPages(response.payload.totalPages);
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
          name: data.name,
          googleMapsLink: data.googleMapsLink,
          country: data.country,
          state: data.state,
          city: data.city,
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
      key: "toggleStatus",
      label: isActive ? "Inactive" : "Active",
      icon: InactiveIcon,
    },
    {
      key: "delete",
      label: "Delete",
      icon: DeleteIcon,
      variant: "danger",
    },
  ];
  const handleAction = (action, customer) => {
    if (action === "view") {
      setViewingCustomer(customer);
      setIsViewModalOpen(true);
    }
    if (action === "edit") handleEdit(customer);
    if (action === "toggleStatus") handleStatusToggleClick(customer);
    if (action === "delete") {
      handleDeleteClick(customer);
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
        onClick={() => setIsAddCenterOpen(true)}
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
                    <td>{center.name}</td>
                    <td>{center.location}</td>
                    <td>{center.city}</td>
                    <td>{center.state}</td>
                    <td>{center.country}</td>
                    <td>{center.createdAt}</td>
                    <td>
                      <span>{center.status}</span>
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
        <PagePagination />
      </div>
      {isAddCenterOpen && (
        <AddCenter
          isOpen={isAddCenterOpen}
          onClose={() => setIsAddCenterOpen(false)}
          onSave={onSubmit}
          selectedCountryId={selectedCountryId}
          selectedStateId={selectedStateId}
          onCityChange={(val) => {
            if (val) {
              field.onChange(val.name);
              form.clearErrors("city");
            }
          }}
          onCountryChange={(val) => {
            field.onChange(val.name);
            setSelectedCountryId(val.id);
            setSelectedStateId(null);
            form.setValue("state", "");
            form.setValue("city", "");
            form.clearErrors(["state", "city"]);
          }}
          onStateChange={(val) => {
            field.onChange(val?.name || "");
            setSelectedStateId(val?.id || null);
            form.setValue("city", "");
            form.clearErrors(["state", "city"]);
          }}
        />
      )}
    </>
  );
}
