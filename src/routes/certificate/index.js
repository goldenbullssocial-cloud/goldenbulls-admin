"use client";
import React, { useState, useEffect } from "react";
import styles from "./certificate.module.scss";
import PagePagination from "@/components/pagePagination";
import UserHeader from "@/components/userHeader";
import { format } from "date-fns";
import NoDataFound from "@/components/noDataFound";
import CommonLoader from "@/components/commonLoader";
import DownloadIcon from "@/icons/downloadIcon";
import UploadIcon from "@/icons/uploadIcon";
import { getCompletedCourseCertificate, downloadCourseCertificate, createCertificateIssued, createExtraCourseCertificate } from "@/api/certificate";
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
        const filtered = certificates.filter(cert => {
            const fullName = [cert?.user?.firstName, cert?.user?.lastName].filter(Boolean).join(" ").toLowerCase();
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
            currentPage * itemsPerPage
        );
    }, [filteredCertificates, currentPage, itemsPerPage]);

    const handleDownload = async (item) => {
        try {
            setLoadingId(item?._id);
            setIsDownloading(true);
            const studentName = (item?.user?.firstName || "") + " " + (item?.user?.lastName || "");
            const courseName = item?.course?.CourseName || "";
            const courseType = "Recorded";

            const payload = {
                studentName,
                courseName,
                courseType,
            };

            const blob = await downloadCourseCertificate(payload);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${studentName}_${courseName}_Certificate.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("Certificate download started");
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
            toast.error(error?.response?.data?.message || "Failed to create certificate");
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
                                                <td className={styles.indexCol}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                <td
                                                    className={`${styles.blogTitle} ${styles.cellContent}`}
                                                    title={item?.userName}
                                                >
                                                    <div className={styles.truncate}>
                                                        {[item?.user?.firstName, item?.user?.lastName].filter(Boolean).join(" ") || "-"}
                                                    </div>
                                                </td>
                                                <td className={styles.cellContent} title={item?.courseName}>
                                                    <div className={styles.truncate}>
                                                        {item?.course?.CourseName || "-"}
                                                    </div>
                                                </td>
                                                <td className={styles.dateCol}>
                                                    {item?.createdAt ? format(new Date(item.createdAt), "MMM d, yyyy") : "N/A"}
                                                </td>
                                                <td className={styles.dateCol}>
                                                    <div className={styles.actionIcons}>
                                                        <div onClick={() => !isDownloading && handleDownload(item)} style={{ cursor: isDownloading ? 'not-allowed' : 'pointer' }}>
                                                            {isDownloading && loadingId === item?._id ? (
                                                                <Loader2 className={styles.loader} size={20} />
                                                            ) : (
                                                                <DownloadIcon />
                                                            )}
                                                        </div>
                                                        <div onClick={() => !isUploading && handleUploadClick(item?._id)} style={{ cursor: isUploading ? 'not-allowed' : 'pointer' }}>
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
                <AddUserModal
                    onClose={handleCloseModal}
                    onSubmit={handleModalSubmit}
                />
            )}
        </>
    );
}
