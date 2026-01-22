import React from "react";
import styles from "./course.module.scss";
import Input from "@/components/input";
import DragIcon from "@/icons/dragIcon";
import Button from "@/components/button";
import { ImageUpload } from "@/components/image-upload";

export default function CourseForm({
  editCourse,
  formErrors,
  handleTrimInput,
  handleIntroVideoChange,
  handleImageChange,
  handleContinue,
  videoFile,
  formActiveTab,
  instructors,
}) {
  const [selectedLanguage, setSelectedLanguage] = React.useState(
    editCourse?.language || "English",
  );
  const [selectedLevel, setSelectedLevel] = React.useState(
    editCourse?.level || "Beginner",
  );
  const [isVideoDragOver, setIsVideoDragOver] = React.useState(false);
  const [isImageDragOver, setIsImageDragOver] = React.useState(false);

  const getLanguageActions = () => [
    {
      key: "English",
      label: "English",
    },
    {
      key: "Hindi",
      label: "Hindi",
    },
    {
      key: "Arabic",
      label: "Arabic",
    },
    {
      key: "French",
      label: "French",
    },
  ];

  const getLevelActions = () => [
    {
      key: "Beginner",
      label: "Beginner",
    },
    {
      key: "Mid",
      label: "Mid",
    },
    {
      key: "Extreme",
      label: "Extreme",
    },
  ];

  const handleLanguageAction = (language) => {
    setSelectedLanguage(language);
  };

  const handleLevelAction = (level) => {
    setSelectedLevel(level);
  };

  const handleVideoDragOver = (e) => {
    e.preventDefault();
    setIsVideoDragOver(true);
  };

  const handleVideoDragLeave = (e) => {
    e.preventDefault();
    setIsVideoDragOver(false);
  };

  const handleVideoDrop = (e) => {
    e.preventDefault();
    setIsVideoDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith("video/")) {
        handleIntroVideoChange({ target: { files: [file] } });
      } else {
        // Show error for invalid file type
        console.error("Please upload a video file");
      }
    }
  };

  const handleImageDragOver = (e) => {
    e.preventDefault();
    setIsImageDragOver(true);
  };

  const handleImageDragLeave = (e) => {
    e.preventDefault();
    setIsImageDragOver(false);
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    setIsImageDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        handleImageChange(file);
      } else {
        // Show error for invalid file type
        console.error("Please upload an image file");
      }
    }
  };

  return (
    <div className={styles.liveOnlineCourses}>
      <form onSubmit={handleContinue} className={styles.box}>
        <input type="hidden" name="courseType" value={formActiveTab} />

        <div className={styles.bottomAlignment}>
          <div className={styles.chaapterVideo}>
            <span>Course Thumbnail Image</span>
            <div
              //   className={`${styles.uploadBox} ${isImageDragOver ? styles.dragOver : ""}`}
              onDragOver={handleImageDragOver}
              onDragLeave={handleImageDragLeave}
              onDrop={handleImageDrop}
            >
              <ImageUpload
                name="courseVideo"
                id="course-thumbnail"
                error={formErrors.courseVideo}
                onChange={handleImageChange}
                initialImage={editCourse?.courseVideo || null}
              />
            </div>
          </div>
        </div>
        <div className={styles.bottomAlignment}>
          <Input
            label="Course Name"
            placeholder="Course Name"
            name="name"
            defaultValue={editCourse?.CourseName || ""}
            onBlur={handleTrimInput}
            onKeyDown={(e) => {
              if (e.key === " " && !e.target.value.trim()) {
                e.preventDefault();
              }
            }}
            error={formErrors.name}
          />
        </div>
        <div className={styles.bottomAlignment}>
          <Input
            label="Course Description"
            placeholder="Course Description"
            name="description"
            defaultValue={editCourse?.description || ""}
            onBlur={handleTrimInput}
            onKeyDown={(e) => {
              if (e.key === " " && !e.target.value.trim()) {
                e.preventDefault();
              }
            }}
            error={formErrors.description}
          />
        </div>
        <div className={styles.twoCol}>
          <div className={styles.instructorField}>
            <label className={styles.label}>Instructor Name</label>
            <select
              name="instructor"
              className={styles.select}
              defaultValue={editCourse?.instructor || ""}
            >
              {instructors?.map((instructor) => (
                <option key={instructor._id} value={instructor._id}>
                  {instructor.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.languageField}>
            <label className={styles.label}>Language</label>
            <select
              name="language"
              className={styles.select}
              value={selectedLanguage}
              onChange={(e) => handleLanguageAction(e.target.value)}
            >
              {getLanguageActions().map((lang) => (
                <option key={lang.key} value={lang.key}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
          {/* <Input label='Language' placeholder='English' /> */}
        </div>
        <div className={styles.threeCol}>
          <Input
            label="Course Price ($)"
            placeholder="Course Price"
            type="number"
            step="0.01"
            min="0"
            name="price"
            defaultValue={editCourse?.price || ""}
            onWheel={(e) => e.currentTarget.blur()}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
              }
            }}
            onInput={(e) => {
              const value = e.currentTarget.value;
              if (value.includes(".")) {
                const [whole, decimal] = value.split(".");
                if (decimal && decimal.length > 2) {
                  e.currentTarget.value = `${whole}.${decimal.slice(0, 2)}`;
                }
              }
            }}
            error={formErrors.price}
          />
          <Input
            label="Course Duration"
            placeholder="Course Duration"
            type="number"
            name="hours"
            defaultValue={editCourse?.hours || ""}
            onBlur={handleTrimInput}
            onKeyDown={(e) => {
              if (e.key === " " && !e.target.value.trim()) {
                e.preventDefault();
              }
            }}
            error={formErrors.hours}
          />
          <div className={styles.levelField}>
            <label className={styles.label}>Course Level</label>
            <select
              name="courseLevel"
              className={styles.select}
              value={selectedLevel}
              onChange={(e) => handleLevelAction(e.target.value)}
            >
              {getLevelActions().map((level) => (
                <option key={level.key} value={level.key}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.chaapterVideo}>
          <span>Intro Video</span>

          <div
            className={`${styles.uploadBox} ${isVideoDragOver ? styles.dragOver : ""}`}
            onClick={() => document.getElementById("courseIntroVideo")?.click()}
            onDragOver={handleVideoDragOver}
            onDragLeave={handleVideoDragLeave}
            onDrop={handleVideoDrop}
          >
            {/* Preview / Icon */}
            {editCourse?.courseIntroVideo || videoFile ? (
              <div className={styles.previewWrapper}>
                <video
                  src={
                    videoFile
                      ? URL.createObjectURL(videoFile)
                      : editCourse?.courseIntroVideo
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

            {/* File name text */}
            <p className={styles.fileText}>
              Drag and drop video here, or click to select
            </p>

            {/* Hidden input */}
            <Input
              type="file"
              name="courseIntroVideo"
              accept="video/mp4,video/webm,video/quicktime"
              id="courseIntroVideo"
              className={styles.hiddenInput}
              onChange={handleIntroVideoChange}
            />
          </div>

          {/* Error */}
          {formErrors.videoFile && (
            <span className={styles.errorText}>{formErrors.videoFile}</span>
          )}
        </div>

        <div className={styles.buttonGrid}>
          <Button text="Continue" type="submit" />
        </div>
      </form>
    </div>
  );
}
