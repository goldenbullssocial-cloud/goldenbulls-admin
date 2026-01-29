"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from "./algobots.module.scss";
import Button from "@/components/button";
import AddAlgobot from "./addAlgobot";
import UserHeader from "@/components/userHeader";
import {
  createAlgoBot,
  getAllAlgoBots,
  deleteAlgoBot,
  updateAlgoBot,
  getCategoryDropdown,
  getBotProviderDropDown,
  getBotDropDown,
  uploadAlgoBotImage,
  createAlgoBotPlan,
  updateAlgoBotPlan,
  deleteAlgoBotPlan,
  getLanguageDropDown,
} from "@/api/algobot";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";
import Dropdown from "@/components/dropdown";
import ViewIcon from "../../../public/assets/icons/Eye.svg";
import EditIcon from "../../../public/assets/icons/Edit.svg";
import InactiveIcon from "../../../public/assets/icons/InactiveUser.svg";
import DeleteIcon from "../../../public/assets/icons/Delete.svg";
import DeleteAlgobot from "./deleteAlgobot";
import NoDataFound from "@/components/noDataFound";
import CommonLoader from "@/components/commonLoader";

const formSchema = z.object({
  title: z
    .string()
    .nonempty("Strategy title is required")
    .min(2, "Strategy name must be at least 2 characters")
    .max(50, "Strategy name must be at most 50 characters")
    .regex(
      /^[a-zA-Z0-9\s\-()]+$/,
      "Strategy name can only contain letters, numbers, spaces, hyphens, and parentheses",
    ),

  categoryId: z.string().min(1, "Category is required"),
  returns: z.string().min(1, "Returns is required"),
  risk: z.string().min(1, "Risk is required"),
  link: z.string().min(1, "Link is required"),
  shortDescription: z
    .string()
    .nonempty("Short Description is required")
    .min(10, "Short description must be at least 10 characters")
    .max(200, "Short description must be at most 200 characters"),

  description: z
    .string()
    .nonempty("Description is required")
    .refine(
      (val) => {
        // Remove HTML tags and check if there's actual content
        const textContent = val.replace(/<[^>]*>?/gm, "").trim();
        return textContent.length >= 10;
      },
      { message: "Description must be at least 10 characters" },
    ),

  price: z.string().optional(),

  discount: z.string().optional(),

  botProviderId: z.string().optional(),
  botId: z.string().optional(),

  plan: z.string().optional(),

  // links: z
  //   .array(
  //     z.object({
  //       url: z
  //         .string()
  //         .min(1, "Video link URL is required")
  //         .refine(
  //           (val) => {
  //             const videoPlatforms = [
  //               /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
  //               /^(https?:\/\/)?(www\.)?vimeo\.com\/.+$/,
  //               /^(https?:\/\/)?(www\.)?dailymotion\.com\/.+$/,
  //               /^(https?:\/\/)?(www\.)?facebook\.com\/.*\/videos\/.+$/,
  //               /^(https?:\/\/)?(www\.)?drive\.google\.com\/file\/.+$/,
  //               /^(https?:\/\/)?(www\.)?streamable\.com\/.+$/,
  //             ];
  //             return videoPlatforms.some((regex) => regex.test(val));
  //           },
  //           {
  //             message: "Please enter a valid video link.",
  //           },
  //         ),
  //       language: z.string().optional(),
  //     }),
  //   )
  //   .min(1, "At least one video link is required"),

  imageUrl: z.any().optional(),
});
export default function Algobots() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBotId, setCurrentBotId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [algobots, setAlgobots] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [botToDelete, setBotToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [plans, setPlans] = useState([]);
  const [step, setStep] = useState(1);
  const [step1, setStep1] = useState({ links: [{ url: "", language: "" }] });
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const dropdownRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);
  const [providers, setProviders] = useState([]);
  const [bots, setBots] = useState([]);
  const [filteredBots, setFilteredBots] = useState([]);
  const [isFetchingProviders, setIsFetchingProviders] = useState(false);
  const [isFetchingBotsList, setIsFetchingBotsList] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [botPlanId, setBotPlanId] = useState(null);
  const [planEdit, setPlanEdit] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [priceError, setPriceError] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedPlans, setSelectedPlans] = useState({});

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownIndex(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [languages, setLanguages] = useState([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedBot, setSelectedBot] = useState(null > null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      categoryId: "",
      shortDescription: "",
      description: "",
      returns: "",
      risk: "",
      link: "",
      price: "",
      discount: "",
      botProviderId: "",
      botId: "",
      links: [{ url: "", language: "" }],
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    trigger,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = form;

  // Fetch dropdown data: categories, providers, and bots
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsFetchingCategories(true);
        const data = await getCategoryDropdown();
        setCategories(data.payload || []);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setIsFetchingCategories(false);
      }
    };

    const fetchProviders = async () => {
      try {
        setIsFetchingProviders(true);
        const data = await getBotProviderDropDown();
        setProviders(data.payload || []);
      } catch (error) {
        console.error("Failed to load bot providers:", error);
      } finally {
        setIsFetchingProviders(false);
      }
    };

    const fetchBotsList = async () => {
      try {
        setIsFetchingBotsList(true);
        const data = await getBotDropDown();
        // Expecting data.payload or data; support both
        const list = data.payload || [];

        setBots(list);
      } catch (error) {
        console.error("Failed to load bots:", error);
      } finally {
        setIsFetchingBotsList(false);
      }
    };

    fetchCategories();
    fetchProviders();
    fetchBotsList();
  }, []);

  // Update filtered bots when provider changes
  useEffect(() => {
    const providerId = getValues("botProviderId");
    if (!providerId) {
      setFilteredBots([]);
      return;
    }

    const fb = bots.filter(
      (b) => !b.botProviderId || b.botProviderId === providerId,
    );
    // setFilteredBots(fb);
  }, [bots, getValues]);

  // Watch provider field to update filtered bots and reset bot selection
  useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (name === "botProviderId") {
        const providerId = values.botProviderId || "";
        const fb = bots.filter(
          (b) => !b.botProviderId || b.botProviderId === providerId,
        );
        setFilteredBots(fb);
        setValue("botId", "");
      }
    });
    return () => subscription.unsubscribe();
  }, [bots, form.watch, setValue]);

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const langs = await getLanguageDropDown();
        setLanguages(langs?.payload);
      } catch (error) {
        console.error("Failed to load languages:", error);
      }
    };

    loadLanguages();
  }, []);

  // Fetch bots on component mount
  const fetchBots = async () => {
    try {
      setIsFetching(true);
      const response = await getAllAlgoBots({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearchTerm,
      });
      if (response.success) {
        setAlgobots(response.payload.data);
        setTotalItems(response.payload.totalRecords);
        setTotalPages(Math.ceil(response.payload.totalPages / itemsPerPage));
      }
    } catch (error) {
      console.error("Error fetching algobots:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchBots();
  }, [currentPage, itemsPerPage, debouncedSearchTerm]);

  useEffect(() => {
    if (planEdit && editingPlanId) {
      const editingPlan = plans.find((p) => p._id === editingPlanId);
      if (editingPlan) {
        setValue("plan", editingPlan.planType);
      }
    }
  }, [planEdit, editingPlanId, plans, setValue]);

  const handleFileUpload = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const url = await uploadAlgoBotImage(formData);
      setImagePreview(url.payload.showUrl);
      setImageFile(url.payload.url);
      setStep1((prev) => ({ ...prev, image: url.payload.url }));
      clearErrors("imageUrl");
    } catch (error) {
      console.error("Error uploading imageUrl:", error);
      toast.error("Failed to upload imageUrl");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview immediately
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Upload the file
      await handleFileUpload(file);
    }
    if (e.target) e.target.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (uploading) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (uploading) return;
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please drop an image file");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    await handleFileUpload(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setStep1((prev) => ({ ...prev, imageUrl: undefined }));
  };

  // Handle form submission for step 1 (Bot Details)
  const onSubmitStep1 = async (data) => {
    try {
      setIsLoading(true);

      // If we already have a botPlanId and we're not in edit mode, just move to step 2
      if (botPlanId && !isEditMode) {
        setStep(2);
        return;
      }

      // Ensure each link has a default language of 'English' if none is selected
      const processedLinks = (data.links || [])
        .filter((link) => link.url && link.url.trim() !== "")
        .map((link) => ({
          language: link.language || "English",
          url: link.url,
        }));

      const step1Data = {
        title: data.title,
        shortDescription: data.shortDescription,
        link: data.link,
        return: data.returns,
        risk: data.risk,
      };

      if (isEditMode && currentBotId) {
        const response = await updateAlgoBot(currentBotId, step1Data);
        if (response?.payload?._id) {
          setBotPlanId(response.payload._id);
          setCurrentPage(1);
          setStep(2);
          toast.success("AlgoBot updated successfully");
        }
      } else {
        // Only create a new bot if we don't have a botPlanId yet
        if (!botPlanId) {
          const response = await createAlgoBot(step1Data);
          if (response?.payload?._id) {
            setBotPlanId(response.payload._id);
            setCurrentPage(1);
            setStep(2);
            toast.success("AlgoBot created successfully");
          }
        } else {
          // If we already have a botPlanId, just move to step 2
          setCurrentPage(1);
          setStep(2);
        }
      }
    } catch (error) {
      if (error.response?.data?.message?.includes("already exists")) {
        // If bot already exists, show error and move to step 2
        toast.error("A bot with this title already exists");
        setCurrentPage(1);
        setStep(2);
      } else {
        console.error("Error in step 1:", error);
        toast.error(
          error.response?.data?.message || "Failed to proceed to next step",
        );
        return false;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitSecond = async (data) => {
    try {
      setIsLoading(true);

      if (isEditMode && currentBotId) {
        try {
          const response = await getAllAlgoBots({
            page: currentPage,
            limit: itemsPerPage,
            search: searchTerm,
          });
          if (response.success) {
            setAlgobots(response.payload.data);
          }
        } catch (error) {
          console.error("Error refreshing bot data:", error);
        }

        setIsOpen(false);
        reset();
        setPlans([]);
        setCurrentPage(1);
        setStep(1);
        await fetchBots();
        return;
      }

      // For new bots, save all plans that were added
      if (plans.length > 0 && botPlanId && !isEditMode) {
        for (const plan of plans) {
          if (plan._id?.startsWith("temp_")) {
            // This is a temporary plan, save it with the real bot ID
            const planData = {
              planType: plan.planType,
              price: plan.price,
              botId: plan.botId,
              discount: plan.discount,
            };

            try {
              await createAlgoBotPlan(botPlanId, planData);
            } catch (error) {
              console.error("Error saving plan:", error);
              toast.error(`Failed to save plan: ${plan.planType}`);
            }
          }
        }
      }

      toast.success("AlgoBot and plans created successfully");
      setIsOpen(false);
      reset();
      setPlans([]);
      setCurrentPage(1);
      setStep(1);
      await fetchBots();
    } catch (error) {
      console.error("Error saving plans:", error);
      toast.error("Failed to save plans");
    } finally {
      setIsLoading(false);
    }
  };

  // Set up form for editing
  const handleEdit = (bot) => {
    setCurrentBotId(bot._id);
    setBotPlanId(bot._id);
    setIsEditMode(true);

    // Set the category ID immediately if available
    if (bot.categoryId) {
      setValue("categoryId", bot.categoryId);
    }

    // Also set up a check in case categories are still loading
    if (categories.length === 0) {
      const checkCategories = setInterval(() => {
        if (categories.length > 0) {
          clearInterval(checkCategories);
          if (bot.categoryId) {
            setValue("categoryId", bot.categoryId);
          }
        }
      }, 100);

      // Cleanup interval on component unmount
      return () => clearInterval(checkCategories);
    }

    // Set tutorial video links or default
    const rawLinks = bot.link || [];
    const botLinks =
      Array.isArray(rawLinks) && rawLinks.length > 0
        ? rawLinks.map((l) => ({
            url: l.url || "",
            language: l.language || "",
            _id: l._id,
          }))
        : [{ url: "", language: "" }];

    setStep1({ links: botLinks });
    setValue("links", botLinks);

    if (bot.imageUrl) {
      setImagePreview(bot.imageUrl);
      setStep1((prev) => ({ ...prev, imageUrl: bot.imageUrl }));
    } else {
      setImagePreview(null);
    }

    // Reset the form with bot data
    reset({
      title: bot.title,
      categoryId: bot.categoryId || "",
      shortDescription: bot.shortDescription || "",
      description: bot.description,
      returns: bot.return || "",
      risk: bot.risk || "",
      link: bot.link || "",
      price: "", // Clear the price field when editing
      discount: "",
      botProviderId: bot.botProviderId || "",
      botId: bot.botId || "",
      links: botLinks,
    });

    // Set the existing plans
    setPlans([...(bot?.strategyPlan || [])]);

    // Reset the form step to 1
    setStep(1);
    setIsOpen(true);
  };

  // Handle delete with confirmation dialog
  const handleDeleteClick = (id) => {
    setBotToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!botToDelete) return;

    try {
      setIsDeleting(true);
      await deleteAlgoBot(botToDelete);
      toast.success("AlgoBot deleted successfully");
      setAlgobots(algobots.filter((bot) => bot._id !== botToDelete));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting AlgoBot:", error);
      toast.error("Failed to delete AlgoBot");
    } finally {
      setIsDeleting(false);
      setBotToDelete(null);
    }
  };

  const handleViewDetails = (bot) => {
    setSelectedBot(bot);
    setViewDialogOpen(true);
  };

  // Reset form for creating new bot
  const handleCreateNew = () => {
    reset({
      title: "",
      categoryId: "",
      shortDescription: "",
      returns: "",
      risk: "",
      link: "",
      description: "",
      price: "",
      discount: "",
      botProviderId: "",
      botId: "",
      links: [{ url: "", language: "" }],
    });
    setPlans([]);
    setStep1({ links: [{ url: "", language: "" }] });
    setCurrentBotId(null);
    setBotPlanId(null);
    setIsEditMode(false);
    setIsOpen(true);
    setImagePreview(null);
    setStep(1);
    setPlanEdit(false);
    setEditingPlanId(null);
  };
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 500); // 500ms delay

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleAddPlan = async () => {
    const { plan, price, botProviderId, botId, discount } = getValues();
    let hasError = false;

    if (!plan || String(plan).trim() === "") {
      setError("plan", {
        type: "manual",
        message: "Plan duration is required",
      });
      hasError = true;
    }

    if (!price || String(price).trim() === "") {
      setPriceError("Price is required");
      setError("price", { type: "manual", message: "Price is required" });
      hasError = true;
    } else if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      setPriceError("Price must be a valid positive number");
      setError("price", {
        type: "manual",
        message: "Price must be a valid positive number",
      });
      hasError = true;
    } else if (parseFloat(price) > 1000000) {
      setPriceError("Price must be less than 1,000,000");
      setError("price", {
        type: "manual",
        message: "Price must be less than 1,000,000",
      });
      hasError = true;
    } else if (price.includes(".") && price.split(".")[1].length > 2) {
      setPriceError("Price can have maximum 2 decimal places");
      setError("price", {
        type: "manual",
        message: "Price can have maximum 2 decimal places",
      });
      hasError = true;
    }

    if (!botProviderId || String(botProviderId).trim() === "") {
      setError("botProviderId", {
        type: "manual",
        message: "Bot Provider Company is required",
      });
      hasError = true;
    }

    if (!botId || String(botId).trim() === "") {
      setError("botId", { type: "manual", message: "Bot Name is required" });
      hasError = true;
    }

    // Validate discount
    if (discount && String(discount).trim() !== "") {
      const discountValue = parseFloat(discount);

      if (isNaN(discountValue) || discountValue < 0) {
        setError("discount", {
          type: "manual",
          message: "Discount must be a valid non-negative number",
        });
        hasError = true;
      } else if (discountValue >= 100) {
        setError("discount", {
          type: "manual",
          message: "Discount must be less than 100",
        });
        hasError = true;
      } else if (
        price &&
        parseFloat(price) > 0 &&
        discountValue > parseFloat(price)
      ) {
        setError("discount", {
          type: "manual",
          message: "Discount cannot be greater than price",
        });
        hasError = true;
      }
    }

    if (hasError) return;

    const newPlan = {
      _id:
        planEdit && editingPlanId
          ? editingPlanId
          : `temp_${Date.now()}_${Math.random()}`, // Generate temp ID for new plans
      planType: plan || "",
      price: String(price),
      botProviderId: botProviderId || "",
      botId: botId || "",
      initialPrice: parseFloat(price),
    };

    // Only include discount if it has a value
    if (discount && String(discount).trim() !== "") {
      newPlan.discount = String(discount);
    }

    try {
      setIsLoading(true);

      if (botPlanId) {
        const step2Data = {
          planType: newPlan.planType,
          price: newPlan.price,
          botId: newPlan.botId,
        };

        // Only include discount in API data if it exists
        if (newPlan.discount) {
          step2Data.discount = newPlan.discount;
        }

        if (planEdit && editingPlanId) {
          if (editingPlanId.startsWith("temp_")) {
            setPlans((prev) =>
              prev.map((p) =>
                p._id === editingPlanId
                  ? {
                      ...p,
                      ...newPlan,
                      // botId: {
                      //   _id: newPlan.botId,
                      //   botProviderId: {
                      //     _id: newPlan.botProviderId,
                      //     companyName: "",
                      //   },
                      //   name: "",
                      // },
                      botId: newPlan.botId,
                    }
                  : p,
              ),
            );

            toast.success("Plan updated successfully");
          } else {
            await updateAlgoBotPlan(editingPlanId, step2Data);
            setPlans((prev) =>
              prev.map((p) =>
                p._id === editingPlanId
                  ? {
                      ...p,
                      ...newPlan,
                      botId: {
                        _id: newPlan.botId,
                        botProviderId: {
                          _id: newPlan.botProviderId,
                          companyName: "",
                        },
                        name: "",
                      },
                    }
                  : p,
              ),
            );

            toast.success("Plan updated successfully");
          }
          setPlanEdit(false);
          setEditingPlanId(null);
        } else {
          // Adding new plan
          if (isEditMode && botPlanId) {
            // For existing bots, save the plan immediately via API
            try {
              const response = await createAlgoBotPlan(botPlanId, step2Data);
              // Add the plan to local state with the real ID from API response
              if (response?.payload?._id) {
                const savedPlan = { ...newPlan, _id: response.payload._id };
                setPlans((prev) => [...prev, savedPlan]);
              } else {
                setPlans((prev) => [...prev, newPlan]);
              }
              toast.success("Plan added successfully");
            } catch (error) {
              console.error("Error saving plan:", error);
              toast.error("Failed to save plan");
              return;
            }
          } else {
            // For new bots, just add to local state with temp ID
            setPlans((prev) => [...prev, newPlan]);
            toast.success("Plan added successfully");
          }
        }

        setValue("plan", "");
        reset({
          ...getValues(),
          plan: "",
          price: "",
          discount: "",
          botProviderId: "",
          botId: "",
        });
        clearErrors(["plan", "price", "discount", "botProviderId", "botId"]);
      }
    } catch (error) {
      console.error("Error saving plan:", error);
      toast.error("Failed to save plan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPlan = (index) => {
    const plan = plans[index];
    if (!plan) return;

    setPlanEdit(true);
    setEditingPlanId(plan._id || null);

    // Reset the form with the plan's values
    const formValues = {
      plan: plan.planType || "",
      price: (plan.initialPrice || plan.price)?.toString() || "",
      discount: plan.discount?.toString() || "0",
    };

    setValue("plan", "", { shouldValidate: false });
    setTimeout(() => {
      setValue("plan", formValues.plan, { shouldValidate: true });
      setValue("price", formValues.price, { shouldValidate: true });
      setValue("discount", formValues.discount, { shouldValidate: true });
    }, 0);

    // Handle nested bot and provider structure
    if (plan.botId && typeof plan.botId === "object") {
      const botId = plan.botId._id;
      const providerId = plan.botId.botProviderId?._id;

      if (providerId) {
        // First set the provider and wait for state update
        setValue("botProviderId", providerId);

        // Then set the botId in the next tick
        setTimeout(() => {
          setValue("botId", botId);

          // Filter bots for the selected provider
          const fb = bots.filter(
            (b) => b.botProviderId === providerId || !b.botProviderId,
          );
          setFilteredBots(fb);
        }, 0);
      }
    } else {
      const botId = plan?.botId;
      const providerId = plan?.botProviderId;

      if (providerId) {
        // First set the provider and wait for state update
        setValue("botProviderId", providerId);

        // Then set the botId in the next tick
        setTimeout(() => {
          setValue("botId", botId);

          // Filter bots for the selected provider
          const fb = bots.filter(
            (b) => b.botProviderId === providerId || !b.botProviderId,
          );
          setFilteredBots(fb);
        }, 0);
      }
    }

    // Scroll to the form
    setTimeout(() => {
      const formElement = document.getElementById("plan-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleRemovePlan = async (indexToRemove) => {
    const planToDelete = plans[indexToRemove];

    try {
      if (planToDelete._id && !planToDelete._id.startsWith("temp_")) {
        // This is an existing plan, delete via API
        setIsDeleting(true);
        await deleteAlgoBotPlan(planToDelete._id);
        toast.success("Plan deleted successfully");
      } else {
        // This is a temporary plan, just remove from local state
        toast.success("Plan removed");
      }

      setPlans((prev) => prev.filter((plan) => plan._id !== planToDelete._id));
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast.error("Failed to delete plan");
    } finally {
      setIsDeleting(false);
    }
  };

  // Tutorial Video Links handlers
  const handleLinkChange = (index, value) => {
    const updatedLinks = [...step1.links];
    updatedLinks[index].url = value;
    setStep1({ ...step1, links: updatedLinks });
    setValue("links", updatedLinks);
  };

  const handleLanguageChange = (index, language) => {
    const updatedLinks = [...step1.links];
    updatedLinks[index].language = language || "English";
    setStep1({ ...step1, links: updatedLinks });
    setValue("links", updatedLinks);
    setOpenDropdownIndex(null);
  };

  const handleAddLink = () => {
    const newLinks = [...step1.links, { url: "", language: "" }];
    setStep1({ ...step1, links: newLinks });
    setValue("links", newLinks);
  };

  const handleRemoveLink = (index) => {
    const updatedLinks = step1.links.filter((_, i) => i !== index);
    setStep1({ ...step1, links: updatedLinks });
    setValue("links", updatedLinks);
  };

  const getUserActions = (isActive) => [
    // {
    //   key: "view",
    //   label: "View",
    //   icon: ViewIcon,
    // },
    {
      key: "edit",
      label: "Edit",
      icon: EditIcon,
    },

    {
      key: "delete",
      label: "Delete",
      icon: DeleteIcon,
      variant: "danger",
    },
  ];
  const handleAction = (action, bot) => {
    // if (action === "view") handleViewDetails(bot);
    if (action === "edit") handleEdit(bot);
    if (action === "delete") {
      handleDeleteClick(bot?._id);
    }
  };

  return (
    <>
      <UserHeader
        HeaderText="Algobots"
        DescriptionText="Monitor, configure, and manage automated trading tools"
        onChange={(e) => setSearchTerm(e.target.value.trimStart())}
        value={searchTerm}
        placeholder="Search algobots"
        buttonText="Add Algobot"
        onClick={() => {
          handleCreateNew();
          setIsEditMode(false);
          setStep(1);
        }}
      />
      <div className={styles.algobotsPageAlignment}>
        {isFetching ? (
          <CommonLoader />
        ) : (
          <div className={styles.grid}>
            {algobots?.length > 0 ? (
              algobots?.map((bot, i) => {
                const months = parseInt(
                  bot?.planType?.match(/\d+/)?.[0] || "3",
                );
                const monthlyPrice = (bot?.initialPrice / months).toFixed(2);
                return (
                  <div key={i} className={styles.box}>
                    <div className={styles.detailsBox}>
                      <h3>
                        Returns:{" "}
                        <span className={styles.green}>
                          {bot?.return || 110}%
                        </span>{" "}
                        <small>(28 Days)</small>
                      </h3>
                      <h4>
                        Risk: <span>{bot?.risk || "High"}</span>
                      </h4>
                    </div>
                    <div className={styles.leftRightAlignment}>
                      <p>{bot?.title}</p>
                      <div className={styles.line}></div>
                      <div className={styles.subscriptionPlan}>
                        <select className={styles.planDropdown}>
                          {bot?.strategyPlan?.map((plan) => {
                            const months = parseInt(
                              plan?.planType?.match(/\d+/)?.[0] || "1",
                            );
                            const monthlyPrice = (plan.price / months).toFixed(
                              2,
                            );
                            return (
                              <option key={plan._id} value={`${months}months`}>
                                ${monthlyPrice}/month
                              </option>
                            );
                          })}
                        </select>
                        <Dropdown
                          actions={getUserActions(bot.isActive)}
                          onSelect={(action) => handleAction(action, bot)}
                        />
                      </div>
                      {/* <div className={styles.buttonStyle}>
                      <Button text="Subscribe Now" />
                    </div> */}
                    </div>
                  </div>
                );
              })
            ) : (
              <NoDataFound />
            )}
          </div>
        )}
        {isOpen && (
          <AddAlgobot
            setIsOpen={setIsOpen}
            step={step}
            setStep={setStep}
            watch={watch}
            register={register}
            setValue={setValue}
            errors={errors}
            onNext={async (e) => {
              const requiredFields = [
                "title",
                "returns",
                "risk",
                "shortDescription",
                "link",
              ];

              const isStepValid = await trigger(requiredFields);

              if (isStepValid) {
                const formData = getValues();
                const step1Success = await onSubmitStep1(formData);
                if (step1Success) {
                  setStep(2);
                }
              } else {
                const errorFields = Object.keys(errors);
                if (errorFields.length > 0) {
                  const firstError = document.querySelector(
                    `[name="${errorFields[0]}"]`,
                  );
                  if (firstError) {
                    firstError.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }
                }
              }
            }}
            onSubmitSecond={onSubmitSecond}
            handleSubmit={handleSubmit}
            isEditMode={isEditMode}
            isFetchingProviders={isFetchingProviders}
            isFetchingBotsList={isFetchingBotsList}
            providers={providers}
            bots={bots}
            getValues={getValues}
            filteredBots={filteredBots}
            handleAddPlan={handleAddPlan}
            isLoading={isLoading}
            planEdit={planEdit}
            plans={plans}
            handleEditPlan={handleEditPlan}
            botPlanId={botPlanId}
            handleRemovePlan={handleRemovePlan}
          />
        )}
        {deleteDialogOpen && (
          <DeleteAlgobot
            bot={algobots.find((bot) => bot._id === botToDelete)}
            onClose={() => setDeleteDialogOpen(false)}
            onDelete={confirmDelete}
          />
        )}
      </div>
    </>
  );
}
