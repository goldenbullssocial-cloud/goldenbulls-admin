"use client";
import React from "react";
import styles from "./addCenter.module.scss";
import CloseIcon from "@/icons/closeIcon";
import Input from "@/components/input";
import Button from "@/components/button";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

const SaveIcon = "/assets/icons/save.svg";

export default function AddCenter({
  onClose,
  onSave,
  selectedCountryId,
  selectedStateId,
  onCountryChange,
  onStateChange,
  onCityChange,
  onStateFocus,
  form,
}) {
  return (
    <div
      className={styles.addCenterModalWrapper}
      //   onClick={(e) => {
      //     e.stopPropagation();
      //     onClose();
      //   }}
    >
      <div className={styles.addCentermodal}>
        <div className={styles.modalHeader}>
          <h2>add center</h2>
          <div className={styles.closeIcon} onClick={onClose}>
            <CloseIcon />
          </div>
        </div>
        <form className={styles.modalBody} onSubmit={form.handleSubmit(onSave)}>
          <div className={styles.twoCol}>
            <Input
              name="centerName"
              label="Center Name"
              placeholder="Golden Bulls Mumbai Branch"
              {...form.register("centerName")}
              error={form.formState.errors.centerName?.message}
            />
            <Input
              name="location"
              label="Google Maps Link"
              placeholder="maps.google.com"
              {...form.register("location")}
              error={form.formState.errors.location?.message}
            />
          </div>
          <div className={styles.threeCol}>
            <div>
              <label>Country</label>
              <CountrySelect
                defaultValue={
                  form.getValues("country")
                    ? { name: form.getValues("country") }
                    : undefined
                }
                onChange={(value) => {
                  form.setValue("country", value?.name || "");
                  onCountryChange && onCountryChange(value);
                }}
                placeHolder="Select Country"
              />
              {form.formState.errors.country && (
                <span className={styles.error}>
                  {form.formState.errors.country.message}
                </span>
              )}
            </div>
            <div>
              <label>City</label>
              <CitySelect
                value={
                  form.getValues("city")
                    ? { name: form.getValues("city") }
                    : null
                }
                countryid={selectedCountryId}
                stateid={selectedStateId}
                onChange={(val) => {
                  form.setValue("city", val?.name || "");
                  onCityChange(val);
                }}
                placeHolder="Select City"
                disabled={!selectedStateId}
              />
              {form.formState.errors.city && (
                <span className={styles.error}>
                  {form.formState.errors.city.message}
                </span>
              )}
            </div>
            <div>
              <label>State</label>
              <StateSelect
                value={
                  form.getValues("state")
                    ? { name: form.getValues("state") }
                    : null
                }
                countryid={selectedCountryId}
                onChange={(val) => {
                  form.setValue("state", val?.name || "");
                  onStateChange(val);
                }}
                onFocus={onStateFocus}
                placeHolder="Select State"
                disabled={!selectedCountryId}
              />
              {form.formState.errors.state && (
                <span className={styles.error}>
                  {form.formState.errors.state.message}
                </span>
              )}
            </div>
          </div>
          <div className={styles.saveButton}>
            <Button type="submit" text="Save" icon={SaveIcon} />
          </div>
        </form>
      </div>
    </div>
  );
}
