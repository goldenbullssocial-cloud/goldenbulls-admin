import React from 'react'
import styles from './settingsModal.module.scss';
import CloseIcon from '@/icons/closeIcon';
import Input from '@/components/input';
import Button from '@/components/button';
import OutlineButton from '@/components/outlineButton';
const SaveIcon = '/assets/icons/save.svg';
const Close = '/assets/icons/close.svg';
export default function SettingsModal() {
    return (
        <div className={styles.settingsModalWrapper}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2>
                        Settings
                    </h2>
                    <div className={styles.closeIcon}>
                        <CloseIcon />
                    </div>
                </div>
                <div className={styles.modalBody}>
                    <Input label='Commission %' placeholder='20' leftSpaceRemove bglight />
                    <div className={styles.addChain}>
                        <Input label='Network Chain' placeholder='Enter chain name' leftSpaceRemove bglight />
                        <button>
                            <span>
                                Add Chain
                            </span>
                        </button>
                    </div>
                    <div className={styles.spacer}></div>
                    <div className={styles.availableChains}>
                        <p>
                            Available Chains
                        </p>
                        <span>
                            No chains available
                        </span>
                    </div>
                    <div className={styles.twoButtonAlignment}>
                        <OutlineButton text="Cancel" icon={Close} />
                        <Button text="Save" icon={SaveIcon} />
                    </div>
                </div>
            </div>
        </div>
    )
}
