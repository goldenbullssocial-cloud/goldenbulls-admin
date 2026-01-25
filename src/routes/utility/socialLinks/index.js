"use client";
import React, { useEffect, useState } from "react";
import styles from "./socialLinks.module.scss";
import EditIcon from "@/icons/editIcon";
import { getUtility, updateUtility } from "@/api/utility";
import UserHeader from "@/components/userHeader";
import EmailModal from "../emailModal";
export default function SocialLinks() {
  const [utilitySettings, setUtilitySettings] = useState({
    email: "",
    phoneNo: "",
    facebookLink: "",
    instagramLink: "",
    linkedin: "",
    location: "",
    twitter: "",
    chatNumber: "",
    days: 0,
    telegramLink: "",
    whatsAppLink: "",
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const fetchUtilitySettings = async () => {
    try {
      // Replace with actual API call
      const res = await getUtility();
      setUtilitySettings(res?.payload || {});
    } catch (err) {
      console.error("Failed to fetch utility settings:", err);
    }
  };

  const updateUtilitySetting = async (field, value) => {
    try {
      setIsLoading(true);
      const updateData = { [field]: value };
      const utilityId = utilitySettings?._id || "";

      const response = await updateUtility(utilityId, updateData);

      setUtilitySettings((prev) => ({
        ...prev,
        ...response.payload, // Assuming the API returns the updated settings
      }));
      toast.success(`${field} updated successfully`);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      toast.error(`Failed to update ${field}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUtilitySettings();
  }, []);

  const handleEditClick = (field) => {
    setCurrentField(field);
    setIsEditDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentField) return;

    const formData = new FormData(e.target);
    const value = formData.get(currentField);
    updateUtilitySetting(currentField, value);
  };

  const fieldLabels = {
    email: "Email",
    phoneNo: "Phone Number",
    facebookLink: "Facebook Link",
    instagramLink: "Instagram Link",
    linkedin: "Linkedin Link",
    location: "Location",
    twitter: "Twitter Link",
    chatNumber: "Chat Number",
    days: "Newsletter Email Sent Days",
    telegramLink: "Telegram Link",
    whatsAppLink: "WhatsApp Link",
  };

  // Filter and prepare table data
  const tableData = Object.entries(utilitySettings)
    .filter(
      ([key]) =>
        ![
          "_id",
          "deletedAt",
          "updatedAt",
          "lastEmailSentDate",
          "referralPercentage",
        ].includes(key),
    )
    .map(([key, value], index) => ({
      id: key,
      serial: index + 1,
      field: key,
      label: fieldLabels[key],
      value: value || "Not set",
    }));

  const filteredData = searchTerm
    ? tableData.filter(
        (item) =>
          item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(item.value).toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : tableData;

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const formatPhoneNumber = (phone) => {
    if (!phone || phone === "Not set") return phone;
    return phone.startsWith("+") ? phone : `+${phone}`;
  };

  return (
    <>
      <UserHeader NoRightContent />
      <div className={styles.utility}>
        <div className={styles.socialLinks}>
          <div className={styles.title}>
            <h2>Social Links</h2>
          </div>
          <div className={styles.grid}>
            {paginatedData.map((item) => {
              return (
                <>
                  <div className={styles.gridItems} key={item.id}>
                    <div className={styles.cardHeaderAlignment}>
                      <h3>{item.label}</h3>
                      <button onClick={() => handleEditClick(item.field)}>
                        <EditIcon />
                      </button>
                    </div>
                    <p>{item.value}</p>
                  </div>
                  {isEditDialogOpen && (
                    <EmailModal
                      onClose={() => setIsEditDialogOpen(false)}
                      onSave={updateUtilitySetting}
                      label={item.label}
                      currentField={item.field}
                      utilitySettings={utilitySettings}
                      fieldLabels={fieldLabels}
                    />
                  )}
                </>
              );
            })}
          </div>
          <div className={styles.line}></div>
        </div>
      </div>
    </>
  );
}
