import React from "react";
import Logo from "./Logo";
import AButton from "./AButton";
import CloseCircleIcon from "./iconComponents/CloseCircleIcon";
import { useSelector } from "react-redux";
import { selectUserData } from "../app/features/userSlice";
import { Link } from "react-router-dom";

const HeaderSecondary = () => {
  const user = useSelector(selectUserData);

  return (
    <header className="sticky inset-x-0 top-0 z-50 w-full border-b bg-white px-4 text-gray-800 dark:border-white dark:bg-[#121212] dark:text-white">
      <nav className="mx-auto flex max-w-7xl items-center py-2">
        {/* Logo */}
        <div className="mr-4 w-12 shrink-0 sm:w-16">
          <Logo />
        </div>

        {/* Mobile Menu Hamburger */}
        <button className="group peer ml-auto flex w-6 shrink-0 flex-wrap gap-y-1.5 md:hidden">
          <span className="block h-[2px] w-full bg-gray-800 group-hover:bg-[#5936D9] dark:bg-white dark:group-hover:bg-[#ae7aff]" />
          <span className="block h-[2px] w-2/3 bg-gray-800 group-hover:bg-[#5936D9] dark:bg-white dark:group-hover:bg-[#ae7aff]" />
          <span className="block h-[2px] w-full bg-gray-800 group-hover:bg-[#5936D9] dark:bg-white dark:group-hover:bg-[#ae7aff]" />
        </button>

        {/* Slide-in mobile menu & Desktop container */}
        <div className="fixed inset-y-0 right-0 flex w-full max-w-xs shrink-0 translate-x-full flex-col justify-between border-l border-gray-200 bg-white text-gray-800 duration-200 hover:translate-x-0 peer-focus:translate-x-0 dark:border-white dark:bg-[#121212] dark:text-white md:static md:ml-4 md:max-w-full md:shrink md:translate-x-0 md:flex-row md:border-none">
          {/* Mobile header (logo + close) */}
          <div className="relative flex w-full items-center justify-between border-b border-gray-200 px-4 py-2 dark:border-white md:hidden">
            <span className="inline-block w-12">
              <Logo />
            </span>
            <button className="inline-block w-8 text-gray-800 dark:text-white">
              <CloseCircleIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Nav items */}
          <ul className="my-4 flex w-full flex-wrap gap-2 px-4 md:my-0 md:w-auto md:px-0">
            <li className="w-full md:w-auto">
              <button className="flex w-full items-center justify-start gap-x-4 border border-gray-300 px-4 py-1.5 text-left text-gray-800 hover:bg-[#ae7aff] hover:text-black focus:border-[#ae7aff] focus:bg-[#ae7aff] focus:text-black dark:border-white dark:text-white md:border-none">
                <span>Home</span>
              </button>
            </li>
            <li className="w-full md:w-auto">
              <button className="flex w-full items-center justify-start gap-x-4 border border-gray-300 px-4 py-1.5 text-left text-gray-800 hover:bg-[#ae7aff] hover:text-black focus:border-[#ae7aff] focus:bg-[#ae7aff] focus:text-black dark:border-white dark:text-white md:border-none">
                <span>Products</span>
              </button>
            </li>
            <li className="w-full md:w-auto">
              <button className="flex w-full items-center justify-start gap-x-4 border border-gray-300 px-4 py-1.5 text-left text-gray-800 hover:bg-[#ae7aff] hover:text-black focus:border-[#ae7aff] focus:bg-[#ae7aff] focus:text-black dark:border-white dark:text-white md:border-none">
                <span>Resources</span>
              </button>
            </li>
            <li className="w-full md:w-auto">
              <button className="flex w-full items-center justify-start gap-x-4 border border-gray-300 px-4 py-1.5 text-left text-gray-800 hover:bg-[#ae7aff] hover:text-black focus:border-[#ae7aff] focus:bg-[#ae7aff] focus:text-black dark:border-white dark:text-white md:border-none">
                <span>Pricing</span>
              </button>
            </li>
          </ul>

          {/* Auth buttons */}
          {user ? (
            <div className="mb-8 mt-auto px-4 md:mb-0 md:mt-0 md:px-0">
              <button className="flex w-full gap-4 text-left md:items-center">
                <img
                  src={user?.avatar}
                  alt={user?.fullName}
                  className="h-16 w-16 shrink-0 rounded-full md:h-12 md:w-12"
                />
                <div className="w-full pt-2 md:hidden">
                  <h6 className="font-semibold">{user.fullName}</h6>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    @{user.username}
                  </p>
                </div>
              </button>
            </div>
          ) : (
            <div className="mb-8 mt-auto flex flex-wrap gap-4 px-4 md:mb-0 md:mt-0 md:items-center md:px-0">
              <Link to="/login">
                <button className="w-full bg-gray-200 px-3 py-2 text-gray-800 hover:bg-[#4f4e4e] hover:text-white md:w-auto md:bg-transparent md:text-gray-800 dark:bg-[#383737] dark:text-white dark:hover:bg-[#4f4e4e] md:dark:bg-transparent md:dark:text-white">
                  Log in
                </button>
              </Link>
              <Link to="/register">
                <AButton>Sign up</AButton>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default HeaderSecondary;
