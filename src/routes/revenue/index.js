"use client";
import React, { useState, useEffect } from "react";
import styles from "./revenue.module.scss";
import CourseSales from "./courseSales";
import UserHeader from "@/components/userHeader";
import { getPaymentHistory, downloadInvoice } from "@/api/payment";
import { toast } from "sonner";
import { Search } from "lucide-react";
export default function Revenue() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [activeTab, setActiveTab] = useState("courses");
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingInvoices, setLoadingInvoices] = useState({});

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        let isType = "";
        if (activeTab === "courses") {
          isType = "Course";
          setCurrentPage(1);
        } else if (activeTab === "algobots") {
          isType = "Bot";
          setCurrentPage(1);
        } else if (activeTab === "telegram") {
          isType = "Telegram";
          setCurrentPage(1);
        }
        const response = await getPaymentHistory({
          page: currentPage,
          limit: itemsPerPage,
          isType: isType,
        });

        if (response.success) {
          const paymentsData = response.payload.data || [];
          setPayments(paymentsData);
          setTotalItems(response.payload.count);
          setTotalPages(Math.ceil(response.payload.count / itemsPerPage));
        } else {
          setError("Failed to load payment history");
        }
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError("An error occurred while loading payments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [currentPage, itemsPerPage, activeTab]);
  useEffect(() => {
    setSearchTerm("");
  }, [activeTab]);

  const calculateExpiryDate = (purchaseDate, planDuration) => {
    if (!planDuration || planDuration === "N/A") return null;

    const purchase = new Date(purchaseDate);
    const duration = parseInt(planDuration);

    if (planDuration.includes("Month")) {
      purchase.setMonth(purchase.getMonth() + duration);
    } else if (planDuration.includes("year")) {
      purchase.setFullYear(purchase.getFullYear() + duration);
    }
    return purchase.toLocaleDateString("en-US");
  };

  const downloadPaymentInvoice = async (payment) => {
    if (loadingInvoices[payment._id]) return; // Prevent multiple clicks

    try {
      setLoadingInvoices((prev) => ({ ...prev, [payment._id]: true }));
      const expiryDate =
        payment.planExpiry ||
        calculateExpiryDate(payment.createdAt, payment.planType);

      // Handle date safely
      let purchaseDate = "N/A";
      if (payment.createdAt) {
        const date = new Date(payment.createdAt);
        purchaseDate = !isNaN(date.getTime())
          ? date.toLocaleDateString("en-US")
          : "Invalid date";
      }

      const invoicePayload = {
        transactionId: payment.orderId,
        purchaseDate: purchaseDate,
        expiryDate: expiryDate,
        invoiceNo: payment.invoiceNo,
        items: [
          {
            planName:
              payment.telegramId?.telegramId?.channelName ||
              payment.botId?.strategyId?.title ||
              payment.courseId?.CourseName ||
              "N/A",
            planDuration: payment.planType || "N/A",
            metaNo:
              payment.telegramAccountNo || payment.metaAccountNo?.[0] || "N/A",
            qty: payment.noOfBots || 1,
            amount: payment.price || 0,
          },
        ],
        couponDiscount:
          payment.couponDiscount > 0 ? `-${payment.couponDiscount}` : "-",
        planDiscount: payment.discount > 0 ? `-${payment.discount}` : "-",
        totalValue: payment.initialPrice || 0,
        total: payment.price || 0,
      };

      const response = await downloadInvoice(invoicePayload);

      if (response?.success && response?.payload) {
        const pdfRes = await fetch(response.payload);
        const blob = await pdfRes.blob();

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `invoice-${payment.orderId || Date.now()}.pdf`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);

        toast.success("Invoice downloaded successfully!");
      } else {
        throw new Error("Failed to generate invoice");
      }
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error(error.message || "Failed to generate invoice");
    } finally {
      setLoadingInvoices((prev) => ({ ...prev, [payment._id]: false }));
    }
  };

  const filterPaymentsByTab = (payments) => {
    return payments.filter((payment) => {
      switch (activeTab) {
        case "payments":
          return filterType === "all" || payment.itemType === filterType;
        case "courses":
          const hasCourseData =
            !!payment.courseId?.CourseName || payment.itemType === "course";
          return payment.itemType === "course" || hasCourseData;
        case "algobots":
          return (
            payment.itemType === "algobot" || !!payment.botId?.strategyId?.title
          );
        case "telegram":
          return (
            payment.itemType === "telegram" ||
            !!payment.telegramId?.telegramId?.channelName
          );
        default:
          return true;
      }
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const searchPayments = (payments, term) => {
    if (!term.trim()) return payments;

    const searchTerm = term.toLowerCase();
    return payments.filter((payment) => {
      return (
        payment.uid.name?.toLowerCase().includes(searchTerm) ||
        payment.itemName?.toLowerCase().includes(searchTerm) ||
        payment.paymentId?.toLowerCase().includes(searchTerm) ||
        payment.orderId?.toLowerCase().includes(searchTerm) ||
        payment.userEmail?.toLowerCase().includes(searchTerm) ||
        payment.courseId?.CourseName?.toLowerCase().includes(searchTerm) ||
        payment.botId?.strategyId?.title?.toLowerCase().includes(searchTerm) ||
        payment.telegramId?.telegramId?.channelName
          ?.toLowerCase()
          .includes(searchTerm) ||
        payment.planType?.toLowerCase().includes(searchTerm)
      );
    });
  };

  const filteredByTab = filterPaymentsByTab(payments);
  const filteredPayments = searchTerm
    ? searchPayments(filteredByTab, searchTerm)
    : filteredByTab;

  const renderSearchInput = (placeholder = "Search...") => (
    <div className="mb-4">
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.trimStart())}
          className="pl-10 font-normal"
        />
      </div>
    </div>
  );

  const renderNoData = (isSearch) => (
    <div className="text-center py-12 text-gray-500">
      <p className="text-2xl text-gray-500 font-medium">No data found</p>
      <p className="text-lg text-gray-900 font-lexend">
        {isSearch
          ? "Try a different search term"
          : "There are no records to display"}
      </p>
    </div>
  );

  // Function to render the appropriate table based on the active tab
  const renderTable = () => {
    // Use filteredPayments directly as it already handles the active tab filtering
    const data = filteredPayments;

    const renderStatusBadge = (status) => {
      switch (status.toLowerCase()) {
        case "completed":
          return (
            <Badge className="bg-green-100 text-green-800">Completed</Badge>
          );
        case "pending":
          return (
            <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
          );
        case "failed":
          return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
        case "refunded":
          return <Badge className="bg-blue-100 text-blue-800">Refunded</Badge>;
        default:
          return <Badge variant="outline">{status}</Badge>;
      }
    };
  };

  return (
    <>
      <UserHeader
        NoRightContent
        HeaderText="Revenue"
        DescriptionText="Analyze income trends and detailed financial insights"
      />
      <div className={styles.revenuePageAlignment}>
        <div className={styles.tabCenter}>
          <div className={styles.tabGroup}>
            <button
              className={activeTab === "courses" ? styles.active : ""}
              onClick={() => setActiveTab("courses")}
            >
              <span>Course Sales</span>
            </button>
            <button
              className={activeTab === "algobots" ? styles.active : ""}
              onClick={() => setActiveTab("algobots")}
            >
              <span>Algobot Sales</span>
            </button>
            <button
              className={activeTab === "telegram" ? styles.active : ""}
              onClick={() => setActiveTab("telegram")}
            >
              <span>Telegram Sales</span>
            </button>
          </div>
        </div>
        <CourseSales
          activeTab={activeTab}
          filteredPayments={filteredPayments}
          downloadPaymentInvoice={downloadPaymentInvoice}
          loadingInvoices={loadingInvoices}
        />
      </div>
    </>
  );
}
