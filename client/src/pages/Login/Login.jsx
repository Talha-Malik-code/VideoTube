import React, { useState } from "react";
import Logo from "../../component/Logo";
import ThemeToggle from "../../component/ThemeToggle";
import Button from "../../component/Button";
import Input from "../../component/Input";
import FileInput from "../../component/FileInput";

const Login = () => {
  const [profileImg, setProfileImg] = useState(null);
  const [coverImg, setCoverImg] = useState(null);

  return (
    <div className="h-screen overflow-y-hidden bg-gray-100 text-gray-900 dark:bg-[#121212] dark:text-white">
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>
      <div className="flex md:mt-48 mx-auto my-8 w-full max-w-sm flex-col px-4">
        <div className="mx-auto inline-block w-16">
          <Logo />
        </div>
        <div className="mb-6 w-full text-center text-2xl font-semibold uppercase">
          Video Tube
        </div>
        <Input label="Email*" type="email" placeholder="Enter your email" />
        <Input
          label="Username*"
          type="text"
          placeholder="Enter your username"
        />
        <Input
          label="Password*"
          type="password"
          placeholder="Enter your Password"
        />
        <Input
          label="Confirm Password*"
          type="password"
          placeholder="Enter your Confirm Password"
        />
        {/* <label htmlFor="profile">
          <div className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <span className="ml-2">Upload Profile</span>
          </div>
        </label>
        <input
          className="sr-only"
          type="file"
          name="profile"
          id="profile"
          accept="image/*"
        /> */}
        <FileInput
          label="Upload Profile Image"
          onChange={(e) => setProfileImg(e.target.files[0])}
          file={profileImg}
        />
        <FileInput
          className="mt-1"
          label="Upload Cover Image"
          onChange={(e) => setCoverImg(e.target.files[0])}
          file={coverImg}
        />
        <Button className="mt-6">Sign in with Email</Button>
      </div>
    </div>
  );
};

export default Login;
