import React from 'react'
import styles from './editUserDetails.module.scss';
import CloseIcon from '@/icons/closeIcon';
import Input from '@/components/input';
import Button from '@/components/button';
export default function EditUserDetails() {
    return (
        <div className={styles.editUserDetails}>
            <div className={styles.editUsermodal}>
                <div className={styles.modalHeader}>
                    <h2>
                        Edit User Details
                    </h2>
                    <div className={styles.closeIcon}>
                        <CloseIcon />
                    </div>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.twoCol}>
                        <Input smallInput label='First Name' placeholder='Steve' />
                        <Input smallInput label='Last Name' placeholder='Harrington' />
                        <Input smallInput label='Phone' placeholder='1234567890' />
                        <Input smallInput label='Email' placeholder='thehairharrington@gmail.com' />
                        <Input smallInput label='City' placeholder='Hawkins' />
                        <Input smallInput label='State' placeholder='Indiana' />
                        <Input smallInput label='Country' placeholder='United States' />
                        <Input smallInput label='Gender' placeholder='Select gender' />
                    </div>
                    <div className={styles.button}>
                        <Button text="Save" />
                    </div>
                </div>
            </div>
        </div>
    )
}
