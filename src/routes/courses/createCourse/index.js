import React from 'react'
import styles from './createCourse.module.scss';
import CloseIcon from '@/icons/closeIcon';
import RecordedCourses from './recordedCourses';
import LiveOnlineCoursesindex from './liveOnlineCourses';
export default function CreateCourse() {
  return (
    <div className={styles.createCourseWrapper}>
      <div className={styles.createCourse}>
        <div className={styles.modalHeader}>
          <h2>
            Create Course
          </h2>
          <div className={styles.closeIcon}>
            <CloseIcon />
          </div>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.tabGroup}>
            <button className={styles.active}>
              <span>Recorded Courses</span>
            </button>
            <button>
              <span>Live Online Courses</span>
            </button>
            <button>
              <span>In Person Courses</span>
            </button>
          </div>
          <div className={styles.spacer}></div>
          <div className={styles.contentGrid}>
            <div className={styles.items}>
              <div className={styles.counterGrid}>
                <div>
                  <div className={styles.counter}>1</div>
                  <div className={styles.line}></div>
                </div>
                <span>
                  Course Details
                </span>
              </div>
              <div className={styles.counterGrid}>
                <div>
                  <div className={styles.counter}>2</div>
                  <div className={styles.line}></div>
                </div>
                <span>
                  Syllabus
                </span>
              </div>
              <div className={styles.counterGrid}>
                <div>
                  <div className={styles.counter}>2</div>
                </div>
                <span>
                  Batch
                </span>
              </div>
            </div>
            <div className={styles.items}>
              {/* <RecordedCourses /> */}
              <LiveOnlineCoursesindex />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
