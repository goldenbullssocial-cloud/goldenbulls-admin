import React from 'react'
import styles from './withdrawRequests.module.scss';
import WithdrawRequestsTable from './withdrawRequestsTable';
import SettingsModal from './settingsModal';
export default function WithdrawRequests() {
    return (
        <div className={styles.withdrawRequestspage}>
            <WithdrawRequestsTable />
            <SettingsModal />
        </div>
    )
}
