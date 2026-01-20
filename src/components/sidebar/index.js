import React from 'react'
import styles from './sidebar.module.scss';
import UserIcon from '@/icons/userIcon';
import UpIcon from '@/icons/upIcon';
import LibraryIcon from '@/icons/libraryIcon';
import CoursesIcon from '@/icons/coursesIcon';

import classNames from 'classnames';
import DashboardIcon from '@/icons/dashboardIcon';
import UsersIcon from '@/icons/usersIcon';
import CentersIcon from '@/icons/centersIcon';
import AlgobotsIcon from '@/icons/algobotsIcon';
import CouponsIcon from '@/icons/couponsIcon';
import RevenueIcon from '@/icons/revenueIcon';
import RequestsIcon from '@/icons/requestsIcon';
import UtilityIcon from '@/icons/utilityIcon';
import YoutubeIcon from '@/icons/youtubeIcon';
const Logo = '/assets/logo/logo.svg';

export default function Sidebar() {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarlogo}>
                <img src={Logo} alt='Logo' />
            </div>
            <div className={styles.asideBody}>
                <div className={classNames(styles.active, styles.menu)}>
                    <DashboardIcon />
                    <span>
                        Dashboard
                    </span>
                </div>
                <div className={classNames(styles.menu)}>
                    <UsersIcon />
                    <span>
                        Users
                    </span>
                </div>
                <div className={classNames(styles.menu)}>
                    <CentersIcon />
                    <span>
                        Centers
                    </span>
                </div>
                <div className={classNames(styles.menu)}>
                    <CoursesIcon />
                    <span>
                        Courses
                    </span>
                </div>
                <div className={classNames(styles.menu)}>
                    <AlgobotsIcon />
                    <span>
                        Algobots
                    </span>
                </div>
                <div className={classNames(styles.menu)}>
                    <CouponsIcon />
                    <span>
                        Coupons
                    </span>
                </div>
                <div className={classNames(styles.menu)}>
                    <RevenueIcon />
                    <span>
                        Revenue
                    </span>
                </div>
                <div className={classNames(styles.menu)}>
                    <RequestsIcon />
                    <span>
                        Requests
                    </span>
                </div>
                <div className={classNames(styles.menu)}>
                    <UtilityIcon />
                    <span>
                        Utility
                    </span>
                </div>
                <div className={classNames(styles.menu)}>
                    <YoutubeIcon />
                    <span>
                        YouTube
                    </span>
                </div>
            </div>
            <div className={styles.asideFooter}>
                <div className={styles.profileBox}>
                    <div className={styles.profile}>
                        <UserIcon />
                    </div>
                    <div className={styles.textgrid}>
                        <span>
                            Steve
                            Harrington
                        </span>
                        <UpIcon />
                    </div>
                </div>
            </div>
        </aside>
    )
}
