"use client";
import React, { useState, useEffect } from "react";
import styles from "./certificate.module.scss";
import PagePagination from "@/components/pagePagination";
import UserHeader from "@/components/userHeader";
import { format } from "date-fns";
import jsPDF from "jspdf";
import NoDataFound from "@/components/noDataFound";
import CommonLoader from "@/components/commonLoader";
import DownloadIcon from "@/icons/downloadIcon";
import UploadIcon from "@/icons/uploadIcon";
import {
  getCompletedCourseCertificate,
  downloadCourseCertificate,
  createCertificateIssued,
  createExtraCourseCertificate,
} from "@/api/certificate";
import { uploadImage } from "@/api/course";
import { toast } from "sonner";
import { useRef } from "react";
import { Loader2 } from "lucide-react";
import AddUserModal from "./addUserModal";
const PlusIcon = "/assets/icons/plus.svg";

export default function CertificateTable() {
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const fileInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch certificates
  const fetchCertificates = async () => {
    try {
      setIsLoading(true);
      const response = await getCompletedCourseCertificate();
      const allCertificates = response?.payload?.data || [];
      setCertificates(allCertificates);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      toast.error("Failed to load certificates");
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const filteredCertificates = React.useMemo(() => {
    const filtered = certificates.filter((cert) => {
      const fullName = [cert?.user?.firstName, cert?.user?.lastName]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const courseName = (cert?.course?.CourseName || "").toLowerCase();
      const search = debouncedSearch.toLowerCase();
      return fullName.includes(search) || courseName.includes(search);
    });
    return filtered;
  }, [certificates, debouncedSearch]);

  useEffect(() => {
    setTotalItems(filteredCertificates.length);
    setTotalPages(Math.ceil((filteredCertificates.length || 0) / itemsPerPage));
  }, [filteredCertificates, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value.trimStart());
  };

  const paginatedCertificates = React.useMemo(() => {
    return filteredCertificates.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [filteredCertificates, currentPage, itemsPerPage]);

  // const handleDownload = async (item) => {
  //     try {
  //         setLoadingId(item?._id);
  //         setIsDownloading(true);
  //         const studentName = (item?.user?.firstName || "") + " " + (item?.user?.lastName || "");
  //         const courseName = item?.course?.CourseName || "";
  //         const courseType = "Recorded";

  //         const payload = {
  //             studentName,
  //             courseName,
  //             courseType,
  //         };

  //         const blob = await downloadCourseCertificate(payload);
  //         const url = window.URL.createObjectURL(new Blob([blob]));
  //         const link = document.createElement("a");
  //         link.href = url;
  //         link.setAttribute("download", `${studentName}_${courseName}_Certificate.pdf`);
  //         document.body.appendChild(link);
  //         link.click();
  //         link.remove();
  //         toast.success("Certificate download started");
  //     } catch (error) {
  //         console.error("Error downloading certificate:", error);
  //         toast.error("Failed to download certificate");
  //     } finally {
  //         setIsDownloading(false);
  //         setLoadingId(null);
  //     }
  // };

  const handleDownload = async (item) => {
    try {
      setLoadingId(item?._id);
      setIsDownloading(true);

      // Check if certificate has been uploaded (has a URL)
      if (item?.url) {
        // Download the uploaded certificate image
        const link = document.createElement("a");
        link.href = item.url;
        link.setAttribute(
          "download",
          `Certificate_${item?.user?.firstName}_${item?.user?.lastName}.png`,
        );
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("Certificate downloaded successfully");
      } else {
        // Generate certificate using PDF
        const studentName =
          [item?.user?.firstName, item?.user?.lastName]
            .filter(Boolean)
            .join(" ") || "Student";
        const currentDate = format(new Date(), "d MMM yyyy");
        const courseName = item?.course?.CourseName || "Course";

        // Create PDF document
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        });

        // Load certificate template as image
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
          try {
            // Convert image to canvas first, then to data URL
            const canvas = document.createElement("canvas");
            const scale = 3; // Higher scale for better quality
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            const ctx = canvas.getContext("2d");
            ctx.scale(scale, scale);
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0);

            const imageData = canvas.toDataURL("image/png", 1.0);

            // Add black background
            pdf.setFillColor(0, 0, 0);
            pdf.rect(0, 0, 297, 210, "F");

            // Add certificate template as background
            pdf.addImage(imageData, "PNG", 0, 0, 297, 210);

            // Add student name with larger font
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(28);
            pdf.setTextColor(255, 255, 255); // Gold color
            pdf.text(studentName, 148.5, 100, { align: "center" });

            // Add course description
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(12);
            pdf.setTextColor(255, 255, 255);
            const description = `This certifies that the learner has successfully completed the ${courseName} offered by Golden Bulls Academy, demonstrating dedication, discipline, and a strong understanding of core trading and financial market concepts.`;

            const lines = pdf.splitTextToSize(description, 180);
            const lineHeight = 7;
            const startY = 120;

            lines.forEach((line, index) => {
              pdf.text(line, 148.5, startY + index * lineHeight, {
                align: "center",
              });
            });

            // Add date section
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(12);
            pdf.setTextColor(255, 255, 255);
            pdf.text(currentDate, 86, 170, { align: "left" });

            // Save the PDF with correct extension
            pdf.save(`Certificate_${studentName.replace(/\s+/g, "_")}.pdf`);
            toast.success("Certificate downloaded successfully");
          } catch (error) {
            console.error("Error generating PDF:", error);
            toast.error("Failed to generate certificate");
          } finally {
            setIsDownloading(false);
            setLoadingId(null);
          }
        };

        img.onerror = () => {
          toast.error("Failed to load certificate template");
          setIsDownloading(false);
          setLoadingId(null);
        };

        img.src = "/assets/certificate.svg";
        return; // Exit early to prevent finally block from running immediately
      }
    } catch (error) {
      console.error("Error downloading certificate:", error);
      toast.error("Failed to download certificate");
    } finally {
      setIsDownloading(false);
      setLoadingId(null);
    }
  };

  const handleUploadClick = (id) => {
    setLoadingId(id);
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setLoadingId(null);
      return;
    }

    try {
      setIsUploading(true);
      toast.loading("Uploading certificate...");

      // 1. Upload image to S3
      const uploadRes = await uploadImage(file);
      const imageUrl = uploadRes?.payload?.data;

      if (imageUrl) {
        // 2. Pass the data to createCertificateIssued
        await createCertificateIssued({ url: imageUrl });
        toast.success("Certificate uploaded and issued successfully");
        fetchCertificates(); // Refresh the table
      } else {
        toast.error("Failed to get upload URL");
      }
    } catch (error) {
      console.error("Error during certificate upload flow:", error);
      toast.error("Failed to upload certificate");
    } finally {
      setIsUploading(false);
      setLoadingId(null);
      e.target.value = ""; // Clear input
      toast.dismiss();
    }
  };

  const handleAddNew = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  const handleModalSubmit = async (formData) => {
    try {
      toast.loading("Creating certificate...");
      const response = await createExtraCourseCertificate(formData);
      toast.dismiss();
      toast.success("Certificate created successfully");
      setShowAddModal(false);
      fetchCertificates(); // Refresh the list
    } catch (error) {
      toast.dismiss();
      toast.error(
        error?.response?.data?.message || "Failed to create certificate",
      );
      console.error("Error creating certificate:", error);
    }
  };

  return (
    <>
      <UserHeader
        buttonText="Add New User"
        onClick={handleAddNew}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value.trimStart())}
        HeaderText="Certificate"
        DescriptionText="Centralized control for issued certificates and downloads"
        icon={PlusIcon}
      />
      {isLoading ? (
        <CommonLoader />
      ) : (
        <div className={styles.blogsPageAlignment}>
          <div className={styles.blogsTableAlignment}>
            <div className={styles.tableUi}>
              <table>
                <thead>
                  <tr>
                    <th className={styles.indexCol}>Sr no.</th>
                    <th className={styles.titleCol}>User Name</th>
                    <th className={styles.authorCol}>Course Name</th>
                    <th className={styles.dateCol}>Issued Date</th>
                    <th className={styles.dateCol}>Download</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCertificates.length > 0 ? (
                    paginatedCertificates.map((item, index) => (
                      <tr key={item?._id || index}>
                        <td className={styles.indexCol}>
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td
                          className={`${styles.blogTitle} ${styles.cellContent}`}
                          title={item?.userName}
                        >
                          <div className={styles.truncate}>
                            {[item?.user?.firstName, item?.user?.lastName]
                              .filter(Boolean)
                              .join(" ") || "-"}
                          </div>
                        </td>
                        <td
                          className={styles.cellContent}
                          title={item?.courseName}
                        >
                          <div className={styles.truncate}>
                            {item?.course?.CourseName || "-"}
                          </div>
                        </td>
                        <td className={styles.dateCol}>
                          {item?.createdAt
                            ? format(new Date(item.createdAt), "MMM d, yyyy")
                            : "N/A"}
                        </td>
                        <td className={styles.dateCol}>
                          <div className={styles.actionIcons}>
                            <div
                              onClick={() =>
                                !isDownloading && handleDownload(item)
                              }
                              style={{
                                cursor: isDownloading
                                  ? "not-allowed"
                                  : "pointer",
                              }}
                            >
                              {isDownloading && loadingId === item?._id ? (
                                <Loader2 className={styles.loader} size={20} />
                              ) : (
                                <DownloadIcon />
                              )}
                            </div>
                            <div
                              onClick={() =>
                                !isUploading && handleUploadClick(item?._id)
                              }
                              style={{
                                cursor: isUploading ? "not-allowed" : "pointer",
                              }}
                            >
                              {isUploading && loadingId === item?._id ? (
                                <Loader2 className={styles.loader} size={20} />
                              ) : (
                                <UploadIcon />
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">
                        <NoDataFound />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <PagePagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept="image/*,application/pdf"
      />
      {showAddModal && (
        <AddUserModal onClose={handleCloseModal} onSubmit={handleModalSubmit} />
      )}
    </>
  );
}
