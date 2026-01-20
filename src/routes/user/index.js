import React from 'react'
import styles from './user.module.scss';
import UserTable from './userTable';
import UserDetailsModal from './userDetailsModal';
import EditUserDetails from './editUserDetails';
import DeleteUser from './deleteUser';
export default function UserPage() {
    return (
        <div className={styles.userpageAlignment}>
            <UserTable />
            {/* <UserDetailsModal /> */}
            {/* <EditUserDetails /> */}
            <DeleteUser />
        </div>
    )
}
