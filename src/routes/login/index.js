"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.scss";
import Input from "@/components/input";
import { SignIn } from "@/api/auth";
import { toast } from "sonner";

const LoginBullImage = "/assets/images/login-bull.png";
const EmailIcon = "/assets/icons/email.svg";
const LockIcon = "/assets/icons/lock.svg";
const GoogleIcon = "/assets/icons/google-icon.svg";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let processedValue;

    if (type === "checkbox") {
      processedValue = checked;
    } else {
      processedValue = value.replace(/^\s+/, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await SignIn({
        email: formData.email,
        password: formData.password,
      });
      console.log(response);
      if (response.data) {
        localStorage.setItem("token", response.data.payload.token);
        if (formData.rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }
        router.push("/dashboard");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={styles.loginpageWrapper}>
      <div className={styles.leftAlignment}>
        <div className={styles.containerAlignment}>
          <div className={styles.mainrelative}>
            <div className={styles.image}>
              <img src={LoginBullImage} alt="LoginBullImage" />
            </div>
          </div>
          <div>
            <form onSubmit={handleSubmit} className={styles.box}>
              <div className={styles.contnet}>
                <h1>Administrator Login</h1>
              </div>
              <div className={styles.bottomSpacing}>
                <Input
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="Enter your email address"
                  icon={EmailIcon}
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />
              </div>
              <div className={styles.bottomSpacing}>
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  placeholder="Enter your password"
                  icon={LockIcon}
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  endAdornment={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {/* {showPassword ? <LockIcon /> : <LockIcon />} */}
                    </button>
                  }
                />
              </div>
              <div className={styles.leftRightAlignment}>
                <div className={styles.checkboxText}>
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <span>Remember me</span>
                </div>
              </div>
              <div className={styles.loginButton}>
                <button type="submit" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                  {!isLoading && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="15"
                      viewBox="0 0 20 15"
                      fill="none"
                    >
                      <path
                        d="M1.5 7.5H18M18 7.5L12 1.5M18 7.5L12 13.5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

