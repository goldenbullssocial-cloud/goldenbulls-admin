"use client";
import React, { useState, useEffect } from "react";
import styles from "./addCenter.module.scss";
import CloseIcon from "@/icons/closeIcon";
import Input from "@/components/input";
import Button from "@/components/button";
import StyledSelect from "@/components/styledSelect";
import { Country, State, City } from "country-state-city";

const SaveIcon = "/assets/icons/save.svg";

const toOption = (item) => ({
  value: item.isoCode || item.name,
  label: item.name,
  data: item,
});

export default function AddCenter({
  onClose,
  onSubmit,
  onStateFocus,
  form,
  isEditMode,
  isOpen,
  isLoading,
}) {
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);

  useEffect(() => {
    // Initialize values from form only in edit mode
    if (isEditMode) {
      const countryName = form.getValues("country");
      const stateName = form.getValues("state");
      const cityName = form.getValues("city");

      if (countryName) {
        const c = Country.getAllCountries().find((x) => x.name === countryName);
        if (c) {
          const countryOpt = toOption(c);
          setCountry(countryOpt);

          if (stateName) {
            const s = State.getStatesOfCountry(c.isoCode).find(
              (x) => x.name === stateName,
            );
            if (s) {
              const stateOpt = toOption(s);
              setState(stateOpt);

              if (cityName) {
                const ci = City.getCitiesOfState(c.isoCode, s.isoCode).find(
                  (x) => x.name === cityName,
                );
                if (ci) setCity(toOption(ci));
              }
            }
          }
        }
      }
    }
  }, [isEditMode]);

  // Reset local state when form is reset or modal is closed
  useEffect(() => {
    if (!isOpen) {
      setCountry(null);
      setState(null);
      setCity(null);
    }
  }, [isOpen]);

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
          <h2>{isEditMode ? "Edit Center" : "Add Center"}</h2>
          <div className={styles.closeIcon} onClick={onClose}>
            <CloseIcon />
          </div>
        </div>
        <form
          className={styles.modalBody}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className={styles.twoCol}>
            <Input
              name="centerName"
              label="Center Name"
              placeholder="Enter center name"
              {...form.register("centerName", {
                setValueAs: (value) => value?.trimStart(),
                onChange: (e) => (e.target.value = e.target.value.trimStart()),
              })}
              error={form.formState.errors.centerName?.message}
            />
            <Input
              name="location"
              label="Google Maps Link"
              placeholder="maps.google.com"
              {...form.register("location", {
                setValueAs: (value) => value?.trimStart(),
                onChange: (e) => (e.target.value = e.target.value.trimStart()),
              })}
              error={form.formState.errors.location?.message}
            />
          </div>
          <div className={styles.threeCol}>
            <div>
              <label>Country</label>
              <StyledSelect
                options={Country.getAllCountries().map(toOption)}
                value={country}
                onChange={(val) => {
                  setCountry(val);
                  setState(null);
                  setCity(null);

                  form.setValue("country", val?.label ?? "", {
                    shouldValidate: true,
                  });
                  form.setValue("state", "", { shouldValidate: true });
                  form.setValue("city", "", { shouldValidate: true });

                  onCountryChange?.(val);
                }}
                placeholder="Select Country"
              />
              {form.formState.errors.country?.message && (
                <p className={styles.error}>
                  {form.formState.errors.country.message}
                </p>
              )}
            </div>
            <div>
              <label>State</label>
              <StyledSelect
                options={
                  country
                    ? State.getStatesOfCountry(country.data.isoCode).map(
                        toOption,
                      )
                    : []
                }
                value={state}
                onChange={(val) => {
                  setState(val);
                  setCity(null);

                  form.setValue("state", val?.label ?? "", {
                    shouldValidate: true,
                  });
                  form.setValue("city", "", { shouldValidate: true });
                }}
                onFocus={onStateFocus}
                placeholder="Select State"
                isDisabled={!country}
              />
              {form.formState.errors.state?.message && (
                <p className={styles.error}>
                  {form.formState.errors.state.message}
                </p>
              )}
            </div>
            <div>
              <label>City</label>
              <StyledSelect
                options={
                  state
                    ? City.getCitiesOfState(
                        country.data.isoCode,
                        state.data.isoCode,
                      ).map(toOption)
                    : []
                }
                value={city}
                onChange={(val) => {
                  setCity(val);

                  form.setValue("city", val?.label ?? "", {
                    shouldValidate: true,
                  });

                  onCityChange?.(val);
                }}
                placeholder="Select City"
                isDisabled={!state}
              />
              {form.formState.errors.city?.message && (
                <p className={styles.error}>
                  {form.formState.errors.city.message}
                </p>
              )}
            </div>
          </div>
          <div className={styles.saveButton}>
            <Button
              type="submit"
              text={isEditMode ? "Update" : "Save"}
              icon={SaveIcon}
              disabled={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
