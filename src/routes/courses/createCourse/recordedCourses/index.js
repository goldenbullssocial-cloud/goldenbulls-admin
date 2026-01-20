import React from 'react'
import styles from './recordedCourses.module.scss';
import Input from '@/components/input';
import Textarea from '@/components/textarea';
import DragIcon from '@/icons/dragIcon';
import classNames from 'classnames';
import RemoveIcon from '@/icons/removeIcon';
import Button from '@/components/button';
import PlusIcon from '@/icons/plusIcon';
const SaveIcon = '/assets/icons/save.svg';
export default function RecordedCourses() {
    return (
        <>
            <div className={styles.recordedCoursesAlignment}>
                <div className={styles.box}>
                    <div className={styles.chapterGrid}>
                        <Input label='Chapter Title' placeholder='Chapter Title' />
                        <Input label='Duration (Hours)' placeholder='Duration' />
                    </div>
                    <div className={styles.bottomAlignment}>
                        <Textarea label='Chapter Description' placeholder='Chapter Description' />
                    </div>
                    <div className={styles.chaapterVideo}>
                        <span>
                            Chapter Video
                        </span>
                        <div className={styles.uploadBox}>
                            <div className={styles.iconCenter}>
                                <DragIcon />
                            </div>
                            <p>
                                Drag and drop video here, or click to select
                            </p>
                        </div>
                    </div>
                </div>
                <div className={styles.box}>
                    <div className={classNames(styles.chapterGrid, styles.chapterGridChange)}>
                        <Input label='Chapter Title' placeholder='Chapter Title' />
                        <div className={styles.childgrid}>
                            <Input label='Duration (Hours)' placeholder='Duration' />
                            <div className={styles.remove}>
                                <RemoveIcon />
                            </div>
                        </div>
                    </div>
                    <div className={styles.bottomAlignment}>
                        <Textarea label='Chapter Description' placeholder='Chapter Description' />
                    </div>
                    <div className={styles.chaapterVideo}>
                        <span>
                            Chapter Video
                        </span>
                        <div className={styles.uploadBox}>
                            <div className={styles.iconCenter}>
                                <DragIcon />
                            </div>
                            <p>
                                Drag and drop video here, or click to select
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
        </>
    )
}
