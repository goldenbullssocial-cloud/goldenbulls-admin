import React, { useState, useEffect, useRef } from "react";
import styles from "./syllabus.module.scss";
import Input from "@/components/input";
import Textarea from "@/components/textarea";
import DragIcon from "@/icons/dragIcon";
import classNames from "classnames";
import RemoveIcon from "@/icons/removeIcon";
import Button from "@/components/button";
import PlusIcon from "@/icons/plusIcon";
import { toast } from "sonner";
import {
  createChapter,
  uploadImage,
  deleteChapter,
  updateChapter,
} from "@/api/course";
const SaveIcon = "/assets/icons/save.svg";

export default function SyllabusCourses({
  courseId,
  onSuccess,
  formActiveTab,
  editCourse,
  existingChapters = [],
}) {
  const [chapters, setChapters] = useState(() => {
    if (editCourse && existingChapters && existingChapters.length > 0) {
      return existingChapters.map((chapter) => ({
        id: chapter.id,
        chapterName: chapter.chapterName || "",
        description: chapter.description || "",
        duration: chapter.duration || "",
        videoFile: null,
        videoUrl: chapter.videoUrl || "",
        chapterNo: chapter.chapterNo || "",
        chapterImage: chapter.chapterImage || null,
        chapterImageUrl: chapter.chapterImageUrl || "",
      }));
    }
    // Otherwise, return empty form for new course
    return [
      {
        chapterName: "",
        description: "",
        duration: "",
        videoFile: null,
        videoUrl: "",
        chapterNo: "",
        chapterImage: null,
        chapterImageUrl: "",
      },
    ];
  });

  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreviews, setVideoPreviews] = useState({});
  const [isVideoDragOver, setIsVideoDragOver] = useState(false);

  const initialLoad = useRef(true);

  // Update chapters when existingChapters prop changes
  useEffect(() => {
    if (editCourse && existingChapters && existingChapters.length > 0) {
      // Only update if it's the initial load or if existingChapters has actually changed
      if (
        initialLoad.current ||
        JSON.stringify(chapters) !== JSON.stringify(existingChapters)
      ) {
        const formattedChapters = existingChapters.map((chapter) => ({
          id: chapter.id,
          chapterName: chapter.chapterName || "",
          description: chapter.description || "",
          duration: chapter.duration || "",
          videoFile: null,
          videoUrl: chapter.videoUrl || "",
          chapterNo: chapter.chapterNo || "",
          chapterImage: chapter.chapterImage || null,
          chapterImageUrl: chapter.chapterImageUrl || "",
        }));
        setChapters(formattedChapters);
        initialLoad.current = false;
      }
    } else if (!editCourse) {
      // Only reset to empty form if we're not in edit mode and don't have any chapters yet
      if (
        chapters.length === 0 ||
        (chapters.length === 1 && !chapters[0].chapterName)
      ) {
        setChapters([
          {
            id: Date.now().toString(),
            chapterName: "",
            description: "",
            duration: "",
            videoFile: null,
            videoUrl: "",
            chapterNo: "",
            chapterImage: null,
            chapterImageUrl: "",
          },
        ]);
      }
    }
  }, [editCourse, existingChapters]);

  const handleVideoDragOver = (e) => {
    e.preventDefault();
    setIsVideoDragOver(true);
  };

  const handleVideoDragLeave = (e) => {
    e.preventDefault();
    setIsVideoDragOver(false);
  };

  const handleVideoDrop = (e, index) => {
    e.preventDefault();
    setIsVideoDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith("video/")) {
        const videoUrl = URL.createObjectURL(file);
        setVideoPreviews((prev) => ({
          ...prev,
          [index]: videoUrl,
        }));

        setChapters((prev) =>
          prev.map((ch, i) =>
            i === index
              ? {
                  ...ch,
                  videoFile: file,
                  videoUrl: file.name,
                }
              : ch,
          ),
        );
      } else {
        console.error("Please upload a video file");
      }
    }
  };

  const handleInputChange = (index, e) => {
    const { name, value, type, files } = e.target;

    // Handle video file upload with preview
    if (name === "videoFile" && type === "file" && files?.length) {
      const file = files[0];
      const videoUrl = URL.createObjectURL(file);
      setVideoPreviews((prev) => ({
        ...prev,
        [index]: videoUrl, // store preview for this index only
      }));
    }

    setChapters((prev) =>
      prev.map((ch, i) =>
        i === index
          ? {
              ...ch,
              [name]:
                type === "file" ? (files?.length ? files[0] : null) : value,
              ...(type === "file"
                ? { videoUrl: files?.[0] ? files[0].name : ch.videoUrl }
                : {}),
            }
          : ch,
      ),
    );
  };

  const handleImageUpload = async (file, index) => {
    const validImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    if (!validImageTypes.includes(file.type)) {
      toast.error(
        "Invalid file format. Thumbnail must be an image (JPEG, JPG, PNG, or WebP)",
      );
      return;
    } else if (file.size >= 1 * 1024 * 1024) {
      toast.error("Image size must be less than 1MB");
      return;
    }

    try {
      setLoading(true);

      const response = await uploadImage(file);
      setImagePreview(URL.createObjectURL(file));

      if (!response.success) {
        throw new Error("Image upload failed");
      }
      const imageUrl = response.payload || "";

      setChapters((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          chapterImage: imageUrl,
        };
        return updated;
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, index);
    }
  };

  const handleAddChapter = () => {
    setChapters([
      ...chapters,
      {
        chapterName: "",
        description: "",
        duration: "",
        videoFile: null,
        videoUrl: "",
        chapterNo: "",
        chapterImage: null,
        chapterImageUrl: "",
      },
    ]);
  };

  const handleDeleteChapter = async (index) => {
    const chapterToDelete = chapters[index];

    try {
      if (chapterToDelete.id && courseId) {
        await deleteChapter(chapterToDelete.id);
      }
      // Always update local state, whether it was a backend deletion or local only
      const updatedChapters = chapters.filter((_, i) => i !== index);
      setChapters(updatedChapters);

      toast.success("Chapter deleted successfully");
    } catch (error) {
      console.error("Error deleting chapter:", error);
      toast.error("Failed to delete chapter");
    }
  };

  const validateAllChapters = () => {
    let isValid = true;
    const newErrors = {};

    chapters.forEach((chapter, index) => {
      const chapterErrors = {};

      if (!chapter.chapterName.trim()) {
        chapterErrors.chapterName = "Chapter title is required";
        isValid = false;
      }

      if (!chapter.description.trim()) {
        chapterErrors.description = "Description is required";
        isValid = false;
      }

      if (!chapter.chapterNo) {
        chapterErrors.chapterNo = "Chapter number is required";
        isValid = false;
      } else if (
        isNaN(Number(chapter.chapterNo)) ||
        Number(chapter.chapterNo) <= 0
      ) {
        chapterErrors.chapterNo = "Chapter number must be a positive number";
        isValid = false;
      }

      if (!chapter.duration) {
        chapterErrors.duration = "Duration is required";
        isValid = false;
      } else if (
        isNaN(Number(chapter.duration)) ||
        Number(chapter.duration) <= 0
      ) {
        chapterErrors.duration = "Duration must be a positive number";
        isValid = false;
      }
      if (formActiveTab == "recorded") {
        if (!chapter.videoFile && !chapter.videoUrl) {
          chapterErrors.videoFile =
            "Please upload a video file or provide a video URL";
          isValid = false;
        }
      }

      if (Object.keys(chapterErrors).length > 0) {
        newErrors[index] = chapterErrors;
      }
    });

    setErrors(newErrors);

    // Scroll to first error if any
    if (!isValid) {
      const firstErrorIndex = Object.keys(newErrors)[0];
      if (firstErrorIndex) {
        const element = document.getElementById(`chapter-${firstErrorIndex}`);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      toast.error("Please fix the validation errors before submitting");
    }

    return isValid;
  };

  const handleSubmitAll = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return; // Prevent duplicate submissions
    }

    if (!validateAllChapters()) {
      return;
    }

    if (!courseId) {
      toast.error("Course ID is required to create chapters");
      return;
    }

    setIsSubmitting(true);
    setLoading(true);
    try {
      for (const chapter of chapters) {
        const data = new FormData();
        data.append("chapterName", chapter.chapterName);
        data.append("description", chapter.description);
        data.append("duration", chapter.duration);
        data.append("chapterNo", chapter.chapterNo);
        data.append("courseId", courseId);
        if (chapter.videoFile) data.append("image", chapter.videoFile);

        if (chapter.chapterImage) {
          data.append("chapterImage", chapter.chapterImage);
        }

        if (chapter.id) {
          await updateChapter(chapter.id, data);
        } else {
          await createChapter(data);
        }
      }

      toast.success("All chapters created successfully!");
      setChapters([
        {
          chapterName: "",
          description: "",
          duration: "",
          videoFile: null,
          videoUrl: "",
          chapterNo: "",
          chapterImage: null,
          chapterImageUrl: "",
        },
      ]);
      onSuccess?.();
    } catch (error) {
      console.error("Error creating chapters:", error);
      toast.error("Failed to create chapters");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmitAll}
        className={styles.recordedCoursesAlignment}
      >
        {chapters.map((chapter, index) => (
          <div className={styles.box} key={index} id={`chapter-${index}`}>
            <div
              className={classNames(
                styles.chapterGrid,
                styles.chapterGridChange,
              )}
            >
              <Input
                label="Chapter Title"
                placeholder="Chapter Title"
                name="chapterName"
                value={chapter.chapterName}
                onChange={(e) => handleInputChange(index, e)}
                error={errors[index]?.chapterName}
              />

              <div className={styles.childgrid}>
                <Input
                  label="Duration (Hours)"
                  placeholder="Duration"
                  name="duration"
                  value={chapter.duration}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow numbers
                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                      handleInputChange(index, e);
                    }
                  }}
                  error={errors[index]?.duration}
                />

                {chapters.length > 1 && (
                  <button
                    className={styles.remove}
                    type="button"
                    onClick={() => handleDeleteChapter(index)}
                  >
                    <RemoveIcon />
                  </button>
                )}
              </div>
            </div>
            <div className={styles.bottomAlignment}>
              <Input
                label="Chapter Day"
                placeholder="Chapter Day"
                name="chapterNo"
                value={chapter.chapterNo}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only allow numbers
                  if (value === "" || /^\d+$/.test(value)) {
                    handleInputChange(index, e);
                  }
                }}
                error={errors[index]?.chapterNo}
              />
            </div>
            <div className={styles.bottomAlignment}>
              <Textarea
                label="Chapter Description"
                placeholder="Chapter Description"
                name="description"
                value={chapter.description}
                onChange={(e) => handleInputChange(index, e)}
                rows={5}
              />
              {errors[index]?.description && (
                <p className={styles.errorMessage}>
                  {errors[index].description}
                </p>
              )}
            </div>
            {formActiveTab === "recorded" && (
              <div className={styles.chaapterVideo}>
                <span>Chapter Video</span>
                <div
                  className={`${styles.uploadBox} ${isVideoDragOver ? styles.dragOver : ""}`}
                  onClick={() =>
                    document.getElementById(`video-upload-${index}`)?.click()
                  }
                  onDragOver={(e) => handleVideoDragOver(e)}
                  onDragLeave={(e) => handleVideoDragLeave(e)}
                  onDrop={(e) => handleVideoDrop(e, index)}
                >
                  {chapter.videoFile ||
                  videoPreviews[index] ||
                  chapter.videoUrl ? (
                    <div className={styles.previewWrapper}>
                      <video
                        src={
                          chapter.videoFile
                            ? URL.createObjectURL(chapter.videoFile)
                            : videoPreviews[index] || chapter.videoUrl
                        }
                        controls
                        className={styles.videoPreview}
                      />
                    </div>
                  ) : (
                    <div className={styles.iconCenter}>
                      <DragIcon />
                    </div>
                  )}

                  <p className={styles.fileText}>
                    Drag and drop video here, or click to select
                  </p>

                  {/* Hidden input */}
                  <Input
                    type="file"
                    name="videoFile"
                    accept="video/mp4,video/webm,video/quicktime"
                    id={`video-upload-${index}`}
                    className={styles.hiddenInput}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </div>
                {(errors[index]?.videoFile || errors[index]?.videoUrl) && (
                  <p className={styles.errorMessage}>
                    {errors[index].videoFile || errors[index].videoUrl}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
        <div className={styles.buttonGrid}>
          <div className={styles.addbutton}>
            <button type="button" onClick={handleAddChapter}>
              <PlusIcon />
              <span>Add Chapter</span>
            </button>
          </div>
          <Button type="submit" text="Save Course" icon={SaveIcon} />
        </div>
      </form>
    </>
  );
}
