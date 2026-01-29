"use client";
import React, { useEffect, useState } from "react";
import styles from "./courses.module.scss";
import CoursesTab from "./coursesTab";
import ClockInIcon from "@/icons/clockIcon";
import StarIcon from "@/icons/starIcon";
import CreateCourse from "./createCourse";
import { getAllCourseCategory } from "@/api/category";
import {
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse,
  uploadImage,
  getChapters,
} from "@/api/course";
import { toast } from "sonner";
import UserHeader from "@/components/userHeader";
import CourseCard from "./courseCard";
import DetailCourseView from "./detailCourseView";
import { getAllCenters } from "@/api/banner";
import { format } from "date-fns";
import DeleteCourse from "./deleteCourse";
import NoDataFound from "@/components/noDataFound";
import CommonLoader from "@/components/commonLoader";
const CardImage = "/assets/images/course-user.png";
const PlusIcon = "/assets/icons/plus.svg";

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("coursesActiveTab") || "recorded";
    }
    return "recorded";
  });
  const [formActiveTab, setFormActiveTab] = useState("recorded");
  const [isTabSwitching, setIsTabSwitching] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Date states...
  const [recordedStartDate, setRecordedStartDate] = useState();
  const [recordedEndDate, setRecordedEndDate] = useState();
  const [liveStartDate, setLiveStartDate] = useState();
  const [liveEndDate, setLiveEndDate] = useState();
  const [physicalStartDate, setPhysicalStartDate] = useState();
  const [physicalEndDate, setPhysicalEndDate] = useState();

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingInstructors, setLoadingInstructors] = useState(false);
  const [error, setError] = useState(null);
  const [instructorError, setInstructorError] = useState("");
  const [editCourse, setEditCourse] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isLiveBatchVisible, setIsLiveBatchVisible] = useState(false);
  const [isPhysicalBatchVisible, setIsPhysicalBatchVisible] = useState(false);
  const [isSyllabusVisible, setIsSyllabusVisible] = useState(false);
  const [isChaptersVisible, setIsChaptersVisible] = useState(false);
  const [latestCourse, setLatestCourse] = useState(null);
  const [viewCourseModalOpen, setViewCourseModalOpen] = useState(false);
  const [liveBatches, setLiveBatches] = useState([
    {
      id: "",
      batchName: "",
      description: "",
      startDate: null,
      endDate: null,
      time: null,
      meetingLink: null,
      courseId: "",
    },
  ]);
  const [batchErrors, setBatchErrors] = useState({});
  const [syllabusList, setSyllabusList] = useState([]);
  const [physicalBatches, setPhysicalBatches] = useState([
    {
      id: "",
      batchName: "",
      description: "",
      centerId: "",
      startDate: null,
      endDate: null,
      time: null,
      courseId: "",
    },
  ]);

  // Clear batches when the form is closed
  useEffect(() => {
    if (!isLiveBatchVisible) {
      setLiveBatches([
        {
          id: "",
          batchName: "",
          description: "",
          startDate: null,
          endDate: null,
          time: null,
          meetingLink: null,
          courseId: "",
        },
      ]);
    }
    if (!isPhysicalBatchVisible) {
      setPhysicalBatches([
        {
          id: "",
          batchName: "",
          description: "",
          centerId: "",
          startDate: null,
          endDate: null,
          time: null,
          courseId: "",
        },
      ]);
    }
  }, [isPhysicalBatchVisible, isLiveBatchVisible]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [chaptersList, setChaptersList] = useState([]);
  // Add error state
  const [formErrors, setFormErrors] = useState({});

  // Add loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [createCourseOpen, setCreateCourseOpen] = useState(false);

  const fetchCenters = async () => {
    try {
      const response = await getAllCenters();
      if (response.success) {
        setCenters(response.payload?.data || []);
      } else throw new Error(response.message);
    } catch (err) {
      console.error("Error loading centers:", err);
      toast.error("Failed to load centers");
    }
  };

  const fetchCourseChapters = async (courseId) => {
    try {
      const response = await getChapters(courseId);
      if (response.success && response.payload?.data) {
        const chaptersData = response.payload.data.map((chapter) => ({
          id: chapter._id,
          chapterName: chapter.chapterName || "",
          description: chapter.description || "",
          duration: chapter.duration || "",
          videoFile: null,
          videoUrl: chapter.chapterVideo || "",
          chapterNo: chapter.chapterNo || "",
          chapterImage: chapter.thumbnail || null,
          chapterImageUrl: chapter.thumbnail || "",
        }));
        setChaptersList(chaptersData);
        return chaptersData;
      }
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
    return [];
  };

  useEffect(() => {
    if (latestCourse) fetchCenters();
  }, [latestCourse]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCourseCategory();
        if (response.success) {
          setCategories(response.payload?.data || []);
        } else {
          console.error("Failed to fetch categories:", response.message);
          toast.error("Failed to load categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("An error occurred while loading categories");
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (file) => {
    if (file && file.size >= 1 * 1024 * 1024) {
      toast.error("Image size must be less than 1MB");
      return;
    }
    setImageFile(file);
  };

  const handleIntroVideoChange = (e) => {
    // Clear any previous errors first
    setFormErrors((prev) => ({ ...prev, introVideo: "" }));

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 10 * 1024 * 1024;
      if (!file) {
        setFormErrors((prev) => ({
          ...prev,
          introVideo: "Please select a video file",
        }));
        e.target.value = "";
        setVideoFile(null);
        return;
      }

      if (!file.type.startsWith("video/")) {
        toast.error("Please upload a valid video file (MP4, WebM, etc.)");
        setFormErrors((prev) => ({
          ...prev,
          introVideo: "Please upload a valid video file (MP4, WebM, etc.)",
        }));
        e.target.value = "";
        setVideoFile(null);
        return;
      }

      if (file.size > maxSize) {
        toast.error("Video file size must be less than 10MB");
        setFormErrors((prev) => ({
          ...prev,
          introVideo: "Video file size must be less than 10MB",
        }));
        e.target.value = "";
        setVideoFile(null);
        return;
      }

      setVideoFile(file);
    } else {
      // If no file is selected, clear the video file
      setVideoFile(null);
    }
  };

  const handleTrimInput = (e) => {
    const trimmedValue = e.target.value.trim();
    if (trimmedValue !== e.target.value) {
      e.target.value = trimmedValue;
      const event = new Event("input", { bubbles: true });
      e.target.dispatchEvent(event);
    }
  };

  const validateForm = (formData, courseType) => {
    const errors = {};

    const name = formData.get("name")?.toString().trim() || "";
    const description = formData.get("description")?.toString().trim() || "";
    const instructor = formData.get("instructor")?.toString().trim() || "";
    const courseLevel = formData.get("courseLevel")?.toString().trim() || "";
    const introVideo = formData.get("introVideo")?.toString().trim() || "";

    if (!courseLevel) {
      errors.courseLevel = "Course level is required";
    }

    if (!name) {
      errors.name = "Course name is required";
    } else if (name.length < 5) {
      errors.name = "Course name must be at least 5 characters";
    }

    if (!description) {
      errors.description = "Description is required";
    } else if (description.length < 20) {
      errors.description = "Description must be at least 20 characters";
    }

    if (!instructor) {
      errors.instructor = "Instructor is required";
    }

    // Validate price (required and > 0)
    const priceValue = formData.get("price")?.toString();
    const price = priceValue ? parseFloat(priceValue) : 0;
    if (!priceValue || isNaN(price) || price <= 0) {
      errors.price = "Please enter valid price greater than 0";
    }

    // Validate hours (required and > 0)
    const hoursValue = formData.get("hours")?.toString();
    const hours = parseFloat(hoursValue || "");
    if (!hoursValue || isNaN(hours) || hours <= 0) {
      errors.hours = "Please enter valid hours greater than 0";
    }

    // Image required on create (skip when editing)
    if (!editCourse && !imageFile) {
      errors.image = "Please upload an image";
    } else if (imageFile && imageFile.size >= 1 * 1024 * 1024) {
      errors.image = "Image size must be less than 1MB";
    }

    if (!editCourse && !videoFile) {
      errors.videoFile = "Please upload an video";
    }

    // if (courseType === "physical") {
    //   // if (!formData.get("email")?.toString().trim()) {
    //   //   errors.email = "Email is required";
    //   // } else if (
    //   //   !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    //   //     formData.get("email")?.toString().trim().toLowerCase() || "",
    //   //   )
    //   // ) {
    //   //   errors.email = "Please enter a valid email address";
    //   // }

    //   // // For required phone
    //   // if (!formData.get("phone")?.toString().trim()) {
    //   //   errors.phone = "Phone number is required";
    //   // }
    //   // else if (
    //   //   !/^[+\d\s-]{10,}$/.test(formData.get("phone")?.toString().trim() || "")
    //   // ) {
    //   //   errors.phone = "Please enter a valid phone number (min 10 digits)";
    //   // }
    // }
    return errors;
  };

  // Add this URL validation helper function
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Fetch courses with pagination and filtering
  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCourses({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearchTerm,
        courseType: activeTab,
      });

      if (response && response.success) {
        const { data, count } = response.payload;

        setCourses(data || []);
        setTotalItems(count || 0);
        setTotalPages(Math.ceil((count || 0) / itemsPerPage));
      } else {
        setError(response?.message || "Failed to load courses");
      }
    } catch (err) {
      console.error("Error in fetchCourses:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // Add this useEffect near your other effects
  useEffect(() => {
    if (editCourse) {
      // Reset video file state when editing a course
      setVideoFile(null);
    }
  }, [editCourse]);

  // Fetch instructors and courses when component mounts
  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch courses when pagination or filters change
  useEffect(() => {
    setLoading(true);
    fetchCourses();
  }, [currentPage, itemsPerPage, debouncedSearchTerm, activeTab]);

  // Function to reset form and date states
  const resetForm = () => {
    setEditCourse(null);
    setRecordedStartDate(undefined);
    setRecordedEndDate(undefined);
    setLiveStartDate(undefined);
    setLiveEndDate(undefined);
    setPhysicalStartDate(undefined);
    setPhysicalEndDate(undefined);
    setFormErrors({});
    setImageFile(null);
    // setActiveTab('recorded');
    // Reset form fields if using a form ref
    const form = document.querySelector("form");
    if (form) {
      form.reset();
    }
  };

  // Add this effect to initialize form fields when editing
  useEffect(() => {
    if (editCourse) {
      // Set the active tab based on course type
      setActiveTab(editCourse.courseType || "recorded");
      setFormActiveTab(editCourse.courseType || "recorded");

      // Set date states if they exist
      if (editCourse.courseStart) {
        setRecordedStartDate(new Date(editCourse.courseStart));
        setLiveStartDate(new Date(editCourse.courseStart));
        setPhysicalStartDate(new Date(editCourse.courseStart));
      }
      if (editCourse.courseEnd) {
        setRecordedEndDate(new Date(editCourse.courseEnd));
        setLiveEndDate(new Date(editCourse.courseEnd));
        setPhysicalEndDate(new Date(editCourse.courseEnd));
      }

      // Fetch existing chapters for the course
      fetchCourseChapters(editCourse._id);
    } else {
      resetForm();
      setChaptersList([]);
    }
  }, [editCourse]);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  async function handleCourseSubmit(e) {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting) return false;

    setIsSubmitting(true);
    setFormErrors({});

    try {
      const formData = new FormData(e.currentTarget);
      const courseType = formData.get("courseType");

      // Get the correct dates based on the active tab
      let startDate = "";
      let endDate = "";

      if (formActiveTab === "recorded") {
        startDate = recordedStartDate
          ? format(recordedStartDate, "yyyy-MM-dd")
          : "";
        endDate = recordedEndDate ? format(recordedEndDate, "yyyy-MM-dd") : "";
      }

      // Add the dates to form data
      formData.set("courseStart", startDate);
      formData.set("courseEnd", endDate);

      // Validate form
      const errors = validateForm(formData, courseType?.toString() || "");
      setFormErrors(errors);

      // If there are errors, stop submission
      if (Object.keys(errors).length > 0) {
        setIsSubmitting(false);
        return false;
      }

      // Create a new FormData for the API request
      const apiFormData = new FormData();

      // Add all form fields to the FormData
      apiFormData.append("courseType", formData.get("courseType") || "");
      apiFormData.append("CourseName", formData.get("name") || "");
      apiFormData.append("description", formData.get("description") || "");
      apiFormData.append("price", formData.get("price") || "0");
      apiFormData.append("hours", formData.get("hours") || "0");

      apiFormData.append("instructor", formData.get("instructor") || "");
      apiFormData.append("language", formData.get("language") || "english");
      apiFormData.append("courseLevel", formData.get("courseLevel") || "");

      if (videoFile) {
        try {
          const videoResponse = await uploadImage(videoFile);
          if (videoResponse?.success && videoResponse?.payload) {
            apiFormData.append("courseIntroVideo", videoResponse.payload);
          } else {
            throw new Error("Failed to upload video: Invalid response");
          }
        } catch (error) {
          console.error("Error uploading video:", error);
          toast.error("Failed to upload video");
          setIsSubmitting(false);
          return;
        }
      } else if (!editCourse?._id && editCourse?.courseIntroVideo) {
        if (editCourse.courseIntroVideo !== "undefined") {
          apiFormData.append("courseIntroVideo", editCourse.courseIntroVideo);
        }
      }

      const defineCourse = formData.get("defineCourse");
      if (defineCourse) {
        apiFormData.append("isDefineCourse", defineCourse.toString());
      }

      // Add course type specific fields
      if (courseType === "recorded") {
        apiFormData.append("courseStart", startDate);
        apiFormData.append("courseEnd", endDate);
      } else if (courseType === "physical") {
        apiFormData.append("email", formData.get("email") || "");
        apiFormData.append("phone", formData.get("phone") || "");
        // apiFormData.append('address', formData.get('address') || '');
      }

      if (imageFile) {
        apiFormData.append("image", imageFile);
      }

      const categoryId = formData.get("courseCategory");
      if (categoryId) {
        apiFormData.append("courseCategory", categoryId.toString());
      }

      try {
        let data;
        if (editCourse && editCourse._id) {
          // Update existing course
          data = await updateCourse(editCourse._id, apiFormData);
        } else {
          // Create new course
          data = await createCourse(apiFormData);
        }

        if (data.success) {
          setLatestCourse(data.payload);
          if (!editCourse) {
            setIsSyllabusVisible(true);
          } else {
            if (activeTab === "recorded") {
              setCreateCourseOpen(false);
              setIsSyllabusVisible(true);
            }

            if (activeTab === "live") {
              setCreateCourseOpen(false);
              setIsSyllabusVisible(true);
            }
            if (activeTab === "physical") {
              setCreateCourseOpen(false);
              setIsSyllabusVisible(true);
            }
          }
          toast.success(
            editCourse
              ? "Course updated successfully"
              : "Course created successfully",
            {
              description:
                data?.message ||
                (editCourse
                  ? "The course has been updated."
                  : "The course has been created."),
            },
          );
          // Refresh course list
          const refreshed = await getCourses({
            page: currentPage,
            limit: itemsPerPage,
            search: debouncedSearchTerm,
            courseType: activeTab,
          });
          setCourses(refreshed.payload.data);
          return true;
        } else {
          toast.error(
            error.response?.data?.message ||
              (editCourse
                ? "Failed to update course"
                : "Failed to create course"),
            {
              description: error.response?.data?.error || error.message,
            },
          );
          return false;
        }
      } catch (err) {
        if (err.response?.status === 413) {
          toast.error("File too large", {
            description:
              "The file you are trying to upload exceeds the maximum allowed size. Please try with a smaller file.",
          });
        } else {
          toast.error("Failed to update course", {
            description:
              err instanceof Error ? err.message : "An error occurred.",
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error submitting course:", error);
      if (error.response?.status === 413) {
        toast.error("File too large", {
          description:
            "The file you are trying to upload exceeds the maximum allowed size. Please try with a smaller file.",
        });
      } else {
        toast.error(
          error instanceof Error ? error.message : "Failed to save course",
        );
      }
      setIsSubmitting(false);
    }
  }

  const handleTabChange = (value) => {
    setLoading(true);
    setIsTabSwitching(true);
    setActiveTab(value);
    localStorage.setItem("coursesActiveTab", value);
    setCourses([]);

    setTimeout(() => {
      setIsTabSwitching(false);
    }, 500);
  };

  const isTabDisabled = (tabType) => {
    if (!editCourse) return false;
    return editCourse.courseType !== tabType;
  };

  const handleFormTabChange = (value) => {
    if (isPhysicalBatchVisible || isLiveBatchVisible || isSyllabusVisible) {
      toast.error("Please Fill all nessary fields");
      return;
    }
    setIsLiveBatchVisible(false);
    setIsPhysicalBatchVisible(false);
    setIsSyllabusVisible(false);
    if (editCourse && editCourse.courseType !== value) {
      // Don't allow changing tabs when editing a course
      return;
    }
    setFormActiveTab(value);
  };

  const renderCourseList = (courses, emptyMessage) => {
    if (isTabSwitching || loading) {
      return <CommonLoader />;
    }
    if (error) {
      return <div className="text-red-500">{error}</div>;
    } else {
      return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {courses.map((course) => (
            <CourseCard
              activeTab={activeTab}
              onView={() => {
                setSelectedCourse(course);
                setViewCourseModalOpen(true);
              }}
              onEdit={() => {
                setEditCourse(course);
                setOpen(true);
                setIsSyllabusVisible(false);
                setIsPhysicalBatchVisible(false);
                setIsLiveBatchVisible(false);
                setIsChaptersVisible(false);
              }}
              onDelete={() => {
                setCourseToDelete(course);
                setDeleteDialogOpen(true);
              }}
              key={course._id || course.CourseName}
              course={course}
            />
          ))}
          {courses.length === 0 && (
            <div className="col-span-full text-center text-gray-400">
              {emptyMessage}
            </div>
          )}
        </div>
      );
    }
  };
  const recordedSteps = ["Course Details", "Syllabus", "Chapters"];
  const steps = ["Course Details", "Syllabus", "Batch"];
  let activeStep = 1;

  if (isSyllabusVisible) activeStep = 2;
  if (isChaptersVisible) activeStep = 3;
  if (isPhysicalBatchVisible) activeStep = 3;
  if (isLiveBatchVisible) activeStep = 3;

  const handleStepperClick = (step) => {
    if (step === activeStep) return;

    if (step === 1) {
      setIsSyllabusVisible(false);
      setIsChaptersVisible(false);
      setIsLiveBatchVisible(false);
      setIsPhysicalBatchVisible(false);
      return;
    }

    if (!latestCourse?._id) {
      toast.error("Please save the course before navigating the steps.");
      return;
    }

    const showSyllabus = step === 2;
    const showRecordedChapters = step === 3 && formActiveTab === "recorded";
    const showLiveBatch = step === 3 && formActiveTab === "live";
    const showPhysicalBatch = step === 3 && formActiveTab === "physical";

    setIsSyllabusVisible(showSyllabus);
    setIsChaptersVisible(showRecordedChapters);
    setIsLiveBatchVisible(showLiveBatch);
    setIsPhysicalBatchVisible(showPhysicalBatch);
  };
  const canClose = () => {
    if (latestCourse?._id !== undefined || !editCourse) {
      if (isSyllabusVisible && (!syllabusList || syllabusList.length === 0)) {
        toast.error("Cannot close: Please add at least one syllabus");
        return false;
      }

      if (activeTab === "recorded") {
        if (isChaptersVisible && chaptersList.length === 0) {
          toast.error("Cannot close: Please add at least one chapter");
          return false;
        }
      }

      if (activeTab === "live") {
        if (
          isLiveBatchVisible &&
          (!liveBatches ||
            liveBatches.length === 0 ||
            liveBatches[0]?.id === "")
        ) {
          toast.error("Cannot close: Please add at least one valid live batch");
          return false;
        }
      }

      if (activeTab === "physical") {
        if (
          !physicalBatches ||
          physicalBatches.length === 0 ||
          physicalBatches[0]?.id === ""
        ) {
          toast.error("Cannot close: Please add at least one physical batch");
          return false;
        }
      }
    }

    return true;
  };

  const handleClose = () => {
    // if (!canClose()) return;

    setOpen(false);
    setFormErrors({});
    setIsSubmitting(false);
    setEditCourse(null);

    setRecordedStartDate(undefined);
    setRecordedEndDate(undefined);
    setLiveStartDate(undefined);
    setLiveEndDate(undefined);
    setPhysicalStartDate(undefined);
    setPhysicalEndDate(undefined);

    setIsPhysicalBatchVisible(false);
    setIsLiveBatchVisible(false);

    if (!editCourse) {
      setLiveBatches([
        {
          id: "",
          batchName: "",
          description: "",
          startDate: null,
          endDate: null,
          courseId: "",
        },
      ]);

      setPhysicalBatches([
        {
          id: "",
          batchName: "",
          description: "",
          startDate: null,
          endDate: null,
          courseId: "",
        },
      ]);
    }

    const form = document.querySelector("form");
    form?.reset();
  };

  const handleDeleteCourse = async (id) => {
    setDeleteDialogOpen(false);
    try {
      const data = await deleteCourse(id);
      if (data.success) {
        toast.success("Course deleted successfully", {
          description: data?.message || "The course has been deleted.",
        });
        // Refresh course list
        const refreshed = await getCourses({
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearchTerm,
          courseType: activeTab,
        });
        setCourses(refreshed.payload.data);
      } else {
        toast.error("Failed to delete course", {
          description: data?.message || "An error occurred.",
        });
      }
    } catch (err) {
      toast.error("Failed to delete course", {
        description: err instanceof Error ? err.message : "An error occurred.",
      });
    }
  };

  return (
    <>
      <UserHeader
        buttonText="Create Course"
        icon={PlusIcon}
        HeaderText="Courses"
        DescriptionText="Create, organize, and manage all courses"
        onClick={() => {
          setOpen(true);
          setCreateCourseOpen(true);
          setFormActiveTab(activeTab);
          setIsSyllabusVisible(false);
          setIsPhysicalBatchVisible(false);
          setIsLiveBatchVisible(false);
          setIsChaptersVisible(false);
        }}
        placeholder="Search Courses"
        onChange={(e) => setSearchTerm(e.target.value.trimStart())}
        value={searchTerm}
      />
      <div className={styles.coursesPageAlignment}>
        <CoursesTab activeTab={activeTab} setActiveTab={setActiveTab} />

        <CourseCard
          courses={courses}
          onView={(course) => {
            setSelectedCourse(course);
            setViewCourseModalOpen(true);
          }}
          loading={loading}
          onEdit={(course) => {
            setEditCourse(course);
            setOpen(true);
            setCreateCourseOpen(true);
            setIsSyllabusVisible(false);
            setIsPhysicalBatchVisible(false);
            setIsLiveBatchVisible(false);
            setIsChaptersVisible(false);
          }}
          onDelete={(course) => {
            setCourseToDelete(course);
            setDeleteDialogOpen(true);
          }}
        />
        {open && (
          <CreateCourse
            editCourse={editCourse}
            formErrors={formErrors}
            handleTrimInput={handleTrimInput}
            createCourseOpen={createCourseOpen}
            handleIntroVideoChange={handleIntroVideoChange}
            handleContinue={async (e) => {
              const isFormValid = await handleCourseSubmit(e);
              if (!isFormValid) return; // Don't proceed if form is invalid

              // Only proceed if form is valid
              setCreateCourseOpen(false);
              setIsSyllabusVisible(true);
            }}
            setSelectedCenter={setSelectedCenter}
            videoFile={videoFile}
            formActiveTab={formActiveTab}
            onClose={handleClose}
            isSyllabusVisible={isSyllabusVisible}
            courseId={latestCourse?._id}
            isLiveBatchVisible={isLiveBatchVisible}
            isPhysicalBatchVisible={isPhysicalBatchVisible}
            onSuccess={() => {
              if (activeTab === "recorded") {
                setIsSyllabusVisible(false);
                setOpen(false);
              }
              if (activeTab === "live") {
                setIsSyllabusVisible(false);
                setIsLiveBatchVisible(true);
              }
              if (activeTab === "physical") {
                setIsSyllabusVisible(false);
                setIsPhysicalBatchVisible(true);
              }
            }}
            setFormActiveTab={setFormActiveTab}
            setChaptersList={(chapters) => {
              setChaptersList(chapters);
            }}
            batches={physicalBatches || liveBatches}
            selectedCenter={selectedCenter}
            latestCourse={latestCourse}
            setOpen={setOpen}
            setBatches={setPhysicalBatches || setLiveBatches}
            chaptersList={chaptersList}
          />
        )}
        {viewCourseModalOpen && (
          <DetailCourseView
            course={selectedCourse}
            onClose={() => setViewCourseModalOpen(false)}
            onEdit={(course) => {
              setEditCourse(course);
              setOpen(true);
              setCreateCourseOpen(true);
              setFormActiveTab(activeTab);
              setIsSyllabusVisible(false);
              setIsPhysicalBatchVisible(false);
              setIsLiveBatchVisible(false);
              setIsChaptersVisible(false);
              setViewCourseModalOpen(false);
            }}
            onDelete={() => {
              setCourseToDelete(selectedCourse);
              setDeleteDialogOpen(true);
              setViewCourseModalOpen(false);
            }}
          />
        )}
      </div>
      {deleteDialogOpen && (
        <DeleteCourse
          course={courseToDelete}
          onClose={() => setDeleteDialogOpen(false)}
          onDelete={() =>
            courseToDelete && handleDeleteCourse(courseToDelete._id)
          }
        />
      )}
    </>
  );
}
