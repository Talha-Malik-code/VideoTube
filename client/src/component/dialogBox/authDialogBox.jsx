import React from "react";
import { Link } from "react-router-dom";
import AButton from "../AButton";

const AuthDialogBox = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Dialog Box */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-[#0f0f0f] shadow-2xl w-full max-w-md transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[#272727]">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Authentication Required
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-300 mb-6 text">
              Please login or create an account to continue with this action.
            </p>

            {/* Buttons */}
            <div className="space-y-3 flex justify-center">
              <div className="mb-8 mt-auto flex flex-col sm:flex-row sm:min-w-44 flex-wrap gap-4 px-4 sm:mb-0 sm:mt-0 sm:items-center sm:px-0">
                <Link onClick={onClose} to="/login">
                  <button className="w-full bg-gray-200 px-3 py-2 text-gray-800 hover:bg-[#4f4e4e] hover:text-white sm:w-auto sm:bg-transparent sm:text-gray-800 dark:bg-[#383737] dark:text-white dark:hover:bg-[#4f4e4e] sm:dark:bg-transparent sm:dark:text-white">
                    Log in
                  </button>
                </Link>
                <Link onClick={onClose} to="/register">
                  <AButton>Sign up</AButton>
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-[#1a1a1a]">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              By continuing, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthDialogBox;
