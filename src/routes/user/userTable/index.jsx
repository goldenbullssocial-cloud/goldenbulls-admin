"use client";
import React, { useState, useEffect } from "react";
import styles from "./userTable.module.scss";
import ThreeMenuIcon from "@/icons/threeMenuIcon";
import PagePagination from "@/components/pagePagination";
import {
  deleteCustomer,
  getCustomers,
  createCustomer,
  setCustomerStatus,
  updateCustomer,
} from "@/api/customer";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ViewIcon from "../../../../public/assets/icons/Eye.svg";
import EditIcon from "../../../../public/assets/icons/Edit.svg";
import InactiveIcon from "../../../../public/assets/icons/InactiveUser.svg";
import DeleteIcon from "../../../../public/assets/icons/Delete.svg";
import Dropdown from "@/components/dropdown";
import UserDetailsModal from "../userDetailsModal";
import DeleteUser from "../deleteUser";
import EditUserDetails from "../editUserDetails";
import StatusModal from "../statusModal";
import UserHeader from "@/components/userHeader";

// Define the form schema
const customerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  gender: z.enum(["male", "female", "other"]).default("male"),
  birthday: z.date().optional(),
  location: z.string().optional(),
  // roleId: z.string().optional(),
});

export default function UserTable() {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const form = useForm({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      gender: "male",
      birthday: undefined,
      location: "",
      // roleId: "",
    },
  });

  const fetchCustomersData = async () => {
    try {
      setIsSearching(true);
      const response = await getCustomers({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
      });

      if (response.success) {
        const { data, count } = response.payload;
        setCustomers(data);
        setTotalItems(count);
        setTotalPages(Math.ceil(count / itemsPerPage));
        setError(null);
      } else {
        setError("Failed to fetch customers");
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError("An error occurred while fetching customers");
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput.trimStart());
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchCustomersData();
  }, [currentPage, itemsPerPage, searchTerm]);

  // useEffect(() => {
  //   const style = document.createElement("style");
  //   style.textContent = scrollbarStyles;
  //   document.head.appendChild(style);
  //   document.head.removeChild(style);
  // }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1); // Reset to first page on new search
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [searchInput]);

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    form.reset({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      gender: (customer.gender || "").toLowerCase(),
      birthday:
        customer.birthday && !isNaN(new Date(customer.birthday).getTime())
          ? new Date(customer.birthday)
          : undefined,
      location: customer.location,
      // roleId: customer.roleId._id,
    });
    setIsEditMode(true);
    setIsAddCustomerOpen(true);
  };

  const handleDeleteClick = (customer) => {
    setSelectedCustomer({
      id: customer._id,
      name: customer.firstName + " " + customer.lastName,
      currentStatus: customer.isActive,
    });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCustomer) return;

    try {
      setDeletingId(selectedCustomer.id);
      await deleteCustomer(selectedCustomer.id);
      setDeleteDialogOpen(false);
      toast.success(`Customer "${selectedCustomer.name}" has been deleted.`);
      await fetchCustomersData();
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Failed to delete customer. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusToggleClick = (customer) => {
    setSelectedCustomer({
      id: customer._id,
      name: customer.firstName + " " + customer.lastName,
      currentStatus: customer.isActive,
    });
    setStatusDialogOpen(true);
  };

  const confirmStatusToggle = async () => {
    if (!selectedCustomer || statusLoading) return;

    try {
      setStatusLoading(true);
      const newStatus = !selectedCustomer.currentStatus;

      await setCustomerStatus(selectedCustomer.id, newStatus);

      // Update the customers list with the new status
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer._id === selectedCustomer.id
            ? { ...customer, isActive: newStatus }
            : customer,
        ),
      );

      // Update the selected customer status for the dialog
      setSelectedCustomer((prev) =>
        prev ? { ...prev, currentStatus: newStatus } : null,
      );

      toast.success(
        `Customer "${selectedCustomer.name}" has been ${
          newStatus ? "activated" : "deactivated"
        }.`,
      );
    } catch (error) {
      console.error("Error updating customer status:", error);
      toast.error("Failed to update customer status. Please try again.");
    } finally {
      setStatusLoading(false);
      setStatusDialogOpen(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (isEditMode && editingCustomer) {
        await updateCustomer(editingCustomer._id, data);
        await fetchCustomersData();
        form.reset();
        setIsAddCustomerOpen(false);
        setIsEditMode(false);
        setEditingCustomer(null);

        toast.success(`Customer "${data.name}" has been updated.`);
      } else {
        const customerData = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          gender: data.gender,
          birthday: data.birthday.toISOString(),
          location: data.location,
          // roleId: data.roleId,
          password: "defaultPassword123!",
          confirmPassword: "defaultPassword123!",
        };

        await createCustomer(customerData);
        await fetchCustomersData();

        form.reset();
        setIsAddCustomerOpen(false);

        toast.success(`New customer "${data.name}" has been added.`);
      }
    } catch (error) {
      console.error("Error saving customer:", error);
      toast.error(
        `Failed to ${isEditMode ? "update" : "add"} customer. Please try again.`,
      );
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === "all") return matchesSearch;
    return (
      matchesSearch &&
      (statusFilter === "active" ? customer.isActive : !customer.isActive)
    );
  });

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value.trimStart());
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }
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
      <UserHeader value={searchInput} onChange={handleSearchInputChange} />

      <div className={styles.userTableAlignment}>
        <div className={styles.tableUi}>
          <table>
            <thead>
              <tr>
                <th>Sr no.</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Referred By</th>
                <th>Reference ID</th>
                <th>Join Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer, index) => {
                const joinDate = new Date(customer.createdAt);
                const formattedDate = joinDate.toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                });

                return (
                  <tr key={customer._id || index}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>
                      {customer?.firstName && customer?.lastName
                        ? `${customer.firstName} ${customer.lastName}`
                        : customer?.firstName ||
                          customer?.lastName ||
                          "N/A"}{" "}
                    </td>
                    <td>
                      {customer.gender
                        ? customer.gender.charAt(0).toUpperCase() +
                          customer.gender.slice(1)
                        : "N/A"}
                    </td>
                    <td>{customer.email || "N/A"}</td>
                    <td>{customer.phone || "N/A"}</td>
                    <td>{customer.referredBy || "N/A"}</td>
                    <td>{customer.referralCode || "N/A"}</td>
                    <td>{formattedDate}</td>
                    <td>
                      <span
                        className={`${styles.status} ${customer.isActive ? styles.active : styles.inactive}`}
                      >
                        {customer.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <Dropdown
                        actions={getUserActions(customer.isActive)}
                        onSelect={(action) => handleAction(action, customer)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {isViewModalOpen && (
          <UserDetailsModal
            customer={viewingCustomer}
            onClose={() => {
              setIsViewModalOpen(false);
            }}
          />
        )}
        {deleteDialogOpen && (
          <DeleteUser
            customer={selectedCustomer}
            onClose={() => setDeleteDialogOpen(false)}
            onDelete={confirmDelete}
          />
        )}
        {isEditMode && (
          <EditUserDetails
            customer={editingCustomer}
            onClose={() => setIsEditMode(false)}
            isEditMode={isEditMode}
            onSubmit={onSubmit}
          />
        )}
        {statusDialogOpen && (
          <StatusModal
            customer={selectedCustomer}
            onClose={() => setStatusDialogOpen(false)}
            onStatusChange={confirmStatusToggle}
            statusLoading={statusLoading}
          />
        )}
        <PagePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </>
  );
}
