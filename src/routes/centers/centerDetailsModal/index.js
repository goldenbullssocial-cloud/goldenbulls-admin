import React from 'react'
import styles from './centerDetailsModal.module.scss';
import CloseIcon from '@/icons/closeIcon';
import EmailIcon from '@/icons/emailIcon';
import LocationIcon from '@/icons/locationIcon';
export default function CenterDetailsModal() {
    return (
        <div className={styles.centerDetailsModalWrapper}>
            <div className={styles.centerDetailsmodal}>
                <div className={styles.modalHeader}>
                    <h2>
                        Center Details
                    </h2>
                    <div className={styles.closeIcon}>
                        <CloseIcon />
                    </div>
                </div>
                <div className={styles.userInformation}>
                    <div className={styles.profile}>SH</div>
                    <div>
                        <h3>
                            Golden Bulls Mumbai Branch
                        </h3>
                        <div className={styles.email}>
                            <LocationIcon />
                            <a>
                                maps.google.com/re42rc1rw68grw
                            </a>
                        </div>
                        <span>
                            Active
                        </span>
                    </div>
                </div>
                <div className={styles.textgrid}>
                    <div className={styles.items}>
                        <h4>
                            Location
                        </h4>
                        <p>
                            Hawkins, Indiana, United States of America
                        </p>
                    </div>
                    <div className={styles.items}>
                        <h4>
                            Member Since
                        </h4>
                        <p>
                            11/12/25
                        </p>
                    </div>
                   
                </div>
            </div>
        </div>
    )
}
