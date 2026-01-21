"use-client";
import React, { useState, useEffect } from "react";
import styles from "./editUserDetails.module.scss";
import CloseIcon from "@/icons/closeIcon";
import Input from "@/components/input";
import Button from "@/components/button";

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const validatePhone = (phone) => {
  const re = /^[0-9]{10,15}$/;
  return re.test(phone);
};

const validateField = (name, value) => {
  switch (name) {
    case "email":
      if (!value) return "Email is required";
      if (!validateEmail(value)) return "Please enter a valid email address";
      return "";
    case "phone":
      if (!value) return "Phone number is required";
      if (!validatePhone(value))
        return "Please enter a valid phone number (10-15 digits)";
      return "";
    case "firstName":
    case "lastName":
      if (!value.trim())
        return `${name === "firstName" ? "First name" : "Last name"} is required`;
      if (value.length < 2) return "Must be at least 2 characters";
      return "";
    case "city":
    case "state":
    case "country":
      if (!value.trim())
        return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
      return "";
    case "gender":
      if (!value) return "Gender is required";
      return "";
    default:
      return "";
  }
};
export default function EditUserDetails({ customer, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    firstName: customer?.firstName || "",
    lastName: customer?.lastName || "",
    phone: customer?.phone || "",
    email: customer?.email || "",
    city: customer?.city || "",
    state: customer?.state || "",
    country: customer?.country || "",
    gender: customer?.gender || "",
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
      [name]: value,
    }));
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
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      city: true,
      state: true,
      country: true,
      gender: true,
    });

    if (isValid) {
      onSubmit(formData);
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
      className={styles.editUserDetails}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <form
        className={styles.editUsermodal}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        {" "}
        <div className={styles.modalHeader}>
          <h2>Edit User Details</h2>
          <div className={styles.closeIcon} onClick={onClose}>
            <CloseIcon />
          </div>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.twoCol}>
            <Input
              smallInput
              value={formData.firstName}
              label="First Name"
              placeholder="Enter your first name"
              name="firstName"
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.firstName && errors.firstName}
              
            />
            <Input
              smallInput
              label="Last Name"
              placeholder="Enter your last name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.lastName && errors.lastName}
              
            />
            <Input
              smallInput
              label="Phone"
              placeholder="Enter your phone number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.phone && errors.phone}
              
            />
            <Input
              smallInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && errors.email}
              placeholder="Enter your email"
              
            />
            <Input
              smallInput
              label="City"
              placeholder="Enter your city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.city && errors.city}
              
            />
            <Input
              smallInput
              label="State"
              placeholder="Enter your state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.state && errors.state}
              
            />
            <Input
              smallInput
              label="Country"
              placeholder="Enter your country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.country && errors.country}
              
            />
            <Input
              smallInput
              label="Gender"
              placeholder="Select gender"
              name="gender"
              value={formData.gender}
              error={touched.gender && errors.gender}
              onChange={handleChange}
            />
          </div>
          <div className={styles.button}>
            <Button
              type="submit"
              text="Save Changes"
              disabled={!isFormValid() || isSubmitting}
              loading={isSubmitting}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
