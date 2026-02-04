import React from "react";
import styles from "./footerImages.module.scss";
import FooterImagesTable from "./footerImagesTable";

export default function FooterImages() {
  return (
    <div className={styles.footerImagesContainer}>
      <FooterImagesTable />
    </div>
  );
}
