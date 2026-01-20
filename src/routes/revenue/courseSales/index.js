import React from 'react'
import styles from './courseSales.module.scss';
import PagePagination from '@/components/pagePagination';
import DownloadIcon from '@/icons/downloadIcon';
export default function CourseSales() {
    return (
        <div className={styles.courseSalesAlignment}>
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
                        <tr>
                            <td>Sr no.</td>
                            <td>Invoice</td>
                            <td>Steve Harrington</td>
                            <td>Forex Trading For Absolute Beginners</td>
                            <td>Recorded</td>
                            <td>$120</td>
                            <td>1234567890123456</td>
                            <td>
                                <DownloadIcon />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <PagePagination />
        </div>
    )
}
