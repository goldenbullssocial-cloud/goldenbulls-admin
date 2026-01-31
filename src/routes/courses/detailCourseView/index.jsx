"use client";
import React, { useState } from "react";
import styles from "./detailCourseView.module.scss";
import CloseIcon from "@/icons/closeIcon";
import PlayIcon from "@/icons/playIcon";
import DeleteIcon from "@/icons/deleteIcon";
import Button from "@/components/button";

const DetailCourseView = ({ course, onClose, onEdit, onDelete }) => {
  const [expandedChapters, setExpandedChapters] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);

  if (!course) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.header}>
            <h2>COURSE DETAILS</h2>
            <button className={styles.closeBtn} onClick={onClose}>
              <CloseIcon />
            </button>
          </div>
          <div className={styles.courseInfo}>
            <p>No course data available</p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      return "N/A";
    }
  };

  const getThumbnailUrl = () => {
    if (course.courseVideo?.includes("youtube.com/watch")) {
      return `https://img.youtube.com/vi/${course.courseVideo.split("v=")[1]}/maxresdefault.jpg`;
    }
    return course.courseVideo || "/assets/images/course-thumb.jpg";
  };

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  const toggleChapter = (index) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleEditCourse = () => {
    if (onEdit) {
      onEdit(course);
    }
  };

  const handleDeleteCourse = () => {
    if (
      onDelete &&
      window.confirm("Are you sure you want to delete this course?")
    ) {
      onDelete(course._id);
    }
  };

  const handlePlayChapter = (chapter) => {
    // Handle chapter video playback
    if (chapter.videoUrl || chapter.videoFile) {
      // Open video player or navigate to chapter
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <h2>COURSE DETAILS</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        {/* Video Section */}
        <div className={styles.videoSection}>
          <div className={styles.videoContainer}>
            <div>
              <div className={styles.thumbnail} onClick={handlePlayVideo}>
                <img
                  src={getThumbnailUrl()}
                  alt={course.CourseName || "Course Thumbnail"}
                />
                <div className={styles.playButton}>
                  <img
                    src="/assets/icons/PlayIcon.svg"
                    alt="Play"
                    width={24}
                    height={24}
                  />
                </div>
              </div>
              <div className={styles.courseInfo}>
                <div className={styles.actions}>
                  <button
                    onClick={handleEditCourse}
                    className={styles.editButton}
                  >
                    Edit Course
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={handleDeleteCourse}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.details}>
              <h3>{course.CourseName || "Untitled Course"}</h3>
              <p>{course.description || "No description available"}</p>
            </div>
          </div>
        </div>

        {/* Meta Info */}
        <div className={styles.meta}>
          <span className={styles.price}>${course.price || "0"}</span>
          <span>•</span>
          <span>{course.instructor || "Unknown Instructor"}</span>
          <span>•</span>
          <span>{course.hours || "0"} Hours</span>
          <span>•</span>
          <span className={styles.goldBadge}>
            {course.courseLevel || "Beginner"}
          </span>
          <span>•</span>
          <span>{course.language || "English"}</span>
          <span className={styles.separator}></span>
          <span>Created: {formatDate(course.createdAt)}</span>
          <span>•</span>
          <span>Last Updated: {formatDate(course.updatedAt)}</span>
        </div>

        {/* Syllabus */}
        <div className={styles.syllabus}>
          <h4>SYLLABUS</h4>

          {course.chapter && course.chapter.length > 0 ? (
            course.chapter.map((chapter, index) => (
              <div className={styles.chapter} key={chapter._id || index}>
                <div
                  className={styles.chapterHeader}
                  onClick={() => toggleChapter(index)}
                >
                  <span>
                    <strong>CHAPTER {chapter.chapterNo || index + 1}</strong> |{" "}
                    {chapter.chapterName ||
                      chapter.title ||
                      `Chapter ${index.chapterNo || index + 1}`}
                  </span>
                  <div className={styles.chapterActions}>
                    <span className={styles.duration}>
                      {chapter.duration || "0"} Min
                    </span>
                    <button
                      className={styles.playChapterBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayChapter(chapter);
                      }}
                    >
                      <PlayIcon />
                    </button>
                  </div>
                </div>

                {expandedChapters[index] && (
                  <div className={styles.chapterContent}>
                    <p>
                      {chapter.description ||
                        "No description available for this chapter."}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={styles.noSyllabus}>
              <p>No syllabus available for this course yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailCourseView;
