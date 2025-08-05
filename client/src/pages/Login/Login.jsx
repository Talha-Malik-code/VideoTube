import React, { useState } from "react";
import Logo from "../../component/Logo";
import ThemeToggle from "../../component/ThemeToggle";
import Button from "../../component/Button";
import Input from "../../component/Input";
import { validateLoginForm } from "../../../utils/validateLoginForm";

const Login = () => {
  const [error, setError] = useState(null);
  const [credentials, setCredentials] = useState({
    identity: "",
    password: "",
  });

  function handleChange(e) {
    e.preventDefault();
    const { name, value } = e.target;

    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));

    setError((prevError) => ({
      ...prevError,
      [name]: null,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateLoginForm(credentials);
    setError(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Form submutted: ", { credentials });
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
      <div className="flex md:mt-48 mx-auto my-8 w-full max-w-sm flex-col px-4">
        <div className="mx-auto inline-block w-16">
          <Logo />
        </div>
        <div className="mb-6 w-full text-center text-2xl font-semibold uppercase">
          Video Tube
        </div>
        <Input
          label="Username or Email*"
          type="text"
          placeholder="Enter your username or email"
          name="identity"
          onChange={handleChange}
          error={error?.identity}
        />
        <Input
          label="Password*"
          type="password"
          placeholder="Enter your Password"
          name="password"
          onChange={handleChange}
          error={error?.password}
        />
        <Button type="submit" className="mt-6">
          Sign in
        </Button>
      </div>
    </form>
  );
};

export default Login;
