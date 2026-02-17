"use client";
import React, { useState, useEffect } from "react";
import styles from "./withdrawRequestsTable.module.scss";
import PagePagination from "@/components/pagePagination";
import ThreeMenuIcon from "@/icons/threeMenuIcon";
import UserHeader from "@/components/userHeader";
import { getUtility } from "@/api/utility";
import { updateUtility } from "@/api/utility";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { updateWithdrawalNotification } from "@/api/withdrawalNotification";
import { getWithdrawals, updateWithdrawalStatus } from "@/api/withdrawal";
import { format } from "date-fns";
import SettingsModal from "../settingsModal";
import StatusModal from "../statusModal";
import { getSocket } from "@/utils/webSocket";
import NoDataFound from "@/components/noDataFound";
import CommonLoader from "@/components/commonLoader";
import EditIcon from "../../../../public/assets/icons/Edit.svg";
import LockIcon from "../../../../public/assets/icons/lock.svg";
import Image from "next/image";
const settingIcon = "/assets/icons/settings.svg";
export default function WithdrawRequestsTable() {
  const [utilitySettings, setUtilitySettings] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [withdrawals, setWithdrawals] = useState([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [viewedWithdrawals, setViewedWithdrawals] = useState(new Set());

  // Edit Dialog State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingWithdrawal, setEditingWithdrawal] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [transactionId, setTransactionId] = useState("");

  // Modals
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);

  const [commissionDialogOpen, setCommissionDialogOpen] = useState(false);
  const [commissionPercent, setCommissionPercent] = useState("");
  const [selectedCommissionTarget, setSelectedCommissionTarget] =
    useState("all");

  const markAllAsRead = async () => {
    try {
      const result = await updateWithdrawalNotification();

      if (result?.error) {
        console.error("Failed to mark notifications as read:", result.message);
        return;
      }

      // Clear the viewed state since they're now marked as read
      setViewedWithdrawals(new Set());

      const socket = getSocket();
      if (socket) {
        socket.emit("check-withdrawal-request", {});
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      // Don't throw the error to prevent automatic logout
    }
  };
  const pathname = usePathname();

  useEffect(() => {
    return () => {
      const isLeavingPage = !window.location.pathname.includes("withdraw");
      if (isLeavingPage) {
        markAllAsRead();
      }
    };
  }, [pathname]);

  const getRowClassName = (withdrawal) => {
    const isUnread = !withdrawal.isRead;
    return isUnread ? styles.unreadRow : "";
  };

  useEffect(() => {
    const fetchUtilitySettings = async () => {
      try {
        const response = await getUtility();
        if (response?.payload) {
          setUtilitySettings(response.payload);
        }
      } catch (error) {
        console.error("Error fetching utility settings:", error);
        toast.error("Failed to load utility settings");
      }
    };

    fetchUtilitySettings();
  }, []);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchTerm.trimStart());
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const getFilteredWithdrawals = (allWithdrawals) => {
    let filtered = [...allWithdrawals];

    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((w) => w.status === statusFilter);
    }

    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (w) =>
          w.name?.toLowerCase().includes(searchLower) ||
          w.email?.toLowerCase().includes(searchLower) ||
          w.phone?.toLowerCase().includes(searchLower) ||
          w.transactionId?.toLowerCase().includes(searchLower) ||
          w.amount?.toLowerCase().includes(searchLower) ||
          w.walletId?.toLowerCase().includes(searchLower),
      );
    }

    return filtered;
  };

  const fetchWithdrawals = async (page = 1) => {
    try {
      setIsFetching(true);

      const res = await getWithdrawals({
        page,
        limit: itemsPerPage,
        search: debouncedSearch || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });

      const allWithdrawals = res.payload?.data || [];
      setWithdrawals(allWithdrawals);

      // Calculate pagination based on the API response
      const totalCount = res.payload?.count || 0;
      const calculatedTotalPages = Math.ceil(totalCount / itemsPerPage);

      setTotalPages(calculatedTotalPages);
      setTotalItems(totalCount);
      setCurrentPage(page);
    } catch (err) {
      console.error("fetchWithdrawals error", err);
      toast.error("Failed to load withdrawals");
    } finally {
      setIsFetching(false);
    }
  };

  // Remove client-side pagination since we're using server-side pagination
  // const getPaginatedWithdrawals = () => { ... }

  // Remove client-side pagination effects since we're using server-side pagination

  useEffect(() => {
    fetchWithdrawals(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch when page, search, or filter changes
  useEffect(() => {
    fetchWithdrawals(currentPage);
  }, [currentPage, statusFilter, debouncedSearch]);

  // Commission modal behaviour
  const openCommissionForAll = () => {
    setSelectedCommissionTarget("all");
    setCommissionDialogOpen(true);
    setCommissionPercent("");
  };

  // Open edit dialog for withdrawal
  const handleEditClick = (withdrawal) => {
    // Prevent editing if withdrawal is already approved or rejected
    if (withdrawal.status === "approved" || withdrawal.status === "rejected") {
      toast.info(`Cannot edit withdrawal with status: ${withdrawal.status}`);
      return;
    }

    setEditingWithdrawal(withdrawal);
    setEditStatus(withdrawal.status);
    setTransactionId(withdrawal.transactionId || "");
    setEditDialogOpen(true);
  };

  // Form validation state
  const [formErrors, setFormErrors] = useState({
    status: "",
    transactionId: "",
  });

  // Validate form fields
  const validateForm = () => {
    const errors = {};

    // Validate status
    if (!editStatus) {
      errors.status = "Please select a status";
    }

    // Validate transaction ID if status is approved
    if (editStatus === "approved" && !transactionId?.trim()) {
      errors.transactionId =
        "Transaction ID is required for approved withdrawals";
    } else if (editStatus === "approved" && transactionId?.trim().length < 5) {
      errors.transactionId = "Transaction ID must be at least 5 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleUpdateWithdrawal = async () => {
    if (!editingWithdrawal) return;

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoadingAction(true);

      // Prepare the update data with required fields
      const updateData = {
        name: editingWithdrawal.name,
        email: editingWithdrawal.email,
        phone: editingWithdrawal.phone,
        amount: editingWithdrawal.amount,
        walletId: editingWithdrawal.walletId,
        chain: editingWithdrawal.chain,
        accountNumber: editingWithdrawal.accountNumber,
        ifscCode: editingWithdrawal.ifscCode,
        accountHolderName: editingWithdrawal.accountHolderName,
        withdrawalType: editingWithdrawal.withdrawalType,
        status: editStatus,
        transactionId:
          editStatus === "approved" ? transactionId.trim() : undefined,
        ...(editingWithdrawal.uid && {
          uid:
            typeof editingWithdrawal.uid === "object"
              ? editingWithdrawal.uid._id
              : editingWithdrawal.uid,
        }),
      };

      const response = await updateWithdrawalStatus(
        editingWithdrawal._id,
        updateData,
      );

      if (response.success) {
        toast.success("Withdrawal updated successfully");
        setEditDialogOpen(false);
        setFormErrors({});
        fetchWithdrawals();
      } else {
        toast.error(response.message || "Failed to update withdrawal");
      }
    } catch (error) {
      console.error("Error updating withdrawal:", error);
      toast.error("An error occurred while updating the withdrawal");
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Reset form errors when dialog is closed
  useEffect(() => {
    if (!editDialogOpen) {
      setFormErrors({});
    }
  }, [editDialogOpen]);

  const submitCommission = async () => {
    if (
      commissionPercent === "" ||
      commissionPercent < 0 ||
      commissionPercent > 100
    ) {
      toast.error(
        "Please enter a valid commission percentage between 0 and 100",
      );
      return;
    }

    try {
      setIsLoadingAction(true);
      const referralPercentage = Number(commissionPercent);

      const utilityResponse = await getUtility();
      const utilityId = utilityResponse?.payload?._id || "";

      if (!utilityId) {
        throw new Error("Utility settings not found");
      }

      const updateData = { referralPercentage };
      const response = await updateUtility(utilityId, updateData);

      setUtilitySettings((prev) => ({
        ...prev,
        ...response.payload,
        referralPercentage,
      }));
      toast.success(`Saved Successfully`);
      setCommissionDialogOpen(false);
      setCommissionPercent("");
      fetchWithdrawals();
    } catch (error) {
      console.error("Error updating referral percentage:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update referral percentage",
      );
    } finally {
      setIsLoadingAction(false);
    }
  };

  return (
    <>
      <UserHeader
        NoSearch
        HeaderText="Withdraw Requests"
        DescriptionText="Analyze income trends and detailed financial insights"
        buttonText="Settings"
        // NoRightContent
        icon={settingIcon}
        onClick={() => setCommissionDialogOpen(true)}
      />
      <div className={styles.withdrawRequestspage}>
        {isFetching ? (
          <CommonLoader />
        ) : (
          <div className={styles.withdrawRequestsTable}>
            <div className={styles.tableUi}>
              <table>
                <thead>
                  <tr>
                    <th>Sr no.</th>
                    <th>Requested Date</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Amount</th>
                    <th>Transaction ID</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals?.length > 0 ? (
                    withdrawals.map((withdrawal, index) => {
                      return (
                        <tr
                          key={withdrawal._id}
                          className={getRowClassName(withdrawal)}
                        >
                          <td>
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td>
                            {format(
                              withdrawal.createdAt,
                              "dd/MM/yyyy HH:mm:ss",
                            )}
                          </td>
                          <td>{withdrawal.name || "N/A"}</td>
                          <td>{withdrawal.email || "N/A"}</td>
                          <td>{withdrawal.amount || "N/A"}</td>
                          <td>{withdrawal.transactionId || "N/A"}</td>
                          <td>{withdrawal.withdrawalType || "N/A"}</td>
                          <td>
                            <span
                              className={`${styles[withdrawal.status] || styles.green}`}
                            >
                              {withdrawal.status
                                ? withdrawal.status.charAt(0).toUpperCase() +
                                  withdrawal.status.slice(1)
                                : "N/A"}
                            </span>
                          </td>
                          <td>
                            {withdrawal.status === "approved" ||
                            withdrawal.status === "rejected" ? (
                              <Image
                                alt="Locked withdrawal"
                                src={LockIcon}
                                width={20}
                                height={20}
                                className={styles.lockIcon}
                                title={`Withdrawal ${withdrawal.status} - cannot be edited`}
                              />
                            ) : (
                              <Image
                                alt="Edit withdrawal"
                                src={EditIcon}
                                width={20}
                                height={20}
                                className={styles.editIcon}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditClick(withdrawal);
                                }}
                              />
                            )}
                          </td>
                        </tr>
                      );
                    })
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
              onPageChange={fetchWithdrawals}
            />
          </div>
        )}
      </div>
      {commissionDialogOpen && (
        <SettingsModal
          onSave={submitCommission}
          onClose={() => setCommissionDialogOpen(false)}
          commissionPercent={commissionPercent}
          setCommissionPercent={setCommissionPercent}
        />
      )}
      <StatusModal
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        editStatus={editStatus}
        setEditStatus={setEditStatus}
        transactionId={transactionId}
        setTransactionId={setTransactionId}
        formErrors={formErrors}
        setFormErrors={setFormErrors}
        isLoadingAction={isLoadingAction}
        handleUpdateWithdrawal={handleUpdateWithdrawal}
      />
    </>
  );
}
