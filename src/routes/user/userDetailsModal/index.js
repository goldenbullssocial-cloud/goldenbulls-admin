import React from 'react'
import styles from './userDetailsModal.module.scss';
import CloseIcon from '@/icons/closeIcon';
import EmailIcon from '@/icons/emailIcon';
export default function UserDetailsModal() {
    return (
        <div className={styles.userDetailsModal}>
            <div className={styles.usermodal}>
                <div className={styles.modalHeader}>
                    <h2>
                        User Details
                    </h2>
                    <div className={styles.closeIcon}>
                        <CloseIcon />
                    </div>
                </div>
                <div className={styles.userInformation}>
                    <div className={styles.profile}>SH</div>
                    <div>
                        <h3>
                            Steve Harrington
                        </h3>
                        <div className={styles.email}>
                            <EmailIcon />
                            <a>
                                thehairharrington@gmail.com
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
                    <div className={styles.items}>
                        <h4>
                            Referral Code
                        </h4>
                        <p>
                            Ge62c8c2we
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
