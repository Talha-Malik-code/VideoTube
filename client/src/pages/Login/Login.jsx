import React, { useEffect, useState } from "react";
import Logo from "../../component/Logo";
import ThemeToggle from "../../component/ThemeToggle";
import Button from "../../component/Button";
import Input from "../../component/authInputComponents/Input";
import { validateLoginForm } from "../../../utils/validateLoginForm";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, checkAuthStatus } from "../../app/features/userSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const isLoading = useSelector((state) => state.user.status === "loading");
  const [error, setError] = useState(null);
  const [credentials, setCredentials] = useState({
    identity: "",
    password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));

    // Clear specific field error
    if (error && error[name]) {
      setError((prevError) => ({
        ...prevError,
        [name]: null,
      }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateLoginForm(credentials);
    setError(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const payload = {
        email: credentials.identity,
        password: credentials.password,
      };

      try {
        await dispatch(loginUser(payload)).unwrap();
        // Immediately fetch fresh user data with avatar
        await dispatch(checkAuthStatus()).unwrap();
        navigate("/");
      } catch (error) {
        console.error("Login failed:", error);
      }
    }
  }

  useEffect(() => {
    console.log(isLoggedIn);
    // Don't auto-navigate here since we handle it in handleSubmit
  }, [isLoggedIn]);

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
          value={credentials.identity}
          onChange={handleChange}
          error={error?.identity}
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
        <Button type="submit" className="mt-6" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </div>
    </form>
  );
};

export default Login;
