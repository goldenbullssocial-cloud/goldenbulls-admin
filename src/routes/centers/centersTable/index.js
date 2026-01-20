import React from 'react'
import styles from './centersTable.module.scss';
import ThreeMenuIcon from '@/icons/threeMenuIcon';
import PagePagination from '@/components/pagePagination';
export default function CentersTable() {
    return (
        <div className={styles.centersTableAlignment}>
            <div className={styles.tableUi}>
                <table>
                    <thead>
                        <tr>
                            <th>Sr no.</th>
                            <th>Name</th>
                            <th>Location</th>
                            <th>City</th>
                            <th>State</th>
                            <th>Country</th>
                            <th>Date Created</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            [...Array(12)].map((_, i) => {
                                return (
                                    <tr key={i}>
                                        <td>1</td>
                                        <td>Golden Bulls Mumbai Branch</td>
                                        <td>maps.google.com</td>
                                        <td>Mumbai</td>
                                        <td>Maharashtra</td>
                                        <td>India</td>
                                        <td>13/08/2025, 17:15:10</td>
                                        <td>
                                            <span>
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


