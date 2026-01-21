import React from 'react'
import styles from './bannerSection.module.scss';
import Button from '@/components/button';
const PlusIcon = '/assets/icons/plus.svg';
const BannerImage = '/assets/images/banner1.png';
export default function BannerSection() {
    return (
        <div className={styles.bannerSection}>
            <div className={styles.headerAlignment}>
                <h3>
                    Banner Images of Mobile app
                </h3>
                <Button text="Add Banner" icon={PlusIcon} />
            </div>
            <div className={styles.imageGrid}>
                {
                    [...Array(6)].map(() => {
                        return (
                            <div className={styles.items}>
                                <img src={BannerImage} alt='BannerImage' />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
