import React from "react";
import styles from "./blogs.module.scss";
import BlogsTable from "./blogsTable";

export default function Blogs() {
  return (
    <div className={styles.blogsContainer}>
      <BlogsTable />
    </div>
  );
}
