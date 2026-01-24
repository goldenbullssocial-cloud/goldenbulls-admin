import React, { useState } from "react";
import styles from "./courseSales.module.scss";
import PagePagination from "@/components/pagePagination";
import DownloadIcon from "@/icons/downloadIcon";
export default function CourseSales({
  activeTab,
  filteredPayments,
  downloadPaymentInvoice,
  loadingInvoices,
}) {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
              {filteredPayments.map((payment, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{payment?.createdAt}</td>
                    <td>{payment?.uid?.name || "N/A"}</td>
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
              })}
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
              {filteredPayments.map((payment, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{payment?.createdAt}</td>
                    <td>{payment?.uid?.name || "N/A"}</td>
                    <td>{payment?.courseId?.CourseName || "N/A"}</td>
                    <td>{payment?.courseId?.courseType || "N/A"}</td>
                    <td>{payment?.price || "N/A"}</td>
                    <td>{payment?.orderId || "N/A"}</td>
                    <td>
                      <div
                        className={styles.accountNumberCell}
                        onClick={() => handlePaymentClick(payment)}
                      >
                        {Array.isArray(payment?.metaAccountNo) &&
                        payment.metaAccountNo.length > 0 ? (
                          <span className={styles.accountBadge}>
                            View {payment.metaAccountNo.length} Account
                            {payment.metaAccountNo.length !== 1 ? "s" : ""}
                          </span>
                        ) : (
                          <span
                            className={`${styles.accountBadge} ${styles.empty}`}
                          >
                            No Accounts
                          </span>
                        )}
                      </div>
                    </td>
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
              {filteredPayments.map((payment, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{payment?.createdAt}</td>
                    <td>{payment?.uid?.name || "N/A"}</td>
                    <td>{payment?.courseId?.courseType || "N/A"}</td>
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
      <PagePagination />
    </div>
  );
}
