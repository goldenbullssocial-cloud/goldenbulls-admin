import React, { useState, useRef } from "react";
import styles from "./addUserModal.module.scss";
import CloseIcon from "@/icons/closeIcon";
import Input from "@/components/input";
import Button from "@/components/button";

const CalendarIcon = "/assets/icons/calender.svg";
const PlusIcon = "/assets/icons/plus.svg";

export default function AddUserModal({ onClose, onSubmit }) {
    const dateRef = useRef(null);
    const [formData, setFormData] = useState({
        name: "",
        courseName: "",
        issueDate: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "User name is required";
        if (!formData.courseName.trim()) newErrors.courseName = "Course name is required";
        if (!formData.issueDate) newErrors.issueDate = "Issue date is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const handleCalendarClick = () => {
        if (dateRef.current) {
            dateRef.current.showPicker();
        }
    };

    return (
        <div className={styles.addUserModal}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>ADD NEW CERTIFICATE</h2>
                    <div className={styles.closeIcon} onClick={onClose}>
                        <CloseIcon />
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formFields}>
                        <Input
                            label="User Name"
                            placeholder="Enter user name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name}
                            leftSpaceRemove
                        />

                        <Input
                            label="Course Name"
                            placeholder="Enter course name"
                            name="courseName"
                            value={formData.courseName}
                            onChange={handleChange}
                            error={errors.courseName}
                            leftSpaceRemove
                        />

                        <Input
                            label="Issue Date"
                            placeholder="YYYY-MM-DD"
                            name="issueDate"
                            type="date"
                            value={formData.issueDate}
                            onChange={handleChange}
                            error={errors.issueDate}
                            icon={CalendarIcon}
                            onIconClick={handleCalendarClick}
                            inputRef={dateRef}
                        />
                    </div>

                    <div className={styles.buttonGroup}>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <Button
                            type="submit"
                            text="Add Certificate"
                            rightIcon={true}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
