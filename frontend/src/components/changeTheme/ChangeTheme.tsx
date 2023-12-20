import { useLocalStorage } from "@hooks";
import React, { useEffect } from "react";

export default function ChangeTheme() {
  const [theme, setTheme] = useLocalStorage("theme", "");

  useEffect(() => {
    console.log("theme", theme);
    if (theme) return;
    const prefersDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDarkMode) {
      setTheme("dark");
    }
  }, [theme, setTheme]);

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
