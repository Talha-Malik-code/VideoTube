import React from "react";
import Logo from "./Logo";
import AButton from "./AButton";
import SearchIcon from "./iconComponents/SearchIcon";
import CloseCircleIcon from "./iconComponents/CloseCircleIcon";
import ThumbsUpIcon from "./iconComponents/ThumbsUpIcon";
import PlayRectangleIcon from "./iconComponents/PlayRectangleIcon";
import TargetIcon from "./iconComponents/TargetIcon";
import GearIcon from "./iconComponents/GearIcon";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, selectUserData } from "../app/features/userSlice";
import { Link } from "react-router-dom";

const Header = () => {
  const user = useSelector(selectUserData);
  const dispatch = useDispatch();
  const [openMenu, setOpenMenu] = React.useState(false);
  function handleLogout() {
    dispatch(logoutUser());
    setOpenMenu(false);
  }

  return (
    <header className="sticky inset-x-0 top-0 z-50 w-full border-b border-gray-200 bg-white px-4 dark:border-white dark:bg-[#121212]">
      <nav className="mx-auto flex max-w-7xl items-center py-2">
        {/* Logo */}
        <div className="mr-4 w-12 shrink-0 sm:w-16">
          <Logo />
        </div>

        {/* Desktop Search */}
        <div className="relative mx-auto hidden w-full max-w-md min-w-0 overflow-hidden sm:block">
          <input
            className="w-full border border-gray-300 bg-gray-50 py-1 pl-8 pr-3 text-gray-900 placeholder-gray-500 outline-none dark:border-white dark:bg-transparent dark:text-white dark:placeholder-white sm:py-2"
            placeholder="Search"
          />
          <span className="absolute left-2.5 top-1/2 inline-block -translate-y-1/2">
            <SearchIcon className="h-4 w-4 text-gray-500 dark:text-white" />
          </span>
        </div>

        {/* Mobile Search Button */}
        <button className="ml-auto text-gray-800 dark:text-white sm:hidden">
          <SearchIcon className="h-6 w-6" />
        </button>

        {/* Mobile Menu Hamburger */}
        <button className="group peer ml-4 flex w-6 shrink-0 flex-wrap gap-y-1.5 sm:hidden">
          <span className="block h-[2px] w-full bg-gray-800 group-hover:bg-[#5936D9] dark:bg-white dark:group-hover:bg-[#ae7aff]" />
          <span className="block h-[2px] w-2/3 bg-gray-800 group-hover:bg-[#5936D9] dark:bg-white dark:group-hover:bg-[#ae7aff]" />
          <span className="block h-[2px] w-full bg-gray-800 group-hover:bg-[#5936D9] dark:bg-white dark:group-hover:bg-[#ae7aff]" />
        </button>

        {/* Slide-in mobile menu & Desktop buttons container */}
        <div className="fixed inset-y-0 right-0 flex w-full max-w-xs translate-x-full flex-col border-l border-gray-200 bg-white duration-200 hover:translate-x-0 peer-focus:translate-x-0 dark:border-l-white dark:bg-[#121212] sm:static sm:ml-4 sm:w-auto sm:translate-x-0 sm:border-none">
          {/* Mobile header (logo + close) */}
          <div className="relative flex w-full items-center justify-between border-b border-gray-200 px-4 py-2 dark:border-b-white sm:hidden">
            <span className="inline-block w-12">
              <Logo />
            </span>
            <button className="inline-block w-8 text-gray-800 dark:text-white">
              <CloseCircleIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile menu list */}
          <ul className="my-4 flex w-full flex-wrap gap-2 px-4 sm:hidden">
            <li className="w-full">
              <button className="flex w-full items-center justify-start gap-x-4 border border-gray-300 bg-gray-50 px-4 py-1.5 text-left text-gray-800 hover:bg-[#ae7aff] hover:text-black focus:border-[#ae7aff] focus:bg-[#ae7aff] focus:text-black dark:border-white dark:bg-transparent dark:text-white dark:hover:bg-[#ae7aff] dark:hover:text-black dark:focus:border-[#ae7aff] dark:focus:bg-[#ae7aff] dark:focus:text-black">
                <span className="inline-block w-full max-w-[20px]">
                  <ThumbsUpIcon />
                </span>
                <span>Liked Videos</span>
              </button>
            </li>

            <li className="w-full">
              <button className="flex w-full items-center justify-start gap-x-4 border border-gray-300 bg-gray-50 px-4 py-1.5 text-left text-gray-800 hover:bg-[#ae7aff] hover:text-black focus:border-[#ae7aff] focus:bg-[#ae7aff] focus:text-black dark:border-white dark:bg-transparent dark:text-white dark:hover:bg-[#ae7aff] dark:hover:text-black dark:focus:border-[#ae7aff] dark:focus:bg-[#ae7aff] dark:focus:text-black">
                <span className="inline-block w-full max-w-[20px]">
                  <PlayRectangleIcon />
                </span>
                <span>My Content</span>
              </button>
            </li>

            <li className="w-full">
              <button className="flex w-full items-center justify-start gap-x-4 border border-gray-300 bg-gray-50 px-4 py-1.5 text-left text-gray-800 hover:bg-[#ae7aff] hover:text-black focus:border-[#ae7aff] focus:bg-[#ae7aff] focus:text-black dark:border-white dark:bg-transparent dark:text-white dark:hover:bg-[#ae7aff] dark:hover:text-black dark:focus:border-[#ae7aff] dark:focus:bg-[#ae7aff] dark:focus:text-black">
                <span className="inline-block w-full max-w-[20px]">
                  <TargetIcon />
                </span>
                <span>Support</span>
              </button>
            </li>

            <li className="w-full">
              <button className="flex w-full items-center justify-start gap-x-4 border border-gray-300 bg-gray-50 px-4 py-1.5 text-left text-gray-800 hover:bg-[#ae7aff] hover:text-black focus:border-[#ae7aff] focus:bg-[#ae7aff] focus:text-black dark:border-white dark:bg-transparent dark:text-white dark:hover:bg-[#ae7aff] dark:hover:text-black dark:focus:border-[#ae7aff] dark:focus:bg-[#ae7aff] dark:focus:text-black">
                <span className="inline-block w-full max-w-[20px]">
                  <GearIcon />
                </span>
                <span>Settings</span>
              </button>
            </li>
          </ul>

          {/* Auth buttons */}
          {user ? (
            <div className="relative mb-8 mt-auto px-4 sm:mb-0 sm:mt-0 sm:px-0">
              <button
                className="flex w-full gap-4 text-left sm:items-center"
                onClick={() => setOpenMenu((v) => !v)}
              >
                <img
                  src={user?.avatar}
                  alt={user?.fullName}
                  className="h-16 w-16 shrink-0 rounded-full sm:h-12 sm:w-12"
                />
                <div className="w-full pt-2 sm:hidden">
                  <h6 className="font-semibold">{user.fullName}</h6>
                  <p className="text-sm text-gray-300">@{user.username}</p>
                </div>
              </button>
              {openMenu && (
                <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-md border border-gray-200 bg-white p-2 text-gray-800 shadow dark:border-white/40 dark:bg-[#121212] dark:text-white">
                  <button
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-white/10"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="mb-8 mt-auto flex flex-col sm:flex-row sm:min-w-44 flex-wrap gap-4 px-4 sm:mb-0 sm:mt-0 sm:items-center sm:px-0">
              <Link to="/login">
                <button className="w-full bg-gray-200 px-3 py-2 text-gray-800 hover:bg-[#4f4e4e] hover:text-white sm:w-auto sm:bg-transparent sm:text-gray-800 dark:bg-[#383737] dark:text-white dark:hover:bg-[#4f4e4e] sm:dark:bg-transparent  sm:dark:text-white">
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

export default Header;
