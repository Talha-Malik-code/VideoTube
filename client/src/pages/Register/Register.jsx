import React, { useState } from "react";
import Logo from "../../component/Logo";
import ThemeToggle from "../../component/ThemeToggle";
import Button from "../../component/Button";
import Input from "../../component/authInputComponents/Input";
import FileInput from "../../component/authInputComponents/FileInput";
import { Check, X } from "lucide-react";
import { validateRegistrationForm } from "../../../utils/validateRegistrationForm";

const Register = () => {
  const [profileImg, setProfileImg] = useState(null);
  const [coverImg, setCoverImg] = useState(null);
  const [error, setError] = useState(null);
  const [credentials, setCredentials] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e) {
    e.preventDefault();
    const { name, value } = e.target;

    setCredentials((prevCradentials) => ({
      ...prevCradentials,
      [name]: value,
    }));

    setError((prevError) => ({
      ...prevError,
      [name]: null,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateRegistrationForm(profileImg, credentials);
    setError(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Form submutted: ", {
        cradentials: credentials,
        profileImg,
        coverImg,
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="h-screen overflow-y-auto bg-gray-100 text-gray-900 dark:bg-[#121212] dark:text-white"
    >
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>
      <div className="flex md:mt-32 mx-auto my-8 w-full max-w-sm flex-col px-4">
        <div className="mx-auto inline-block w-16">
          <Logo />
        </div>
        <div className="mb-6 w-full text-center text-2xl font-semibold uppercase">
          Video Tube
        </div>
        <Input
          label="Email*"
          type="email"
          placeholder="Enter your email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          error={error?.email}
        />
        <Input
          label="Username*"
          type="text"
          placeholder="Enter your username"
          name="username"
          value={credentials.username}
          onChange={handleChange}
          error={error?.username}
        />
        <Input
          label="Password*"
          type="password"
          placeholder="Enter your Password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          error={error?.password}
        />
        <Input
          label="Confirm Password*"
          type="password"
          placeholder="Enter your Confirm Password"
          name="confirmPassword"
          value={credentials.confirmPassword}
          onChange={handleChange}
          error={error?.confirmPassword}
        />
        <label className="mb-1 inline-block text-gray-600 dark:text-gray-300">
          Profile Image*
        </label>
        <FileInput
          className="text-nowrap"
          label="Upload Profile Image*"
          onChange={(e) => setProfileImg(e.target.files[0])}
          file={profileImg}
          error={error?.profileImg}
        />
        <label className="mt-2 inline-block text-gray-600 dark:text-gray-300">
          Cover Image
        </label>
        <FileInput
          className="mt-1 text-nowrap"
          label="Upload Cover Image"
          onChange={(e) => setCoverImg(e.target.files[0])}
          file={coverImg}
        />
        <Button type="submit" className="mt-6">
          Sign up with Email
        </Button>
      </div>
    </form>
  );
};

export default Register;
