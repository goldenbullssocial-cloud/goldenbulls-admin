import React from 'react'
import styles from './centers.module.scss';
import CentersTable from './centersTable';
import AddCenter from './addCenter';
import CenterDetailsModal from './centerDetailsModal';
export default function Centers() {
    return (
        <div className={styles.centers}>
            <CentersTable />
            <AddCenter />
            <CenterDetailsModal />
        </div>
    )
}
