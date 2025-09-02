import React, { useState } from "react";
import FormPage from "../../../component/form/FormPage";
import FormCard from "../../../component/form/FormCard";
import Input from "../../../component/form/Input";
import Textarea from "../../../component/form/Textarea";
import Select from "../../../component/form/Select";
import Button from "../../../component/Button";
import CancelButton from "../../../component/CancelButton";
import TextEditorToolbar from "../../../component/form/TextEditorToolbar";
import ClockIcon from "../../../component/iconComponents/ClockIcon";
import { timezoneOptions } from "../../../data/timezones";
import { validateEditChannelForm } from "../../../../utils/validateEditChannelForm";
import { useDispatch, useSelector } from "react-redux";
import {
  selectError,
  selectIsUpdatingChannelInfo,
  selectUserData,
  updateChannelInfo,
} from "../../../app/features/userSlice";
import { updateCachedChannelChannelInfo } from "../../../app/features/channelSlice";
import { useNavigate } from "react-router-dom";

const EditChannelInfoPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUserData);
  const error = useSelector(selectError);
  const isUpdatingChannelInfo = useSelector(selectIsUpdatingChannelInfo);
  const [formData, setFormData] = useState({
    username: user?.username,
    description: user?.description,
    fontWeight: "regular",
    timezone: "UTC-12:00",
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
    const validationErrors = validateEditChannelForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    const oldUsername = user.username;
    const newInfo = await dispatch(
      updateChannelInfo({ username: formData.username })
    );
    if (newInfo.meta.requestStatus === "fulfilled") {
      dispatch(
        updateCachedChannelChannelInfo({
          username: oldUsername,
          newUsername: formData.username,
        })
      );
      navigate(`/channel/${formData.username}?edit=true&subpage=edit_channel`);
    } else {
      setErrors({ username: error });
    }
  };

  const handleCancel = () => {
    console.log("Cancelling channel edit");
    setErrors({});
    // Reset form to original values if needed
  };

  const handleToolbarAction = (action) => {
    console.log("Toolbar action:", action);
    // Handle text formatting actions
  };

  // const remainingChars = 275 - formData.description.length;

  const footer = (
    <>
      <CancelButton onClick={handleCancel}>Cancel</CancelButton>
      <Button
        className={`px-3 py-1.5 ${
          isUpdatingChannelInfo
            ? "dark:bg-[#9d6aee] bg-[#ae7aff] cursor-not-allowed"
            : ""
        }`}
        onClick={handleSave}
        disabled={isUpdatingChannelInfo || user?.username === formData.username}
      >
        {isUpdatingChannelInfo ? "Saving..." : "Save changes"}
      </Button>
    </>
  );

  return (
    <FormPage
      title="Channel Info"
      description="Update your Channel details here."
    >
      <FormCard footer={footer}>
        <Input
          label="Username"
          id="username"
          placeholder="@username"
          value={formData.username}
          onChange={(e) => handleInputChange("username", e.target.value)}
          prefix="vidtube.com/"
          error={errors.username}
        />

        <Textarea
          label="Description"
          id="desc"
          placeholder="Channel Description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          rows={4}
          maxLength={275}
          showCharCount={true}
          error={errors.description}
          disabled={true}
        />

        <TextEditorToolbar
          fontWeight={formData.fontWeight}
          onFontWeightChange={(e) =>
            handleInputChange("fontWeight", e.target.value)
          }
          onBoldClick={() => handleToolbarAction("bold")}
          onItalicClick={() => handleToolbarAction("italic")}
          onLinkClick={() => handleToolbarAction("link")}
          onListClick={() => handleToolbarAction("unorderedList")}
          onOrderedListClick={() => handleToolbarAction("orderedList")}
        />

        <Select
          label="Timezone"
          id="timezone"
          options={timezoneOptions}
          value={formData.timezone}
          onChange={(e) => handleInputChange("timezone", e.target.value)}
          icon={ClockIcon}
          error={errors.timezone}
        />
        <p className="text-center text-sm text-gray-600 dark:text-gray-300">
          Note: Change username to save changes
        </p>
      </FormCard>
    </FormPage>
  );
};

export default EditChannelInfoPage;
