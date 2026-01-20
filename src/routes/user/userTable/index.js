import React from 'react'
import styles from './userTable.module.scss';
import ThreeMenuIcon from '@/icons/threeMenuIcon';
import PagePagination from '@/components/pagePagination';
export default function UserTable() {
    return (
        <div className={styles.userTableAlignment}>
            <div className={styles.tableUi}>
                <table>
                    <thead>
                        <tr>
                            <th>Sr no.</th>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>Email</th>
                            <th>Referred By</th>
                            <th>Reference ID</th>
                            <th>Join Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            [...Array(10)].map(() => {
                                return (
                                    <tr>
                                        <td>1</td>
                                        <td>Steve Harrington</td>
                                        <td>N/A</td>
                                        <td>hairharrington@gmail.com</td>
                                        <td>N/A</td>
                                        <td>65e41v3wfwfqw</td>
                                        <td>13/08/2025, 17:15:10</td>
                                        <td>
                                            <span>Active</span>
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
