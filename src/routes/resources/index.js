"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./resources.module.scss";
import AddResourcesModal from "./addResourcesModal";
import DeleteBanner from "./deleteModal";
import UserHeader from "@/components/userHeader";
import { format } from "date-fns";
import PagePagination from "@/components/pagePagination";
import NoDataFound from "@/components/noDataFound";
import CommonLoader from "@/components/commonLoader";
import Dropdown from "@/components/dropdown";
import EditIcon from "../../../public/assets/icons/Edit.svg";
import DeleteIcon from "../../../public/assets/icons/Delete.svg";
import DownloadIcon from "@/icons/downloadIcon";
import {
  getAllResources,
  createResource,
  updateResource,
  deleteResource,
  uploadResourceFile
} from "@/api/resources";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

const PlusIcon = "/assets/icons/plus.svg";

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(120, "Title must be at most 120 characters"),
  fileUrl: z
    .string({
      required_error: "File is required",
      invalid_type_error: "File is required",
    })
    .min(1, "File is required")
    .nullable()
    .refine((val) => val !== null && val !== "", {
      message: "File is required",
    }),
});

export default function ResourcesTable() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      fileUrl: null,
    },
  });

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = form;
  const fileValue = watch("fileUrl");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchList = async () => {
    try {
      setIsFetching(true);
      const res = await getAllResources({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch,
      });
      const data = res?.payload?.data ?? res?.data ?? [];
      const count = res?.payload?.count ?? res?.count ?? data.length;
      
      setItems(data);
      setTotalItems(count);
      setTotalPages(Math.ceil(count / itemsPerPage) || 1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch resources");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [currentPage, itemsPerPage, debouncedSearch]);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const response = await uploadResourceFile(file);
      if (response?.success && response?.payload) {
        setValue("fileUrl", response.payload, { shouldValidate: true });
        toast.success("File uploaded successfully");
      } else {
        throw new Error("Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setValue("fileUrl", null, { shouldValidate: true });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openFileDialog = () => fileInputRef.current?.click();
  
    const handleDownload = (url, title) => {
        if (!url) return;
        let filename = title || 'resource';
        if (!filename.toLowerCase().endsWith('.pdf') && !filename.toLowerCase().endsWith('.doc') && !filename.toLowerCase().endsWith('.docx') && !filename.toLowerCase().endsWith('.ppt') && !filename.toLowerCase().endsWith('.pptx')) {
            filename += '.pdf';
        }
        
        const proxyUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
        
        const link = document.createElement('a');
        link.href = proxyUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      let requestData = {};
      if (isEditMode && currentId) {
        const originalItem = items.find((item) => item._id === currentId);
        const originalUrl = originalItem.item || originalItem.fileUrl;
        if (data.title !== originalItem.title) requestData.title = data.title;
        if (data.fileUrl && data.fileUrl !== originalUrl) requestData.fileUrl = data.fileUrl;

        if (Object.keys(requestData).length > 0) {
          await updateResource(currentId, requestData);
          toast.success("Resource updated successfully");
        } else {
          toast.info("No changes detected");
          setIsOpen(false);
          return;
        }
      } else {
        requestData = { title: data.title, fileUrl: data.fileUrl };
        await createResource(requestData);
        toast.success("Resource created successfully");
      }
      setIsOpen(false);
      reset({ title: "", fileUrl: null });
      fetchList();
    } catch (error) {
      console.error("Error saving resource:", error);
      toast.error(error.response?.data?.message || "Failed to save resource");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item) => {
    setIsEditMode(true);
    setCurrentId(item._id);
    reset({
      title: item.title,
      fileUrl: (item.item || item.fileUrl) ?? null,
    });
    setIsOpen(true);
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item._id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setIsDeleting(true);
      await deleteResource(itemToDelete);
      toast.success("Deleted successfully");
      setDeleteDialogOpen(false);
      fetchList();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  const handleCreateNew = () => {
    setIsEditMode(false);
    setCurrentId(null);
    reset({ title: "", fileUrl: null });
    setIsOpen(true);
  };

  const getActions = () => [
    { key: "edit", label: "Edit", icon: EditIcon },
    { key: "delete", label: "Delete", icon: DeleteIcon, variant: "danger" },
  ];

  const handleAction = (action, item) => {
    if (action === "edit") handleEdit(item);
    if (action === "delete") handleDeleteClick(item);
  };

  return (
    <>
      <UserHeader
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        buttonText="Add Resource"
        onClick={handleCreateNew}
        icon={PlusIcon}
        placeholder="Search Title"
        HeaderText="Resources"
        DescriptionText="Manage and upload resources files"
      />
      {isFetching ? (
        <CommonLoader />
      ) : (
        <div className={styles.resourcesPageAlignment}>
          <div className={styles.contentArea}>
            <div className={styles.grid}>
              {items.length > 0 ? (
                items.map((item, index) => {
                  const resourceUrl = item.item || item.fileUrl;
                  return (
                    <div className={styles.gridItems} key={item._id || index}>
                      <div className={styles.fileIconWrapper}>
                        {resourceUrl ? (
                          <iframe
                            src={`${resourceUrl}#view=FitW&page=1&toolbar=0&navpanes=0&scrollbar=0`}
                            title={item.title}
                            className={styles.pdfPreview}
                            scrolling="no"
                          />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                          </svg>
                        )}
                      </div>
                      <div className={styles.info}>
                        <div className={styles.titleRow}>
                          <h3 className={styles.title}>{item.title}</h3>
                          <div className={styles.moreAction}>
                            <button 
                              className={styles.downloadBtn}
                              onClick={() => handleDownload(resourceUrl, item.title)}
                              title="Download"
                            >
                              <DownloadIcon color="#d4af37" />
                            </button>
                            <Dropdown
                              actions={getActions()}
                              onSelect={(action) => handleAction(action, item)}
                            />
                          </div>
                        </div>
                        <p className={styles.date}>
                          {item.createdAt ? format(new Date(item.createdAt), "MMM d, yyyy") : "N/A"}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{gridColumn: '1 / -1'}}>
                  <NoDataFound />
                </div>
              )}
            </div>
          </div>
          <div className={styles.paginationArea}>
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
      
      {isOpen && (
        <AddResourcesModal
          onClose={() => setIsOpen(false)}
          isEditMode={isEditMode}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          openFileDialog={openFileDialog}
          isUploading={isUploading}
          fileValue={fileValue}
          onSubmit={onSubmit}
          handleSubmit={handleSubmit}
          register={register}
          errors={errors}
          setValue={setValue}
          removeFile={removeFile}
          isLoading={isLoading}
        />
      )}

      {deleteDialogOpen && (
        <DeleteBanner
          onClose={() => setDeleteDialogOpen(false)}
          onDelete={confirmDelete}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
}
