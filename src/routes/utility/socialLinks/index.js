import React from 'react'
import styles from './socialLinks.module.scss';
import EditIcon from '@/icons/editIcon';
export default function SocialLinks() {
    return (
        <div className={styles.socialLinks}>
            <div className={styles.title}>
                <h2>
                    Social Links
                </h2>
            </div>
            <div className={styles.grid}>
                {
                    [...Array(7)].map(() => {
                        return (
                            <div className={styles.gridItems}>
                                <div className={styles.cardHeaderAlignment}>
                                    <h3>
                                        Email
                                    </h3>
                                    <EditIcon />
                                </div>
                                <p>
                                    contact@goldenbulls.international
                                </p>
                            </div>
                        )
                    })
                }
            </div>
            <div className={styles.line}></div>
        </div>
    )
}
