"use client";
import React from "react";
import styles from "./detailCourseView.module.scss";
import CloseIcon from "@/icons/closeIcon";

const DetailCourseView = ({ course, onClose }) => {
  if (!course) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.header}>
            <h2>Course Details</h2>
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

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <h2>Course Details</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        {/* Course Info */}
        <div className={styles.courseInfo}>
          <div className={styles.thumbnail}>
            <img
              src={getThumbnailUrl()}
              alt={course.CourseName || "Course Thumbnail"}
            />
            <div className={styles.playIcon}>▶</div>
          </div>

          <div className={styles.details}>
            <h3>{course.CourseName || "Untitled Course"}</h3>

            <p>{course.description || "No description available"}</p>

            <div className={styles.actions}>
              <button className={styles.editBtn}>✏️ Edit Course</button>
              <button className={styles.deleteBtn}>🗑</button>
            </div>
          </div>
        </div>

        {/* Meta Info */}
        <div className={styles.meta}>
          <span>${course.price || "0"}</span>
          <span>• {course.instructor?.name || "Unknown Instructor"}</span>
          <span>• {course.hours || "0"} Hours</span>
          <span className={styles.badge}>
            {course.courseLevel || "Beginner"}
          </span>
          <span>• {course.language || "English"}</span>
          <span>• Created: {formatDate(course.createdAt)}</span>
          <span>• Last Updated: {formatDate(course.updatedAt)}</span>
        </div>

        {/* Syllabus */}
        <div className={styles.syllabus}>
          <h4>Syllabus</h4>

          {course.syllabus && course.syllabus.length > 0 ? (
            course.syllabus.map((chapter, index) => (
              <div className={styles.chapter} key={chapter._id || index}>
                <div className={styles.chapterHeader}>
                  <span>
                    <strong>CHAPTER {index + 1}</strong> |{" "}
                    {chapter.title || `Chapter ${index + 1}`}
                  </span>
                  <span className={styles.duration}>
                    {chapter.duration || "0 Min"} ▶
                  </span>
                </div>

                <p>
                  {chapter.description ||
                    "No description available for this chapter."}
                </p>
              </div>
            ))
          ) : (
            <div className={styles.chapter}>
              <div className={styles.chapterHeader}>
                <span>
                  <strong>CHAPTER 1</strong> | Course Introduction
                </span>
                <span className={styles.duration}>35 Min ▶</span>
              </div>

              <p>
                Course syllabus will be available once the course content is
                fully configured. This section will display all chapters and
                learning materials.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailCourseView;
