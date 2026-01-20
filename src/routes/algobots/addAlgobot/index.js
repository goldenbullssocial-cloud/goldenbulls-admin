import React from 'react'
import styles from './addAlgobot.module.scss';
import CloseIcon from '@/icons/closeIcon';
import Input from '@/components/input';
import Textarea from '@/components/textarea';
import Button from '@/components/button';
const SaveIcon = '/assets/icons/save.svg';
export default function AddAlgobot() {
    return (
        <div className={styles.addAlgobotWrapper}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2>
                        Add algobot
                    </h2>
                    <div className={styles.closeIcon}>
                        <CloseIcon />
                    </div>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.spacing}>
                        <Input label='Algobot’s Name' placeholder='Forex trading for complete beginners' />
                    </div>
                    <Textarea label='Algobot’s Description' placeholder='Chapter Description' />
                    <div className={styles.twoCol}>
                        <Input text="%" label='Returns' placeholder='100' bglight />
                        <Input label='Risk' leftSpaceRemove placeholder='Low' bglight />
                    </div>
                    <div className={styles.twoCol}>
                        <Input label='Price 1 Month' bglight leftSpaceRemove placeholder='$' />
                        <Input label='Price 3 Month' bglight leftSpaceRemove placeholder='$' />
                        <Input label='Price 6 Month' bglight leftSpaceRemove placeholder='$' />
                        <Input label='Price 12 Month' bglight leftSpaceRemove placeholder='$' />
                    </div>
                    <div className={styles.topAlignment}>
                        <Input label='Youtube Tutorial URL' leftSpaceRemove placeholder='Forex trading for complete beginners' bglight />

                    </div>
                </div>
                <div className={styles.modalFooter}>
                    <Button text="Save Algobot" icon={SaveIcon} />
                </div>
            </div>
        </div>
    )
}
