import React from "react";
import Select from "react-select";

const StyledSelect = ({
  options = [],
  value,
  onChange,
  placeholder = "Select option",
  isDisabled = false,
  onBlur,
  error,
  paddingLeft = "16px",
  ...props
}) => {
  const selectStyles = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      height: "52px",
      borderRadius: "16px",
      background: "rgba(255, 255, 255, 0.10)",
      border: "1px solid #66666693",
      fontSize: "16px",
      color: "#fff",
      paddingLeft: paddingLeft,
      paddingRight: "16px",
      outline: "none",
      transition: ".3s ease-in-out",
      "&:hover": {
        border: "1px solid #F9F490",
      },
      ...(state.isFocused && {
        border: "1px solid #F9F490",
        boxShadow: "none",
      }),
      ...(state.isDisabled && {
        background: "rgba(255, 255, 255, 0.05)",
        cursor: "not-allowed",
      }),
    }),
    placeholder: (baseStyles) => ({
      ...baseStyles,
      color: "rgba(255, 255, 255, 0.40)",
      fontSize: "16px",
      fontWeight: 400,
    }),
    singleValue: (baseStyles) => ({
      ...baseStyles,
      color: "#fff",
      fontSize: "16px",
      fontWeight: 400,
    }),
    input: (baseStyles) => ({
      ...baseStyles,
      color: "#fff",
      fontSize: "16px",
      fontWeight: 400,
    }),
    menu: (baseStyles) => ({
      ...baseStyles,
      background: "#000",
      border: "1px solid #66666693",
      borderRadius: "16px",
      marginTop: "4px",
      boxShadow: "none",
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      background: state.isFocused ? "rgba(255, 255, 255, 0.10)" : "transparent",
      color: "#fff",
      fontSize: "16px",
      fontWeight: 400,
      padding: "12px 16px",
      cursor: "pointer",
      "&:active": {
        background: "rgba(255, 255, 255, 0.20)",
      },
    }),
    indicatorSeparator: (baseStyles) => ({
      ...baseStyles,
      backgroundColor: "#66666693",
    }),
    dropdownIndicator: (baseStyles) => ({
      ...baseStyles,
      color: "#fff",
      "&:hover": {
        color: "#fff",
      },
    }),
    clearIndicator: (baseStyles) => ({
      ...baseStyles,
      color: "#fff",
      "&:hover": {
        color: "#fff",
      },
    }),
  };

  return (
    <div className="styled-select-field">
      <Select
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        isDisabled={isDisabled}
        onBlur={onBlur}
        styles={selectStyles}
        {...props}
      />
      {error && <span className="styled-select-error">{error}</span>}
    </div>
  );
};

export default StyledSelect;
