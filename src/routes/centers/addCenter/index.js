import React from 'react'
import styles from './addCenter.module.scss';
import CloseIcon from '@/icons/closeIcon';
import Input from '@/components/input';
import Button from '@/components/button';
const SaveIcon = '/assets/icons/save.svg';
export default function AddCenter() {
    return (
        <div className={styles.addCenterModalWrapper}>
            <div className={styles.addCentermodal}>
                <div className={styles.modalHeader}>
                    <h2>
                        add center
                    </h2>
                    <div className={styles.closeIcon}>
                        <CloseIcon />
                    </div>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.twoCol}>
                        <Input label='Center Name' placeholder='Golden Bulls Mumbai Branch' />
                        <Input label='Google Maps Link' placeholder='maps.google.com' />
                    </div>
                    <div className={styles.threeCol}>
                        <Input label='City' placeholder='Mumbai' />
                        <Input label='State' placeholder='Maharashtra' />
                        <Input label='Country' placeholder='India' />
                    </div>
                    <div className={styles.saveButton}>
                        <Button text="Save" icon={SaveIcon} />
                    </div>
                </div>
            </div>
        </div>
    )
}
