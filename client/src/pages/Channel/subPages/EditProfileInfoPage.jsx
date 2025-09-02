import React, { useState } from "react";
import FormPage from "../../../component/form/FormPage";
import FormCard from "../../../component/form/FormCard";
import Input from "../../../component/form/Input";
import Button from "../../../component/Button";
import CancelButton from "../../../component/CancelButton";
import EmailIcon from "../../../component/iconComponents/EmailIcon";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsUpdatingProfileInfo,
  selectUserData,
  updateProfileInfo,
} from "../../../app/features/userSlice";
import { validateEditProfileForm } from "../../../../utils/validateEditProfileForm";
import { updateCachedChannelProfileInfo } from "../../../app/features/channelSlice";

const EditProfileInfoPage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUserData);
  const isUpdatingProfileInfo = useSelector(selectIsUpdatingProfileInfo);
  const [formData, setFormData] = useState({
    firstName: user?.fullName?.split(" ")[0] || "",
    lastName: user?.fullName?.split(" ")[1] || "",
    email: user?.email || "",
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

  const handleSave = async () => {
    const validationErrors = validateEditProfileForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    const updateData = {
      fullName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
    };
    const profileInfo = await dispatch(updateProfileInfo(updateData)).unwrap();
    if (profileInfo) {
      dispatch(
        updateCachedChannelProfileInfo({ username: user.username, profileInfo })
      );
    }
  };

  const handleCancel = () => {
    console.log("Cancelling profile edit");
    setFormData({
      firstName: user?.fullName?.split(" ")[0] || "",
      lastName: user?.fullName?.split(" ")[1] || "",
      email: user?.email || "",
    });
    setErrors({});
    // Reset form to original values if needed
  };

  const footer = (
    <>
      <CancelButton onClick={handleCancel}>Cancel</CancelButton>
      <Button
        className={`px-3 py-1.5 ${
          isUpdatingProfileInfo
            ? "dark:bg-[#9d6aee] bg-[#ae7aff] cursor-not-allowed"
            : ""
        }`}
        onClick={handleSave}
        disabled={isUpdatingProfileInfo}
      >
        {isUpdatingProfileInfo ? "Saving..." : "Save changes"}
      </Button>
    </>
  );

  return (
    <FormPage
      title="Personal Info"
      description="Update your photo and personal details."
    >
      <FormCard footer={footer}>
        <Input
          label="First name"
          id="firstname"
          placeholder="Enter first name"
          value={formData.firstName}
          onChange={(e) => handleInputChange("firstName", e.target.value)}
          width="w-full lg:w-1/2 lg:pr-2"
          error={errors.firstName}
        />

        <Input
          label="Last name"
          id="lastname"
          placeholder="Enter last name"
          value={formData.lastName}
          onChange={(e) => handleInputChange("lastName", e.target.value)}
          width="w-full lg:w-1/2 lg:pl-2"
          error={errors.lastName}
        />

        <Input
          label="Email address"
          id="email"
          type="email"
          placeholder="Enter email address"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          icon={EmailIcon}
          error={errors.email}
        />
      </FormCard>
    </FormPage>
  );
};

export default EditProfileInfoPage;
