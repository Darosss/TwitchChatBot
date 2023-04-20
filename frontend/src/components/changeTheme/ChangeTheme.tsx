import React, { useEffect, useState } from "react";

export default function ChangeTheme() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const prefersDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDarkMode) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleThemeChange = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      className={`common-button ${
        theme === "light" ? "secondary-button" : "primary-button"
      }`}
      onClick={handleThemeChange}
    >
      {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
    </button>
  );
}
