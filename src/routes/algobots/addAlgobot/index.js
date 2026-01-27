import React, { useState } from "react";
import styles from "./addAlgobot.module.scss";
import CloseIcon from "@/icons/closeIcon";
import Input from "@/components/input";
import Textarea from "@/components/textarea";
import Button from "@/components/button";
import { Pencil, Trash2 } from "lucide-react";
const SaveIcon = "/assets/icons/save.svg";
export default function AddAlgobot({
  setIsOpen,
  step,
  setStep,
  register,
  setValue,
  errors,
  onNext,
  onSubmitSecond,
  handleSubmit,
  watch,
  isEditMode,
  isFetchingProviders,
  isFetchingBotsList,
  providers,
  bots,
  getValues,
  filteredBots,
  handleAddPlan,
  isLoading,
  planEdit,
  plans,
  handleEditPlan,
  handleRemovePlan,
  editingPlanId,
}) {
  console.log("bot");

  return (
    <div className={styles.addAlgobotWrapper}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{isEditMode ? "Edit AlgoBot" : "Add AlgoBot"}</h2>
          <div className={styles.closeIcon} onClick={() => setIsOpen(false)}>
            <CloseIcon />
          </div>
        </div>
        <div className={styles.navigationTabs}>
          <div className={styles.tabsContainer}>
            <div
              onClick={() => setStep(1)}
              className={`${styles.tab} ${step === 1 ? styles.active : ""}`}
            >
              Bot Details
            </div>
            <div
              onClick={() => setStep(2)}
              className={`${styles.tab} ${step === 2 ? styles.active : ""}`}
            >
              Plans
            </div>
          </div>
        </div>
        {step === 1 && (
          <div className={styles.modalBody}>
            <div className={styles.spacing}>
              <Input
                label="Algobot’s Name"
                id="title"
                placeholder="Enter strategy name"
                {...register("title")}
                onBlur={(e) => {
                  const value = e.target.value.trim();
                  setValue("title", value, { shouldValidate: true });
                }}
                onKeyDown={(e) => {
                  if (e.key === " " && !e.currentTarget.value.trim()) {
                    e.preventDefault();
                  }
                }}
                error={errors.title?.message}
              />
            </div>
            <div className={styles.textareaWrapper}>
              <Textarea
                label="Algobot's Description"
                name="shortDescription"
                id="shortDescription"
                placeholder="Enter a brief description (10-50 characters)"
                value={watch("shortDescription") || ""}
                onChange={(e) => {
                  setValue("shortDescription", e.target.value, {
                    shouldValidate: true,
                  });
                }}
                onBlur={(e) => {
                  const value = e.target.value.trim();
                  setValue("shortDescription", value, {
                    shouldValidate: true,
                  });
                }}
                onKeyDown={(e) => {
                  if (e.key === " " && !e.currentTarget.value.trim()) {
                    e.preventDefault();
                  }
                }}
                rows={2}
                error={errors?.shortDescription?.message}
              />
              {errors?.shortDescription?.message && (
                <p className={styles.error}>
                  {errors.shortDescription.message}
                </p>
              )}
            </div>
            <div className={styles.twoCol}>
              <Input
                text="%"
                label="Returns"
                placeholder="100"
                bglight
                name="returns"
                id="returns"
                {...register("returns")}
                onBlur={(e) => {
                  const value = e.target.value.trim();
                  setValue("returns", value, { shouldValidate: true });
                }}
                onKeyDown={(e) => {
                  if (e.key === " " && !e.currentTarget.value.trim()) {
                    e.preventDefault();
                  }
                }}
                error={errors.returns?.message}
              />
              <Input
                label="Risk"
                leftSpaceRemove
                placeholder="Low"
                bglight
                name="risk"
                id="risk"
                {...register("risk")}
                onBlur={(e) => {
                  const value = e.target.value.trim();
                  setValue("risk", value, { shouldValidate: true });
                }}
                onKeyDown={(e) => {
                  if (e.key === " " && !e.currentTarget.value.trim()) {
                    e.preventDefault();
                  }
                }}
                error={errors.risk?.message}
              />
            </div>

            <div className={styles.topAlignment}>
              <Input
                label="Youtube Tutorial URL"
                leftSpaceRemove
                placeholder="Forex trading for complete beginners"
                bglight
                name="link"
                id="link"
                {...register("link")}
                onBlur={(e) => {
                  const value = e.target.value.trim();
                  setValue("link", value, { shouldValidate: true });
                }}
                onKeyDown={(e) => {
                  if (e.key === " " && !e.currentTarget.value.trim()) {
                    e.preventDefault();
                  }
                }}
                error={errors.link?.message}
              />
            </div>
            <div className={styles.modalFooter}>
              <Button text="Next" icon={SaveIcon} onClick={onNext} />
            </div>
          </div>
        )}
        {step === 2 && (
          <form
            className={styles.modalBody}
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit(onSubmitSecond)}
          >
            <div className={styles.selectWrapper}>
              <label>Plan Duration</label>
              <select
                className={styles.select}
                {...register("plan")}
                value={watch("plan")}
                onChange={(e) => {
                  const value = e.target.value;
                  setValue("plan", value, { shouldValidate: true });

                  if (planEdit && editingPlanId) {
                    setPlans((prev) =>
                      prev.map((plan) =>
                        plan._id === editingPlanId
                          ? { ...plan, planType: value }
                          : plan,
                      ),
                    );
                  }
                }}
              >
                <option value="" disabled>
                  Select duration
                </option>
                {[
                  { value: "1 Month", label: "1 month" },
                  { value: "3 Months", label: "3 months" },
                  { value: "6 Months", label: "6 months" },
                  { value: "9 Months", label: "9 months" },
                  { value: "12 Months", label: "12 months" },
                ]
                  .filter((planOption) => {
                    if (planEdit && editingPlanId) {
                      return true;
                    }
                    return !plans.some((p) => p.planType === planOption.value);
                  })
                  .map((planOption) => (
                    <option key={planOption.value} value={planOption.value}>
                      {planOption.label}
                    </option>
                  ))}
              </select>
            </div>
            {errors.plan && (
              <p className={styles.errorText}>
                {String(errors.plan?.message || "")}
              </p>
            )}

            <div className={styles.twoCol}>
              <Input
                label="Price"
                name="price"
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                onInput={(e) => {
                  const value = e.currentTarget.value;
                  if (value.includes(".")) {
                    const [whole, decimal] = value.split(".");
                    if (decimal && decimal.length > 2) {
                      e.currentTarget.value = `${whole}.${decimal.slice(0, 2)}`;
                    }
                  }
                }}
                {...register("price")}
                error={errors.price?.message}
              />
              <Input
                label="Discount"
                name="discount"
                id="discount"
                type="number"
                min="0"
                step="1"
                max="100"
                placeholder="0"
                onKeyDown={(e) => {
                  if (e.key === "." || e.key === "e") {
                    e.preventDefault(); // block decimal + exponential input
                  }
                }}
                onInput={(e) => {
                  // Force remove decimals if pasted
                  e.currentTarget.value = e.currentTarget.value.replace(
                    /\D/g,
                    "",
                  );
                }}
                {...register("discount")}
                error={errors?.discount?.message}
              />
              <div className={styles.selectWrapper}>
                <label>Bot Provider Company</label>
                <select
                  className={styles.select}
                  {...register("botProviderId")}
                  disabled={isFetchingProviders}
                  onChange={(e) => {
                    setValue("botProviderId", e.target.value, {
                      shouldValidate: true,
                    });
                  }}
                  value={watch("botProviderId")}
                >
                  <option value="" disabled>
                    Select Company
                  </option>
                  {providers.map((prov) => (
                    <option key={prov._id} value={prov._id}>
                      {prov.companyName}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.selectWrapper}>
                <label>Bot Name</label>
                <select
                  className={styles.select}
                  {...register("botId")}
                  onChange={(e) => {
                    setValue("botId", e.target.value, {
                      shouldValidate: true,
                    });
                  }}
                  value={watch("botId")}
                  disabled={!getValues().botProviderId || isFetchingBotsList}
                >
                  <option value="">
                    {getValues().botProviderId
                      ? "Select a bot"
                      : "Select a provider first"}
                  </option>
                  {filteredBots.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                type="submit"
                id="plan-form"
                className={styles.planButton}
                disabled={isLoading}
                onClick={(e) => {
                  e.preventDefault();
                  handleAddPlan();
                }}
              >
                {planEdit ? "Update Plan" : "Add Plan"}
              </button>
            </div>
            <div className={styles.plansSection}>
              <h4 className={styles.sectionTitle}>
                {plans?.length > 0 ? "Added Plans" : "No Plans Added Yet"}
              </h4>
              {plans?.length > 0 ? (
                <div className={styles.plansList}>
                  {plans.map((plan, index) => {
                    return (
                      <div key={plan._id || index} className={styles.planItem}>
                        <div className={styles.planDetails}>
                          <p>
                            <strong>Duration:</strong>{" "}
                            {plan.planType?.replace(
                              /(\d+)([A-Za-z]+)/,
                              "$1 $2",
                            ) || "N/A"}
                          </p>
                          <p>
                            <strong>Price:</strong>{" "}
                            {plan.initialPrice
                              ? `$${plan.initialPrice}`
                              : plan.price
                                ? `$${plan.price}`
                                : "N/A"}
                          </p>
                        </div>
                        <div className={styles.planActions}>
                          <button
                            type="button"
                            onClick={() => handleEditPlan(index)}
                            aria-label="Edit plan"
                          >
                            <Pencil className={styles.icon} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemovePlan(index)}
                            aria-label="Remove plan"
                          >
                            <Trash2 className={styles.icon} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p>Add your first plan using the form above</p>
              )}
            </div>
            <div className={styles.modalFooter}>
              <Button type="Submit" text="Save Algobot" icon={SaveIcon} />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
