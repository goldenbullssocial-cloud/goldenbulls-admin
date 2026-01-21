import React from 'react'
import styles from './addyoutubeVideo.module.scss';
import CloseIcon from '@/icons/closeIcon';
import Input from '@/components/input';
import Dropicon from '@/icons/dropicon';
import OutlineButton from '@/components/outlineButton';
import Button from '@/components/button';
const Close = '/assets/icons/close.svg';
const SaveIcon = '/assets/icons/save.svg';
export default function AddyoutubeVideo() {
    return (
        <div className={styles.addyoutubeVideoWrapper}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2>
                        Add youtube video
                    </h2>
                    <div className={styles.closeIcon}>
                        <CloseIcon />
                    </div>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.bottomSpacing}>
                        <Input label='Title' placeholder='Enter Video Title' bglight leftSpaceRemove />
                    </div>
                    <div className={styles.bottomSpacing}>
                        <Input label='YouTube URL' placeholder='https://youtube.com' bglight leftSpaceRemove />
                    </div>
                    <div className={styles.text}>
                        <p>Upload Thumbnail Image (16:9 Ratio)</p>
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
    )
}

