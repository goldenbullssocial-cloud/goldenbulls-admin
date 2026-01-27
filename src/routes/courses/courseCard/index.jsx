"use client";
import styles from "./courseCard.module.scss";
import ClockInIcon from "@/icons/clockIcon";
import StarIcon from "@/icons/starIcon";
import Image from "next/image";
import ViewIcon from "../../../../public/assets/icons/Eye.svg";
import EditIcon from "../../../../public/assets/icons/Edit.svg";
import InactiveIcon from "../../../../public/assets/icons/InactiveUser.svg";
import DeleteIcon from "../../../../public/assets/icons/Delete.svg";
import Dropdown from "@/components/dropdown";
import NoDataFound from "@/components/noDataFound";
export default function CourseCard({
  courses,
  activeTab,
  onView,
  loading,
  onEdit,
  onDelete,
}) {
  const getUserActions = (isActive) => [
    {
      key: "view",
      label: "View",
      icon: ViewIcon,
    },
    {
      key: "edit",
      label: "Edit",
      icon: EditIcon,
    },
    {
      key: "delete",
      label: "Delete",
      icon: DeleteIcon,
      variant: "danger",
    },
  ];
  const handleAction = (action, course) => {
    if (action === "view") onView(course);
    if (action === "edit") onEdit(course);
    if (action === "delete") onDelete(course);
  };
  return (
    <div className={styles.grid}>
      {loading ? (
        <>Loading..</>
      ) : courses?.length > 0 ? (
        courses?.map((course, i) => {
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
                  <Dropdown
                    actions={getUserActions(course.isActive)}
                    onSelect={(action) => handleAction(action, course)}
                  />
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <NoDataFound />
      )}
    </div>
  );
}
