import React, { useState } from "react";
import styles from "./courseSales.module.scss";
import PagePagination from "@/components/pagePagination";
import DownloadIcon from "@/icons/downloadIcon";
import { format } from "date-fns";
import NoDataFound from "@/components/noDataFound";
export default function CourseSales({
  activeTab,
  filteredPayments,
  downloadPaymentInvoice,
  loadingInvoices,
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
}) {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate pagination based on filtered data
  const filteredTotalItems = filteredPayments.length;
  const filteredTotalPages = Math.ceil(filteredTotalItems / itemsPerPage);

  // Get current page data from filtered payments
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPaginatedData = filteredPayments.slice(startIndex, endIndex);

  const handlePaymentClick = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };
  return (
    <div className={styles.courseSalesAlignment}>
      {activeTab === "courses" && (
        <div className={styles.tableUi}>
          <table>
            <thead>
              <tr>
                <th>Sr no.</th>
                <th>Date</th>
                <th>Name</th>
                <th>Course Name</th>
                <th>Course Type</th>
                <th>Amount</th>
                <th>Transaction ID</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {currentPaginatedData.length > 0 ? (
                currentPaginatedData.map((payment, index) => {
                  return (
                    <tr key={payment._id || index}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>
                        {format(payment?.createdAt, "dd/MM/yyyy, hh:mm:ss")}
                      </td>
                      <td>
                        {payment?.uid?.firstName +
                          " " +
                          payment?.uid?.lastName || "N/A"}
                      </td>
                      <td>{payment?.courseId?.CourseName || "N/A"}</td>
                      <td>{payment?.courseId?.courseType || "N/A"}</td>
                      <td>{payment?.price || "N/A"}</td>
                      <td>{payment?.orderId || "N/A"}</td>
                      <td>
                        <button
                          onClick={() => downloadPaymentInvoice(payment)}
                          disabled={loadingInvoices[payment._id]}
                          className="border-none"
                        >
                          {loadingInvoices[payment._id] ? (
                            <>
                              <DownloadIcon
                                className={`h-4 w-4 animate-pulse ${
                                  loadingInvoices[payment._id]
                                    ? "cursor-not-allowed"
                                    : ""
                                }`}
                              />
                            </>
                          ) : (
                            <>
                              <DownloadIcon className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <NoDataFound />
              )}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === "algobots" && (
        <div className={styles.tableUi}>
          <table>
            <thead>
              <tr>
                <th>Sr no.</th>
                <th>Date</th>
                <th>Name</th>
                <th>Algobot Name</th>
                <th>Plan Tenure</th>
                <th>Amount</th>
                <th>Transaction ID</th>
                <th>Meta Account Number</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {currentPaginatedData.map((payment, index) => {
                return (
                  <tr key={payment._id || index}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{payment?.createdAt}</td>
                    <td>
                      {payment?.uid?.firstName + " " + payment?.uid?.lastName ||
                        payment?.uid?.name ||
                        "N/A"}
                    </td>
                    <td>{payment?.botId?.strategyId?.title || "N/A"}</td>
                    <td>{payment?.planType || "N/A"}</td>
                    <td>{payment?.price || "N/A"}</td>
                    <td>{payment?.orderId || "N/A"}</td>
                    <td>{payment?.metaAccountNumber || "N/A"}</td>
                    <td>
                      <button
                        onClick={() => downloadPaymentInvoice(payment)}
                        disabled={loadingInvoices[payment._id]}
                        className="border-none"
                      >
                        {loadingInvoices[payment._id] ? (
                          <>
                            <DownloadIcon
                              className={`h-4 w-4 animate-pulse ${
                                loadingInvoices[payment._id]
                                  ? "cursor-not-allowed"
                                  : ""
                              }`}
                            />
                          </>
                        ) : (
                          <>
                            <DownloadIcon className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "telegram" && (
        <div className={styles.tableUi}>
          <table>
            <thead>
              <tr>
                <th>Sr no.</th>
                <th>Date</th>
                <th>Name</th>
                <th>Plan Tenure</th>
                <th>Amount</th>
                <th>Transaction ID</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {currentPaginatedData.map((payment, index) => {
                return (
                  <tr key={payment._id || index}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{payment?.createdAt}</td>
                    <td>
                      {payment?.uid?.firstName + " " + payment?.uid?.lastName ||
                        payment?.uid?.name ||
                        "N/A"}
                    </td>
                    <td>
                      {payment?.planType?.replace(
                        /(\d+)([a-zA-Z]+)/,
                        "$1 $2",
                      ) || "N/A"}
                    </td>
                    <td>{payment?.price || "N/A"}</td>
                    <td>{payment?.orderId || "N/A"}</td>
                    <td>
                      <button
                        onClick={() => downloadPaymentInvoice(payment)}
                        disabled={loadingInvoices[payment._id]}
                      >
                        {loadingInvoices[payment._id] ? (
                          <>
                            <DownloadIcon
                              className={`h-4 w-4 animate-pulse ${
                                loadingInvoices[payment._id]
                                  ? "cursor-not-allowed"
                                  : ""
                              }`}
                            />
                          </>
                        ) : (
                          <>
                            <DownloadIcon className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Meta Account Numbers</h3>
              <button className={styles.closeButton} onClick={closeModal}>
                &times;
              </button>
            </div>
            <div className={styles.modalContent}>
              {selectedPayment?.metaAccountNo?.length > 0 ? (
                <div className={styles.accountList}>
                  {selectedPayment.metaAccountNo.map((account, idx) => (
                    <div key={idx} className={styles.accountItem}>
                      <span className={styles.accountLabel}>
                        Account {idx + 1}:
                      </span>
                      <span className={styles.accountNumber}>{account}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.noAccounts}>
                  No meta account numbers found
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      {currentPaginatedData.length > 0 && (
        <PagePagination
          currentPage={currentPage}
          totalPages={filteredTotalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredTotalItems}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
