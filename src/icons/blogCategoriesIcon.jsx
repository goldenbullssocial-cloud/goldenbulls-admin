import React from "react";

const BlogCategoriesIcon = ({
  fill = "none",
  stroke = "#8C8C8C",
  ...props
}) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="7" y1="7" x2="7" y2="7" />
    <line x1="7" y1="12" x2="7" y2="12" />
    <line x1="7" y1="17" x2="7" y2="17" />
    <line x1="11" y1="7" x2="17" y2="7" />
    <line x1="11" y1="12" x2="17" y2="12" />
    <line x1="11" y1="17" x2="17" y2="17" />
  </svg>
);

export default BlogCategoriesIcon;
