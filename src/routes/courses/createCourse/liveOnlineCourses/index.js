import React from 'react'
import styles from './liveOnlineCourses.module.scss';
import UploadIcon from '@/icons/uploadIcon';
import Input from '@/components/input';
import DragIcon from '@/icons/dragIcon';
import PlusIcon from '@/icons/plusIcon';
import Button from '@/components/button';
const SaveIcon = '/assets/icons/save.svg';

export default function LiveOnlineCoursesindex() {
    return (
        <div className={styles.liveOnlineCourses}>
            <div className={styles.box}>
                <div className={styles.bottomAlignment}>
                    <div className={styles.chaapterVideo}>
                        <span>
                            Course Thumbnail Image
                        </span>
                        <div className={styles.uploadBox}>
                            <div className={styles.iconCenter}>
                                <UploadIcon />
                            </div>
                            <p>
                                Drag and drop image here, or click to select
                            </p>
                        </div>
                    </div>
                </div>
                <div className={styles.bottomAlignment}>
                    <Input label='Course Name' placeholder='Course Name' />
                </div>
                <div className={styles.bottomAlignment}>
                    <Input label='Course Description' placeholder='Course Description' />
                </div>
                <div className={styles.twoCol}>
                    <Input label='Instructor Name' placeholder='Instructor Name' />
                    <Input label='Language' placeholder='English' />
                </div>
                <div className={styles.threeCol}>
                    <Input label='Course Price ($)' placeholder='Course Price' />
                    <Input label='Course Duration' placeholder='Course Duration' />
                    <Input label='Course Level' placeholder='Course Level' />
                </div>
                <div className={styles.chaapterVideo}>
                    <span>
                        Intro Video
                    </span>
                    <div className={styles.uploadBox}>
                        <div className={styles.iconCenter}>
                            <DragIcon />
                        </div>
                        <p>
                            Drag and drop image here, or click to select
                        </p>
                    </div>
                </div>
                <div className={styles.buttonGrid}>
                    <div className={styles.addbutton}>
                        <button>
                            <PlusIcon />
                            <span>
                                Add Chapter
                            </span>
                        </button>
                    </div>
                    <Button text="Save Course" icon={SaveIcon} />
                </div>
            </div>
        </div>
    )
}
