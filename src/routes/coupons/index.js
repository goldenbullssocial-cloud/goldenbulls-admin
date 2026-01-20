import React from 'react'
import styles from './coupons.module.scss';
import CouponsTable from './couponsTable';
import AddDiscountCoupon from './addDiscountCoupon';
export default function Coupons() {
    return (
        <div className={styles.couponsPageAlignment}>
            <CouponsTable />
            <AddDiscountCoupon />
        </div>
    )
}
