import React from 'react'
import styles from './addBanner.module.scss';
import CloseIcon from '@/icons/closeIcon';
import Dropicon from '@/icons/dropicon';
import Button from '@/components/button';
import OutlineButton from '@/components/outlineButton';
const Close = '/assets/icons/close.svg';
const SaveIcon = '/assets/icons/save.svg';
export default function AddBanner() {
    return (
        <div className={styles.addBannerAlignment}>
            <div className={styles.usermodal}>
                <div className={styles.modalHeader}>
                    <h2>
                        Add banner
                    </h2>
                    <div className={styles.closeIcon}>
                        <CloseIcon />
                    </div>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.dragBox}>
                        <div className={styles.text}>
                            <span>
                                Upload Banner Image (16:9 Ratio)
                            </span>
                        </div>
                        <div className={styles.dragBox}>
                            <div className={styles.iconCenter}>
                                <Dropicon />
                            </div>
                            <h5>
                                Drag and drop image here, or click to select
                            </h5>
                            <p>
                                (PNG, JPG or WEBP)
                            </p>
                        </div>
                        <div className={styles.buttonRightAlignment}>
                            <OutlineButton text="Cancel" icon={Close} />
                            <Button text="Save Banner" icon={SaveIcon} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
