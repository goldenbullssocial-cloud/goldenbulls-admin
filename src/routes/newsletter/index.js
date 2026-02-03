"use client";

import React, { useState, useEffect } from "react";
import styles from "./newsletter.module.scss";
import { getNewsLetter } from "@/api/newsletter";
import { toast } from "sonner";
import UserHeader from "@/components/userHeader";
import NoDataFound from "@/components/noDataFound";
import PagePagination from "@/components/pagePagination";
import { format } from "date-fns";
import CommonLoader from "@/components/commonLoader";
import * as XLSX from "xlsx";

export default function Newsletter() {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      const response = await getNewsLetter();

      setNewsletters(response?.payload?.data || []);
      setTotalItems(response?.payload?.count || 0);
    } catch (error) {
      console.error("Error fetching newsletters:", error);
      toast.error("Failed to fetch newsletters");
    } finally {
      setLoading(false);
    }
  };

  const filteredNewsletters = newsletters.filter((newsletter) =>
    newsletter.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredNewsletters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPaginatedData = filteredNewsletters.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const exportToExcel = () => {
    const dataToExport = filteredNewsletters.map((newsletter, index) => ({
      "Sr. No": index + 1,
      Email: newsletter.email || "N/A",
      "Subscribed On": newsletter.createdAt
        ? format(new Date(newsletter.createdAt), "dd/MM/yyyy, hh:mm:ss")
        : "N/A",
      Status: newsletter.isActive ? "Active" : "Inactive",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Newsletter Subscribers");

    XLSX.writeFile(
      workbook,
      `newsletter_subscribers_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  return (
    <>
      <UserHeader
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value.trimStart())}
        HeaderText="Newsletter"
        DescriptionText="Manage newsletter subscribers and view subscription details"
        buttonText="Export"
        onClick={() => exportToExcel()}
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
                  <th>Email</th>
                  <th>Status</th>
                  <th>Subscribed Date</th>
                </tr>
              </thead>
              <tbody>
                {currentPaginatedData?.length > 0 ? (
                  currentPaginatedData?.map((newsletter, index) => (
                    <tr key={newsletter._id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{newsletter.email || "N/A"}</td>
                      <td>
                        <span
                          className={`${styles.status} ${
                            newsletter.isActive
                              ? styles.active
                              : styles.inactive
                          }`}
                        >
                          {newsletter.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        {newsletter.createdAt
                          ? format(
                              new Date(newsletter.createdAt),
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
