import React, { useEffect, useState } from "react";
import styles from "./createCourse.module.scss";
import CloseIcon from "@/icons/closeIcon";

import CourseForm from "./courseForm";
import SyllabusCourses from "./syllabusCourses";
import LiveOnlineCoursesindex from "./batchform";
import BatchForm from "./batchform";

export default function CreateCourse({
  editCourse,
  formErrors,
  setFormErrors,
  handleTrimInput,
  handleIntroVideoChange,
  handleContinue,
  videoFile,
  isSyllabusVisible,
  formActiveTab,
  instructors,
  onClose,
  createCourseOpen,
  courseId,
  handleImageChange,
  onSuccess,
  setFormActiveTab,
  isLiveBatchVisible,
  isPhysicalBatchVisible,
  batches,
  selectedCenter,
  latestCourse,
  setOpen,
  setBatches,
  chaptersList,
  setSelectedCenter,
}) {
  const handleTabClick = (tab) => {
    if (editCourse) {
      return;
    }
    setFormActiveTab(tab);
    setFormErrors({});
  };

  const getStepState = (stepNumber) => {
    if (stepNumber === 1) {
      // Step 1 (Course Details) is completed when syllabus is visible or when batch is visible
      return isSyllabusVisible || isLiveBatchVisible || isPhysicalBatchVisible
        ? "completed"
        : "active";
    }
    if (stepNumber === 2) {
      // Step 2 (Syllabus) is completed when batch is visible for live/physical, or always active for recorded
      if (formActiveTab === "recorded") {
        return isSyllabusVisible ? "active" : "inactive";
      } else {
        return isLiveBatchVisible || isPhysicalBatchVisible
          ? "completed"
          : isSyllabusVisible
            ? "active"
            : "inactive";
      }
    }
    if (stepNumber === 3) {
      // Step 3 (Batch) only applies to live and physical courses
      if (formActiveTab === "recorded") {
        return "inactive";
      } else {
        return isLiveBatchVisible || isPhysicalBatchVisible
          ? "active"
          : "inactive";
      }
    }
    return "inactive";
  };
  return (
    <div className={styles.createCourseWrapper}>
      <div className={styles.createCourse}>
        <div className={styles.modalHeader}>
          <h2>{editCourse ? "Edit Course" : "Create Course"}</h2>
          <div className={styles.closeIcon} onClick={onClose}>
            <CloseIcon />
          </div>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.tabGroup}>
            <button
              className={formActiveTab === "recorded" ? styles.active : ""}
              onClick={() => handleTabClick("recorded")}
            >
              <span>Recorded Courses</span>
            </button>
            <button
              className={formActiveTab === "live" ? styles.active : ""}
              onClick={() => handleTabClick("live")}
            >
              <span>Live Online Courses</span>
            </button>
            <button
              className={formActiveTab === "physical" ? styles.active : ""}
              onClick={() => handleTabClick("physical")}
            >
              <span>In Person Courses</span>
            </button>
          </div>
          <div className={styles.spacer}></div>
          <div className={styles.contentGrid}>
            <div className={styles.items}>
              <div className={`${styles.counterGrid} ${getStepState(1)}`}>
                <div>
                  <div
                    className={` ${getStepState(1) === "completed" ? styles.counterComplete : styles.counter} ${styles.counter} ${getStepState(1)}`}
                  >
                    {getStepState(1) === "completed" ? "✓" : "1"}
                  </div>
                  <div className={styles.line}></div>
                </div>
                <span>Course Details</span>
              </div>
              <div className={`${styles.counterGrid} ${getStepState(2)}`}>
                <div>
                  <div
                    className={`${getStepState(2) === "completed" ? styles.counterComplete : styles.counter} ${getStepState(2)}`}
                  >
                    {getStepState(2) === "completed" ? "✓" : "2"}
                  </div>
                  {formActiveTab === "recorded" ? null : (
                    <div className={styles.line}></div>
                  )}
                </div>
                <span>Syllabus</span>
              </div>
              {formActiveTab !== "recorded" && (
                <div className={`${styles.counterGrid} ${getStepState(3)}`}>
                  <div>
                    <div
                      className={`${getStepState(3) === "completed" ? styles.counterComplete : styles.counter} ${getStepState(3)}`}
                    >
                      {getStepState(3) === "completed" ? "✓" : "3"}
                    </div>
                  </div>
                  <span>Batch</span>
                </div>
              )}
            </div>
            <div className={styles.items}>
              {createCourseOpen && (
                <CourseForm
                  editCourse={editCourse}
                  formErrors={formErrors}
                  handleTrimInput={handleTrimInput}
                  handleIntroVideoChange={handleIntroVideoChange}
                  handleContinue={handleContinue}
                  videoFile={videoFile}
                  formActiveTab={formActiveTab}
                  handleImageChange={handleImageChange}
                />
              )}
              {isSyllabusVisible && (
                <SyllabusCourses
                  courseId={courseId}
                  onSuccess={onSuccess}
                  editCourse={editCourse}
                  formActiveTab={formActiveTab}
                  existingChapters={chaptersList}
                />
              )}
              {isLiveBatchVisible && (
                <BatchForm
                  key="live"
                  batches={batches}
                  selectedCenter={selectedCenter}
                  latestCourse={latestCourse}
                  activeTab={formActiveTab}
                  setOpen={setOpen}
                  setBatches={setBatches}
                />
              )}
              {isPhysicalBatchVisible && (
                <BatchForm
                  key="physical"
                  batches={batches}
                  selectedCenter={selectedCenter}
                  latestCourse={latestCourse}
                  activeTab={formActiveTab}
                  setOpen={setOpen}
                  setBatches={setBatches}
                  setSelectedCenter={setSelectedCenter}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
