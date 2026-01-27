import React from "react";
import styles from "./blogCategories.module.scss";
import BlogCategoriesTable from "./blogCategoriesTable";

export default function BlogCategories() {
  return (
    <div className={styles.blogCategoriesContainer}>
      <BlogCategoriesTable />
    </div>
  );
}
