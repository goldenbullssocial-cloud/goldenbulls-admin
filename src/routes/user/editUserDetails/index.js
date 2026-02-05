"use-client";
import React, { useState, useEffect } from "react";
import styles from "./editUserDetails.module.scss";
import CloseIcon from "@/icons/closeIcon";
import Input from "@/components/input";
import Button from "@/components/button";
import StyledSelect from "@/components/styledSelect";
import { Country, State, City } from "country-state-city";

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
const toOption = (item) => ({
  value: item.isoCode || item.name,
  label: item.name,
  data: item,
});

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
  const [countryId, setCountryId] = useState(null);
  const [stateId, setStateId] = useState(null);
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);

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

  useEffect(() => {
    if (!customer) return;

    const c = Country.getAllCountries().find(
      (x) => x.name === customer.country,
    );
    if (c) {
      const countryOpt = toOption(c);
      setCountry(countryOpt);

      const s = State.getStatesOfCountry(c.isoCode).find(
        (x) => x.name === customer.state,
      );
      if (s) {
        const stateOpt = toOption(s);
        setState(stateOpt);

        const ci = City.getCitiesOfState(c.isoCode, s.isoCode).find(
          (x) => x.name === customer.city,
        );
        if (ci) setCity(toOption(ci));
      }
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.trimStart(),
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
              type="text"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && errors.email}
              placeholder="Enter your email"
              disabled
            />

            <div className={styles.field}>
              <label>Country</label>
              <StyledSelect
                options={Country.getAllCountries().map(toOption)}
                value={country}
                onChange={(val) => {
                  setCountry(val);
                  setState(null);
                  setCity(null);
                  setFormData((p) => ({
                    ...p,
                    country: val.label,
                    state: "",
                    city: "",
                  }));
                }}
                placeholder="Select Country"
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, country: true }))
                }
              />
              {errors?.country && (
                <>
                  <p className={styles.error}>{errors.country}</p>
                </>
              )}
            </div>

            <div className={styles.field}>
              <label>State</label>
              <StyledSelect
                options={
                  country
                    ? State.getStatesOfCountry(country.data.isoCode).map(
                        toOption,
                      )
                    : []
                }
                value={state}
                onChange={(val) => {
                  setState(val);
                  setCity(null);
                  setFormData((p) => ({
                    ...p,
                    state: val.label,
                    city: "",
                  }));
                }}
                placeholder="Select State"
                isDisabled={!country}
                onBlur={() => setTouched((prev) => ({ ...prev, state: true }))}
              />
              {errors?.state && (
                <>
                  <p className={styles.error}>{errors.state}</p>
                </>
              )}
            </div>
            <div className={styles.field}>
              <label>City</label>
              <StyledSelect
                options={
                  state
                    ? City.getCitiesOfState(
                        country.data.isoCode,
                        state.data.isoCode,
                      ).map(toOption)
                    : []
                }
                value={city}
                onChange={(val) => {
                  setCity(val);
                  setFormData((p) => ({
                    ...p,
                    city: val.label,
                  }));
                }}
                placeholder="Select City"
                isDisabled={!state}
                onBlur={() => setTouched((prev) => ({ ...prev, city: true }))}
              />
              {errors?.city && (
                <>
                  <p className={styles.error}>{errors.city}</p>
                </>
              )}
            </div>

            <div className={styles.field}>
              <label>Gender</label>
              <StyledSelect
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
                value={
                  formData.gender
                    ? {
                        value: formData.gender,
                        label:
                          formData.gender.charAt(0).toUpperCase() +
                          formData.gender.slice(1),
                      }
                    : null
                }
                onChange={(val) => {
                  setFormData((p) => ({
                    ...p,
                    gender: val.value,
                  }));
                }}
                placeholder="Select gender"
                onBlur={handleBlur}
              />
              {errors?.gender && (
                <>
                  <p className={styles.error}>{errors.gender}</p>
                </>
              )}
            </div>
          </div>
          <Button
            type="submit"
            text={isSubmitting ? "Saving..." : "Save Changes"}
            disabled={!isFormValid() || isSubmitting}
            loading={isSubmitting}
            className={
              !isFormValid() || isSubmitting ? styles.disabledButton : ""
            }
          />
        </div>
      </form>
    </div>
  );
}
