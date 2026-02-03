import React from "react";
import styles from "./coursesTab.module.scss";
export default function CoursesTab({ activeTab, setActiveTab }) {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  return (
    <div className={styles.coursesTabCenter}>
      <div className={styles.tabGroup}>
        <button
          className={activeTab === "recorded" ? styles.active : ""}
          onClick={() => handleTabClick("recorded")}
        >
          <span>Recorded Courses</span>
        </button>
        <button
          className={activeTab === "live" ? styles.active : ""}
          onClick={() => handleTabClick("live")}
        >
          <span>Live Online Courses</span>
        </button>
        <button
          className={activeTab === "physical" ? styles.active : ""}
          onClick={() => handleTabClick("physical")}
        >
          <span>In Person Courses</span>
        </button>
      </div>
    </div>
  );
}
