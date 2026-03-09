"use client";

import React, { useState, useEffect } from "react";
import styles from "./contact.module.scss";
import { getContact } from "@/api/contact";
import { toast } from "sonner";
import UserHeader from "@/components/userHeader";
import NoDataFound from "@/components/noDataFound";
import PagePagination from "@/components/pagePagination";
import { format } from "date-fns";
import CommonLoader from "@/components/commonLoader";

export default function Contact() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await getContact();

      setContacts(response?.payload?.data || []);
      setTotalItems(response?.payload?.count || 0);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPaginatedData = filteredContacts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <UserHeader
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value.trimStart())}
        NoRightContent
        HeaderText="Contact"
        DescriptionText="Manage contact submissions and view user inquiries"
      />
      <div className={styles.courseSalesAlignment}>
        <div className={styles.tableUi}>
          {loading ? (
            <CommonLoader />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Sr no.</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Description</th>
                  <th>Submitted On</th>
                </tr>
              </thead>
              <tbody>
                {currentPaginatedData?.length > 0 ? (
                  currentPaginatedData?.map((contact, index) => (
                    <tr key={contact._id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>
                        {contact.firstName && contact.lastName
                          ? `${contact.firstName} ${contact.lastName}`
                          : contact.firstName || contact.lastName || "N/A"}
                      </td>
                      <td>{contact.email || "N/A"}</td>
                      <td>{contact.description || "N/A"}</td>
                      <td>
                        {contact.createdAt
                          ? format(
                              new Date(contact.createdAt),
                              "dd/MM/yyyy, hh:mm:ss",
                            )
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <NoDataFound />
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
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
