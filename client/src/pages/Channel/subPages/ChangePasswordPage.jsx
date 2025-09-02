import React, { useState } from "react";
import FormPage from "../../../component/form/FormPage";
import FormCard from "../../../component/form/FormCard";
import Input from "../../../component/form/Input";
import Button from "../../../component/Button";
import CancelButton from "../../../component/CancelButton";
import { validateChangePasswordForm } from "../../../../utils/validateChangePasswordForm";

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleUpdatePassword = () => {
    const validationErrors = validateChangePasswordForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    console.log("Updating password");
    // Handle password update logic here
  };

  const handleCancel = () => {
    console.log("Cancelling password change");
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  const footer = (
    <>
      <CancelButton onClick={handleCancel}>Cancel</CancelButton>
      <Button
        bgColor="bg-[#ae7aff]"
        textColor="text-black"
        className="px-3 py-1.5"
        onClick={handleUpdatePassword}
      >
        Update Password
      </Button>
    </>
  );

  return (
    <FormPage
      title="Password"
      description="Please enter your current password to change your password."
    >
      <FormCard footer={footer}>
        <Input
          label="Current password"
          id="old-pwd"
          type="password"
          placeholder="Current password"
          value={formData.currentPassword}
          onChange={(e) => handleInputChange("currentPassword", e.target.value)}
          error={errors.currentPassword}
          autoComplete="current-password"
        />

        <Input
          label="New password"
          id="new-pwd"
          type="password"
          placeholder="New password"
          value={formData.newPassword}
          onChange={(e) => handleInputChange("newPassword", e.target.value)}
          helpText="Your new password must be more than 8 characters."
          error={errors.newPassword}
          autoComplete="new-password"
        />

        <Input
          label="Confirm password"
          id="cnfrm-pwd"
          type="password"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />
      </FormCard>
    </FormPage>
  );
};

export default ChangePasswordPage;
