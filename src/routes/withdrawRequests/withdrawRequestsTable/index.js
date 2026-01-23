import React from 'react'
import styles from './withdrawRequestsTable.module.scss';
import PagePagination from '@/components/pagePagination';
import ThreeMenuIcon from '@/icons/threeMenuIcon';
export default function WithdrawRequestsTable() {
    return (
        <div className={styles.withdrawRequestsTable}>
            <div className={styles.tableUi}>
                <table>
                    <thead>
                        <tr>
                            <th>Sr no.</th>
                            <th>Requested Date</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Amount</th>
                            <th>Transaction ID</th>
                            <th>Payment Method</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            [...Array(12)].map(() => {
                                return (
                                    <tr>
                                        <td>1</td>
                                        <td>13/08/2025, 17:15:10</td>
                                        <td>Steve Harrington</td>
                                        <td>steveharrington@gmail.com</td>
                                        <td>$120</td>
                                        <td>12345678901234</td>
                                        <td>BTC</td>
                                        <td>
                                            <span className={styles.green}>
                                                Approved
                                            </span>
                                        </td>
                                        <td>
                                            <ThreeMenuIcon />
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            <PagePagination />
        </div>
    )
}
