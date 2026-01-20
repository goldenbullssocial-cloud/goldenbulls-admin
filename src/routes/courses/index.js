import React from 'react'
import styles from './courses.module.scss';
import CoursesTab from './coursesTab';
import ClockInIcon from '@/icons/clockIcon';
import StarIcon from '@/icons/starIcon';
import CreateCourse from './createCourse';
const CardImage = '/assets/images/course-user.png';

export default function Courses() {
    return (
        <div className={styles.coursesPageAlignment}>
            <CoursesTab />
            <div className={styles.grid}>
                {
                    [...Array(4)].map((_, i) => {
                        return (
                            <div className={styles.griditems} key={i}>
                                <div className={styles.cardImage}>
                                    <img src={CardImage} alt='CardImage' />
                                </div>
                                <div className={styles.details}>
                                    <h3>
                                        Forex trading mastferclass for absolute beginners, and market enthusiasts
                                    </h3>
                                    <div className={styles.listAlignment}>
                                        <div className={styles.time}>
                                            <ClockInIcon />
                                            <span>12 Hours</span>
                                        </div>

                                        <div className={styles.dotButton}>
                                            <div className={styles.dot}></div>
                                            <button>
                                                <span>Beginner</span>
                                            </button>
                                        </div>

                                        <div className={styles.ratingAlignment}>
                                            <div className={styles.dot}></div>
                                            <div className={styles.rating}>
                                                <StarIcon />
                                                <span>4.5</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <CreateCourse />
        </div>
    )
}
