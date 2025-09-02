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

const EditChannelInfoPage = () => {
  const [formData, setFormData] = useState({
    username: "reactpatterns",
    description:
      "I'm a Product Designer based in Melbourne, Australia. I specialise in UX/UI design, brand strategy, and Webflow development.",
    fontWeight: "regular",
    timezone: "UTC+05:30",
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

  const handleSave = () => {
    const validationErrors = validateEditChannelForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    console.log("Saving channel info:", formData);
    // Handle save logic here
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

  const remainingChars = 275 - formData.description.length;

  const footer = (
    <>
      <CancelButton onClick={handleCancel}>Cancel</CancelButton>
      <Button
        bgColor="bg-[#ae7aff]"
        textColor="text-black"
        className="px-3 py-1.5"
        onClick={handleSave}
      >
        Save changes
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
          prefix="vidplay.com/"
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
      </FormCard>
    </FormPage>
  );
};

export default EditChannelInfoPage;
