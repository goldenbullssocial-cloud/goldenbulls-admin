import React from "react";
import styles from "./course.module.scss";
import Input from "@/components/input";
import DragIcon from "@/icons/dragIcon";
import Button from "@/components/button";
import { ImageUpload } from "@/components/image-upload";
import StyledSelect from "@/components/styledSelect";

export default function CourseForm({
  editCourse,
  formErrors,
  handleTrimInput,
  handleIntroVideoChange,
  handleImageChange,
  handleContinue,
  videoFile,
  formActiveTab,
}) {
  const [selectedLanguage, setSelectedLanguage] = React.useState(
    editCourse?.language || "English",
  );
  const [selectedLevel, setSelectedLevel] = React.useState(
    editCourse?.level || "Beginner",
  );
  const [isVideoDragOver, setIsVideoDragOver] = React.useState(false);
  const [isImageDragOver, setIsImageDragOver] = React.useState(false);
  const [isFree, setIsFree] = React.useState(editCourse?.isFree || false);
  const [priceValue, setPriceValue] = React.useState(editCourse?.price || "");

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
  const handleLanguageAction = (value) => {
    setSelectedLanguage(value);
    // Update the hidden input value when language changes
    const form = document.querySelector("form");
    if (form) {
      const hiddenInput = form.querySelector('input[name="language"]');
      if (hiddenInput) {
        hiddenInput.value = value;
      }
    }
  };

  // Add hidden input for language on component mount
  React.useEffect(() => {
    const form = document.querySelector("form");
    if (form) {
      // Remove any existing hidden language input
      const existingInput = form.querySelector('input[name="language"]');
      if (existingInput) existingInput.remove();

      // Add new hidden input
      const hiddenInput = document.createElement("input");
      hiddenInput.type = "hidden";
      hiddenInput.name = "language";
      hiddenInput.value = selectedLanguage;
      form.appendChild(hiddenInput);
    }

    // Cleanup function to remove the input when component unmounts
    return () => {
      if (form) {
        const input = form.querySelector('input[name="language"]');
        if (input) input.remove();
      }
    };
  }, [selectedLanguage]);

  // Add hidden input for courseLevel on component mount and cleanup on unmount
  React.useEffect(() => {
    const form = document.querySelector("form");
    if (form) {
      // Create hidden input for courseLevel if it doesn't exist
      const existingInput = form.querySelector('input[name="courseLevel"]');
      if (existingInput) existingInput.remove();

      const newInput = document.createElement("input");
      newInput.type = "hidden";
      newInput.name = "courseLevel";
      newInput.value = selectedLevel;
      form.appendChild(newInput);
    }

    return () => {
      if (form) {
        const input = form.querySelector('input[name="courseLevel"]');
        if (input) input.remove();
      }
    };
  }, [selectedLevel]);

  const handleLevelAction = (level) => {
    setSelectedLevel(level);
    // Update the hidden input value when level changes
    const form = document.querySelector("form");
    if (form) {
      const hiddenInput = form.querySelector('input[name="courseLevel"]');
      if (hiddenInput) {
        hiddenInput.value = level;
      } else {
        // If hidden input doesn't exist, create it
        const newInput = document.createElement("input");
        newInput.type = "hidden";
        newInput.name = "courseLevel";
        newInput.value = level;
        form.appendChild(newInput);
      }
    }
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
              onDragOver={handleImageDragOver}
              onDragLeave={handleImageDragLeave}
              onDrop={handleImageDrop}
            >
              <ImageUpload
                name="courseVideo"
                id="courseVideo"
                error={formErrors.image}
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
            <div>
              <Input
                label="Instructor Name"
                placeholder="Instructor Name"
                name="instructor"
                defaultValue={editCourse?.instructor || ""}
                onBlur={(e) => {
                  handleTrimInput(e);
                  // Ensure the form's input is updated
                  const form = e.target.closest("form");
                  if (form) {
                    const hiddenInput = form.querySelector(
                      'input[name="instructor"]',
                    );
                    if (hiddenInput) {
                      hiddenInput.value = e.target.value.trim();
                    }
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === " " && !e.target.value.trim()) {
                    e.preventDefault();
                  }
                }}
                error={formErrors.instructor}
              />
              <input
                type="hidden"
                name="instructor"
                value={editCourse?.instructor || ""}
              />
            </div>
          </div>
          <div className={styles.languageField}>
            <label className={styles.label}>Language</label>
            <StyledSelect
              options={getLanguageActions()}
              value={getLanguageActions().find(
                (lang) => lang.key === selectedLanguage,
              )}
              onChange={(selectedOption) => {
                handleLanguageAction(selectedOption.key);
                // Ensure the form's hidden input is updated
                const form = document.querySelector("form");
                if (form) {
                  const hiddenInput = form.querySelector(
                    'input[name="language"]',
                  );
                  if (hiddenInput) {
                    hiddenInput.value = selectedOption.key;
                  } else {
                    // If hidden input doesn't exist, create it
                    const newInput = document.createElement("input");
                    newInput.type = "hidden";
                    newInput.name = "language";
                    newInput.value = selectedOption.key;
                    form.appendChild(newInput);
                  }
                }
              }}
              placeholder="Select language"
            />
          </div>
          {/* <Input label='Language' placeholder='English' /> */}
        </div>
        <div className={styles.threeCol}>
          <div className={styles.priceField}>
            <Input
              label="Course Price ($)"
              placeholder="Course Price"
              type="number"
              step="0.01"
              min="0"
              name="price"
              value={isFree ? "0" : priceValue}
              onChange={(e) => setPriceValue(e.target.value)}
              disabled={isFree}
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
            <div className={styles.checkboxAlignment}>
              <label className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  name="isFree"
                  checked={isFree}
                  onChange={(e) => setIsFree(e.target.checked)}
                />
                <span className={styles.checkmark}></span>
                <span className={styles.label}>Free Course</span>
              </label>
            </div>
          </div>
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
            <StyledSelect
              options={getLevelActions()}
              value={getLevelActions().find(
                (level) => level.key === selectedLevel,
              )}
              onChange={(selectedOption) =>
                handleLevelAction(selectedOption.key)
              }
              placeholder="Select course level"
            />
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
