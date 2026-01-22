"use client";

import { useState, useRef } from "react";
import { UploadCloud, Trash2 } from "lucide-react";
import { toast } from "sonner";
import styles from "./imageupload.module.scss";

export function ImageUpload({
  name,
  id,
  error,
  onChange,
  initialImage = null,
  className = "",
}) {
  const [imagePreview, setImagePreview] = useState(initialImage);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (file && file.type.startsWith("image/")) {
      if (file.size >= 1 * 1024 * 1024) {
        toast.error("Image size must be less than 1MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        onChange?.(file);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select an image file jpg, png, jpeg");
      return;
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size >= 1 * 1024 * 1024) {
        toast.error("Image size must be less than 1MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        onChange?.(file);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select an image file jpg, png, jpeg");
      return;
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onChange?.(null);
  };

  return (
    <div className={`${styles.imageUpload} ${className}`}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          id={id}
          name={name}
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        {imagePreview ? (
          <div className={styles.preview}>
            <img src={imagePreview} alt="Preview" />
            <button
              type="button"
              className={styles.removeBtn}
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
            >
              <Trash2 />
            </button>
          </div>
        ) : (
          <div className={styles.placeholder}>
            <UploadCloud />
            <p>Drag & drop an image here, or click to select</p>
          </div>
        )}
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
