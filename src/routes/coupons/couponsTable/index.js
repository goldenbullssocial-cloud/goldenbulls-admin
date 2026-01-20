import React from 'react'
import styles from './couponsTable.module.scss';
import ThreeMenuIcon from '@/icons/threeMenuIcon';
import PagePagination from '@/components/pagePagination';
export default function CouponsTable() {
    return (
        <div className={styles.couponsTableAlignment}>
            <div className={styles.tableUi}>
                <table>
                    <thead>
                        <tr>
                            <th>Sr no.</th>
                            <th>Coupon Code</th>
                            <th>Discount</th>
                            <th>Usage Limit</th>
                            <th>Usage Count</th>
                            <th>Created Date</th>
                            <th>Expiry Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            [...Array(12)].map(() => {
                                return (
                                    <tr>
                                        <td>1</td>
                                        <td>NETFLIX20</td>
                                        <td>20%</td>
                                        <td>30</td>
                                        <td>10</td>
                                        <td>13/08/2025, 17:15:10</td>
                                        <td>13/08/2025, 17:15:10</td>
                                        <td>
                                            <span className={styles.green}>
                                                Active
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
