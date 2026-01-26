import React, { useState, useEffect } from "react";
import styles from "./batchForm.module.scss";
import Input from "@/components/input";
import RemoveIcon from "@/icons/removeIcon";
import Button from "@/components/button";
import PlusIcon from "@/icons/plusIcon";
import { toast } from "sonner";
import {
  deleteBatch,
  updateBatch,
  createNewBatch,
  getAllBatch,
} from "@/api/course";
import { getAllCenters } from "@/api/banner";
import StyledSelect from "@/components/styledSelect";

const SaveIcon = "/assets/icons/save.svg";

// Constants
const INITIAL_BATCH = {
  id: Date.now().toString(),
  startDate: "",
  endDate: "",
  batchTime: "",
  zoomLink: "",
  centerId: "",
};

const TIME_REGEX = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

// Utility functions
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const formatDateForApi = (dateString) => {
  return dateString ? new Date(dateString).toISOString().split("T")[0] : null;
};

const createBatchPayload = (batches, courseId, activeTab, selectedCenter) => ({
  batch: batches.map((b) => ({
    ...(b._id && { _id: b._id }), // Include existing batch ID if it exists
    startDate: formatDateForApi(b.startDate),
    endDate: formatDateForApi(b.endDate),
    courseId: courseId || "",
    ...(activeTab === "physical" &&
      selectedCenter?._id && {
        centerId: selectedCenter._id,
      }),
    ...(activeTab === "live" && {
      meetingLink: b.zoomLink || null,
    }),
    time: b.batchTime || null,
  })),
});

export default function BatchForm({
  batches = [],
  selectedCenter = null,
  latestCourse = null,
  activeTab,
  setOpen = () => {},
  setBatches = () => {},
  setSelectedCenter = () => {},
}) {
  const [batchesList, setBatchesList] = useState(
    batches.length > 0 ? batches : [INITIAL_BATCH],
  );
  const [batchErrors, setBatchErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [centers, setCenters] = useState([]);
  const [isLoadingCenters, setIsLoadingCenters] = useState(false);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        setIsLoadingCenters(true);
        const response = await getAllCenters();
        if (response?.success) {
          setCenters(response.payload?.data || []);
        }
      } catch (error) {
        console.error("Error fetching centers:", error);
        toast.error("Failed to load centers");
      } finally {
        setIsLoadingCenters(false);
      }
    };

    fetchCenters();
  }, []);
  const toLocalDateInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Add this useEffect hook after the existing useEffect for fetching centers
  useEffect(() => {
    const fetchBatches = async () => {
      if (latestCourse?._id) {
        try {
          setIsLoading(true);
          const response = await getAllBatch(latestCourse._id);

          if (response && response.payload?.data?.length > 0) {
            const formattedBatches = response?.payload?.data?.map((batch) => ({
              _id: batch._id,
              id: batch._id, // Using _id as id for consistency
              startDate: toLocalDateInput(batch.startDate),
              endDate: toLocalDateInput(batch.endDate),

              batchTime: batch.time || "",
              zoomLink: batch.meetingLink || "",
              centerId: batch.centerId?._id || "",
              centerName: batch.centerId?.centerName || "",
              location: batch.location || "",
            }));
            setBatchesList(formattedBatches);
            console.log(batchesList, "batchLis");

            // If there's a centerId in the first batch, set it as selected
            if (formattedBatches[0]?.centerId) {
              const center = centers.find(
                (c) => c._id === formattedBatches[0].centerId,
              );
              if (center) {
                setSelectedCenter(center);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching batches:", error);
          toast.error("Failed to load batches");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchBatches();
  }, [latestCourse?._id, centers]);

  // Batch management functions
  const createNewBatchObject = () => ({
    ...INITIAL_BATCH,
    id: Date.now().toString(),
  });

  const updateBatchAtIndex = (index, updates) => {
    setBatchesList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
  };

  const removeBatchAtIndex = (index) => {
    setBatchesList((prev) => prev.filter((_, i) => i !== index));
  };

  // Event handlers
  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    updateBatchAtIndex(index, { [name]: value });
  };

  const handleAddBatch = () => {
    if (batches.length >= 10) {
      toast.error("You can only add up to 10 batches");
      return;
    }
    setBatchesList((prev) => [...prev, createNewBatchObject()]);
  };

  const handleSubmitAll = async (e) => {
    e.preventDefault();

    // Validate all batches first
    const errors = validateBatches(batchesList);

    if (hasValidationErrors(errors)) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    // Check if we have the required data
    if (!latestCourse?._id) {
      toast.error("Course information is missing");
      return;
    }

    if (activeTab === "physical" && !selectedCenter?._id) {
      toast.error("Please select a center for physical batches");
      return;
    }

    await handleCreateBatch(batchesList, setBatches);
  };

  const validateSingleBatch = (batch, index, allBatches) => {
    const errors = {};

    if (!batch.startDate) errors.startDate = "Start date is required";
    if (!batch.endDate) errors.endDate = "End date is required";

    // Time validation
    if (!batch.batchTime) {
      errors.batchTime = "Time is required";
    } else if (!TIME_REGEX.test(batch.batchTime)) {
      errors.batchTime = "Please enter a valid time in 24-hour format (HH:MM)";
    }

    // Date logic validation
    if (batch.startDate && batch.endDate) {
      const start = new Date(batch.startDate);
      const end = new Date(batch.endDate);
      if (start > end) {
        errors.endDate = "End date must be after start date";
      }
    }

    // Sequential validation - check for duplicate start dates
    allBatches.forEach((otherBatch, otherIndex) => {
      if (otherIndex !== index && otherBatch.startDate && batch.startDate) {
        const otherStart = new Date(otherBatch.startDate);
        const currentStart = new Date(batch.startDate);
        if (otherStart.getTime() === currentStart.getTime()) {
          errors.startDate = `Start date cannot be the same as batch ${otherIndex + 1}`;
        }
      }
    });

    // Chronological validation - ensure start dates are in sequence
    // if (index > 0) {
    //   const prevBatch = allBatches[index - 1];
    //   if (prevBatch.startDate && batch.startDate) {
    //     const prevStart = new Date(prevBatch.startDate);
    //     const currentStart = new Date(batch.startDate);
    //     if (currentStart <= prevStart) {
    //       errors.startDate = `Start date must be after previous batch's start date (${prevStart.toDateString()})`;
    //     }
    //   }
    // }

    return errors;
  };

  const validateBatches = (batches) => {
    const errors = {};
    batches.forEach((batch, index) => {
      errors[index] = validateSingleBatch(batch, index, batches);
    });
    setBatchErrors(errors);

    return errors;
  };

  const hasValidationErrors = (errors) => {
    return Object.values(errors).some((err) => Object.keys(err).length > 0);
  };

  const handleCreateBatch = async (batches, setBatches) => {
    try {
      const errors = validateBatches(batches);
      const hasErrors = Object.values(errors).some(
        (err) => Object.keys(err).length > 0,
      );
      if (hasErrors) {
        toast.error("Please fix the batch errors before submitting.");
        return;
      }

      setIsSubmitting(true);

      // Process all batches
      await Promise.all(
        batches.map(async (batch) => {
          const batchData = {
            startDate: batch.startDate
              ? new Date(batch.startDate).toISOString().split("T")[0]
              : null,
            endDate: batch.endDate
              ? new Date(batch.endDate).toISOString().split("T")[0]
              : null,
            courseId: latestCourse?._id || "",
            ...(activeTab === "physical" &&
              selectedCenter?._id && {
                centerId: selectedCenter._id,
              }),
            ...(activeTab === "live" && {
              meetingLink: batch.meetingLink || null,
            }),
            time: batch.batchTime || null,
          };

          if (batch._id) {
            await handleUpdateBatch(batch._id, batchData, setBatches);
          } else {
            const res = await createNewBatch({ batch: [batchData] });
            if (res.success) {
              toast.success("Batch created successfully");
              const updated = await getAllBatch(latestCourse?._id || "");
              setBatches(updated.payload || []);
            } else {
              throw new Error(res.message || "Failed to create batch");
            }
          }
        }),
      );

      setOpen(false);
    } catch (error) {
      console.error("Batch operation error:", error);
      toast.error(error.message || "Failed to process batches");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateBatch = async (id, updatedData, setBatches) => {
    try {
      setIsSubmitting(true);
      const batchData = {
        ...updatedData,
        ...(updatedData.meetingLink && {
          meetingLink: updatedData.meetingLink,
        }),
      };
      const res = await updateBatch(id, batchData);
      if (res.success) {
        toast.success("Batch updated successfully");
        const updated = await getAllBatch(latestCourse?._id || "");
        setBatches(updated.payload || []);
      } else {
        toast.error(res.message || "Failed to update batch");
      }
    } catch (error) {
      toast.error("Failed to update batch");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBatch = async (id, setBatchesCallback, index) => {
    try {
      setIsSubmitting(true);

      if (!id && index !== undefined) {
        setBatchesCallback((prev) => prev.filter((_, i) => i !== index));
        return;
      }

      if (id) {
        const res = await deleteBatch(id);
        if (res.success) {
          toast.success("Batch deleted successfully");
          setBatchesCallback((prev) => prev.filter((b) => b._id !== id));
        } else {
          toast.error(res.message || "Failed to delete batch");
        }
      }
    } catch (error) {
      toast.error("Failed to delete batch");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmitAll}
        className={styles.recordedCoursesAlignment}
      >
        {batchesList.map((batch, index) => (
          <div
            className={styles.box}
            key={batch.id || index}
            id={`batch-${index}`}
          >
            <div className={styles.batchHeader}>
              <h3>Batch {index + 1}</h3>
              {batchesList.length > 1 && (
                <button
                  className={styles.remove}
                  type="button"
                  onClick={() =>
                    handleDeleteBatch(batch._id, setBatchesList, index)
                  }
                >
                  <RemoveIcon />
                </button>
              )}
            </div>

            <div className={styles.batchGrid}>
              <Input
                label="Start Date"
                type="date"
                name="startDate"
                value={batch.startDate}
                onChange={(e) => {
                  handleInputChange(index, e);
                }}
                error={batchErrors[index]?.startDate}
              />

              <Input
                label="End Date"
                type="date"
                name="endDate"
                value={batch.endDate}
                onChange={(e) => {
                  handleInputChange(index, e);
                }}
                error={batchErrors[index]?.endDate}
              />

              <Input
                label="Batch Time"
                type="time"
                name="batchTime"
                value={batch.batchTime}
                onChange={(e) => {
                  handleInputChange(index, e);
                }}
                error={batchErrors[index]?.batchTime}
              />

              {activeTab === "physical" && (
                <div className={styles.formGroup}>
                  <label>Center</label>
                  <StyledSelect
                    options={batchesList.map((batch) => ({
                      value: batch?.centerId,
                      label: batch.centerName,
                    }))}
                    value={
                      batch.centerId
                        ? {
                            value: batch.centerId,
                            label: centers.find((c) => c._id === batch.centerId)
                              ?.centerName,
                          }
                        : null
                    }
                    onChange={(val) => {
                      if (val) {
                        const selectedCenter = centers.find(
                          (c) => c._id === val.value,
                        );
                        updateBatchAtIndex(index, {
                          centerId: val.value,
                          location: selectedCenter?.centerName || "",
                        });
                        setSelectedCenter(selectedCenter);
                      } else {
                        // Handle clear action
                        updateBatchAtIndex(index, {
                          centerId: "",
                          location: "",
                        });
                        setSelectedCenter(null);
                      }
                    }}
                    placeholder="Select Center"
                    isDisabled={isLoadingCenters}
                    error={batchErrors[index]?.centerId}
                    isClearable
                    isSearchable
                    className="center-select"
                    classNamePrefix="select"
                  />
                </div>
              )}
              {activeTab === "live" && (
                <Input
                  label="Zoom Link"
                  type="url"
                  name="zoomLink"
                  value={batch.zoomLink}
                  onChange={(e) => {
                    handleInputChange(index, e);
                  }}
                  error={batchErrors[index]?.zoomLink}
                />
              )}
            </div>
          </div>
        ))}

        <div className={styles.buttonGrid}>
          <div className={styles.addbutton}>
            <button type="button" onClick={handleAddBatch}>
              <PlusIcon />
              <span>Add Batch</span>
            </button>
          </div>
          <Button
            type="submit"
            text="Save Batches"
            icon={SaveIcon}
            onClick={handleSubmitAll}
            disabled={isSubmitting}
          />
        </div>
      </form>
    </>
  );
}
