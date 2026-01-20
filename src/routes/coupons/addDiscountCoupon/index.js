import React from 'react'
import styles from './addDiscountCoupon.module.scss';
import CloseIcon from '@/icons/closeIcon';
import Input from '@/components/input';
import Button from '@/components/button';
const SaveIcon = '/assets/icons/save.svg';
export default function AddDiscountCoupon() {
    return (
        <div className={styles.addDiscountCouponwrapper}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2>
                        Add Discount Coupon
                    </h2>
                    <div className={styles.closeIcon}>
                        <CloseIcon />
                    </div>
                </div>
                <div className={styles.modalBody}>
                    <Input label='Coupon Code' placeholder='(Max 8 characters)' bglight leftSpaceRemove />
                    <div className={styles.threeCol}>
                        <Input label='Discount %' placeholder='Discount %' bglight leftSpaceRemove text='%' />
                        <Input label='Expiry Date' placeholder='Low' bglight leftSpaceRemove />
                        <Input label='Usage Limit' placeholder='Low' bglight leftSpaceRemove />
                    </div>
                    <Button text="Save Course" icon={SaveIcon} className={styles.buttonWidth} />
                </div>
            </div>
        </div>
    )
}
