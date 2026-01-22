"use client";
import styles from "./courseCard.module.scss";
import ClockInIcon from "@/icons/clockIcon";
import StarIcon from "@/icons/starIcon";
import Image from "next/image";
export default function CourseCard({
  courses,
  activeTab,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <div className={styles.grid}>
      {courses?.map((course, i) => {
        return (
          <div className={styles.griditems} key={i}>
            <div className={styles.cardImage}>
              <Image
                src={
                  course.courseVideo?.includes("youtube.com/watch")
                    ? `https://img.youtube.com/vi/${course.courseVideo.split("v=")[1]}/maxresdefault.jpg`
                    : course.courseVideo
                }
                alt={course.CourseName || "Course thumbnail"}
                width={400}
                height={225}
              />
            </div>
            <div className={styles.details}>
              <h3>{course?.CourseName}</h3>
              <div className={styles.listAlignment}>
                <div className={styles.time}>
                  <ClockInIcon />
                  <span>{course?.hours}</span>
                </div>

                <div className={styles.dotButton}>
                  <div className={styles.dot}></div>
                  <button>
                    <span>{course?.courseLevel}</span>
                  </button>
                </div>

                <div className={styles.ratingAlignment}>
                  <div className={styles.dot}></div>
                  <div className={styles.rating}>
                    <StarIcon />
                    <span>{course?.instructor?.rating || "4.5"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
