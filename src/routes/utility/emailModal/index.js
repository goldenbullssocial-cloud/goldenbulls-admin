import React from 'react'
import styles from './emailModal.module.scss';
import CloseIcon from '@/icons/closeIcon';
import Input from '@/components/input';
import OutlineButton from '@/components/outlineButton';
import Button from '@/components/button';
const Close = '/assets/icons/close.svg';
const SaveIcon = '/assets/icons/save.svg';
export default function EmailModal() {
    return (
        <div className={styles.emailModalWrapper}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2>
                        Email
                    </h2>
                    <div className={styles.closeIcon}>
                        <CloseIcon />
                    </div>
                </div>
                <div className={styles.modalBody}>
                    <Input label='Enter email which you would like to show on landing page' placeholder='example@mail.com' />

                    <div className={styles.buttonRightAlignment}>
                        <OutlineButton text="Cancel" icon={Close} />
                        <Button text="Save Banner" icon={SaveIcon} />
                    </div></div>
            </div>
        </div>
    )
}
