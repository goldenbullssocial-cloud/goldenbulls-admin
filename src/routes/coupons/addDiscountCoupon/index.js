import React from "react";
import styles from "./addDiscountCoupon.module.scss";
import CloseIcon from "@/icons/closeIcon";
import Input from "@/components/input";
import Button from "@/components/button";
const SaveIcon = "/assets/icons/save.svg";
export default function AddDiscountCoupon({
  onClose,
  isEditMode,
  form,
  onSubmit,
}) {
  return (
    <div className={styles.addDiscountCouponwrapper}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{isEditMode ? "Edit" : "Add"} Discount Coupon</h2>
          <div className={styles.closeIcon} onClick={onClose}>
            <CloseIcon />
          </div>
        </div>
        <form
          className={styles.modalBody}
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(onSubmit)();
          }}
        >
          <Input
            label="Coupon Code"
            placeholder="(Max 8 characters)"
            name="couponCode"
            value={form.watch("couponCode") || ""}
            onChange={(e) => {
              const value = e.target.value.trim().toUpperCase();
              form.setValue("couponCode", value);
            }}
            onBlur={(e) => {
              const value = e.target.value.trim().toUpperCase();
              form.setValue("couponCode", value);
              form.trigger("couponCode");
            }}
            error={form.formState.errors.couponCode?.message}
            maxLength={8}
            bglight
            leftSpaceRemove
          />
          <div className={styles.threeCol}>
            <Input
              label="Discount %"
              placeholder="Discount %"
              bglight
              leftSpaceRemove
              name="discount"
              type="number"
              min="1"
              max="99"
              step="1"
              value={form.watch("discount") || ""}
              onChange={(e) => {
                let value = e.target.value;
                if (value !== "" && !/^\d+$/.test(value)) {
                  value = value.replace(/[^0-9]/g, "");
                }
                form.setValue("discount", value);
              }}
              onBlur={() => {
                form.trigger("discount");
              }}
              error={form.formState.errors.discount?.message}
            />
            <div className={styles.dateInputContainer}>
              <Input
                label="Expiry Date"
                name="expiryDate"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={
                  form.watch("expiryDate")
                    ? new Date(form.watch("expiryDate"))
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={(e) => {
                  const dateValue = e.target.value
                    ? new Date(e.target.value)
                    : null;
                  form.setValue("expiryDate", dateValue);
                }}
                onBlur={() => {
                  form.trigger("expiryDate");
                }}
                bglight
                leftSpaceRemove
                error={form.formState.errors.expiryDate?.message}
                className={styles.dateInput}
              />
          
            </div>
            <Input
              label="Usage Limit"
              name="usageLimit"
              type="number"
              min="1"
              value={form.watch("usageLimit") || ""}
              onChange={(e) => {
                let value = e.target.value;
                if (value !== "" && !/^\d+$/.test(value)) {
                  value = value.replace(/[^0-9]/g, "");
                }
                form.setValue("usageLimit", value);
              }}
              onBlur={() => {
                form.trigger("usageLimit");
              }}
              bglight
              leftSpaceRemove
              error={form.formState.errors.usageLimit?.message}
            />
          </div>
          <Button
            type="submit"
            text={isEditMode ? "Update Coupon" : "Add Coupon"}
            disabled={!form.formState.isDirty || form.formState.isSubmitting}
            icon={SaveIcon}
            className={styles.buttonWidth}
          />
        </form>
      </div>
    </div>
  );
}
