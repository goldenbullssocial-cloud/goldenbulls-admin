import React from 'react'
import styles from './utility.module.scss';
import SocialLinks from './socialLinks';
import BannerSection from './bannerSection';
import AddBanner from './addBanner';
import EmailModal from './emailModal';
export default function Utility() {
    return (
        <div className={styles.utility}>
            <SocialLinks />
            <BannerSection />
            <AddBanner />
            <EmailModal />
        </div>
    )
}
