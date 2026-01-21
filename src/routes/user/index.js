import React from 'react'
import styles from './user.module.scss';
import UserTable from './userTable';

export default function UserPage() {
    return (
        <div className={styles.userpageAlignment}>
            <UserTable />
        </div>
    )
}
