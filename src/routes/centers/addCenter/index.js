"use client";
import React, { useState, useEffect } from "react";
import styles from "./addCenter.module.scss";
import CloseIcon from "@/icons/closeIcon";
import Input from "@/components/input";
import Button from "@/components/button";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

const SaveIcon = "/assets/icons/save.svg";
const validateField = (name, value) => {
  switch (name) {
    case "name":
      if (!value) return "Center name is required";
      return "";
    case "googleMapsLink":
      if (!value) return "Google Maps link is required";
      return "";
    case "city":
    case "state":
    case "country":
      if (!value.trim())
        return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
      return "";
    default:
      return "";
  }
};
export default function AddCenter({
  onSave,
  selectedCountryId,
  selectedStateId,
  onCountryChange,
  onStateChange,
  onCityChange,
  onClose,
}) {
  const [formData, setFormData] = useState({
    name: "",
    googleMapsLink: "",
    email: "",
    city: "",
    state: "",
    country: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Validate all fields when they change and have been touched
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      if (touched[field] || isSubmitting) {
        newErrors[field] = validateField(field, formData[field]);
      }
    });
    setErrors(newErrors);
  }, [formData, touched, isSubmitting]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.trimStart(),
    }));
  };
  const LOCATION_RESET = {
    country: ["state", "city"],
    state: ["city"],
    city: [],
  };

  const handleLocationChange = (type, value) => {
    setFormData((prev) => ({
      ...prev,
      [type]: value?.name || "",
    }));

    setTouched((prev) => ({ ...prev, [type]: true }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mark all fields as touched to show validation errors
    const newTouched = {};
    Object.keys(formData).forEach((field) => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    // Validate all fields on submit
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (isValid) {
      onSave(formData);
    }
  };

  const isFormValid = () => {
    return (
      Object.values(errors).every((error) => !error) &&
      Object.keys(touched).length > 0 &&
      Object.values(formData).every((value) => Boolean(value))
    );
  };
  return (
    <div
      className={styles.addCenterModalWrapper}
      //   onClick={(e) => {
      //     e.stopPropagation();
      //     onClose();
      //   }}
    >
      <div className={styles.addCentermodal}>
        <div className={styles.modalHeader}>
          <h2>add center</h2>
          <div className={styles.closeIcon} onClick={onClose}>
            <CloseIcon />
          </div>
        </div>
        <form className={styles.modalBody} onSubmit={handleSubmit}>
          <div className={styles.twoCol}>
            <Input
              name="name"
              label="Center Name"
              placeholder="Golden Bulls Mumbai Branch"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              onBlur={handleBlur}
            />
            <Input
              name="googleMapsLink"
              label="Google Maps Link"
              placeholder="maps.google.com"
              value={formData.googleMapsLink}
              onChange={handleChange}
              error={errors.googleMapsLink}
              onBlur={handleBlur}
            />
          </div>
          <div className={styles.threeCol}>
            <div>
              <label>Country</label>
              <CountrySelect
                defaultValue={
                  formData.country ? { name: formData.country } : undefined
                }
                onChange={(value) => {
                  handleLocationChange("country", value);
                  onCountryChange && onCountryChange(value);
                }}
                placeHolder="Select Country"
              />
              {errors.country && (
                <span className={styles.error}>{errors.country}</span>
              )}
            </div>
            <div>
              <label>City</label>
              <CitySelect
                value={formData.city ? { name: formData.city } : undefined}
                containerClassName="w-full"
                countryid={selectedCountryId ? Number(selectedCountryId) : 0}
                stateid={selectedStateId ? Number(selectedStateId) : 0}
                onChange={(value) => {
                  handleLocationChange("city", value);
                  onCityChange && onCityChange(value);
                }}
                placeHolder="Select City"
                disabled={!selectedStateId}
              />
              {errors.city && (
                <span className={styles.error}>{errors.city}</span>
              )}
            </div>
            <div>
              <label>State</label>
              <StateSelect
                value={formData.state ? { name: formData.state } : undefined}
                countryid={selectedCountryId ? Number(selectedCountryId) : 0}
                onChange={(value) => {
                  handleLocationChange("state", value);
                  onStateChange && onStateChange(value);
                }}
                placeHolder="Select State"
                disabled={!selectedCountryId}
              />
              {errors.state && (
                <span className={styles.error}>{errors.state}</span>
              )}
            </div>
          </div>
          <div className={styles.saveButton}>
            <Button type="submit" text="Save" icon={SaveIcon} />
          </div>
        </form>
      </div>
    </div>
  );
}
