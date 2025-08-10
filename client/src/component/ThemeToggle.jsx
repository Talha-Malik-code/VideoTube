import { useEffect, useState } from "react";

export default function ThemeToggle({ small = false }) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "light" ? false : true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  let text = darkMode ? "🌙" : "☀️";
  text = small ? text : text + (darkMode ? " Dark Mode" : " Light Mode");

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="bg-yellow-200 dark:bg-gray-800 dark:text-white text-sm p-2 rounded"
      type="button"
    >
      {text}
    </button>
  );
}
