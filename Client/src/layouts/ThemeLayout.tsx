'use client';

export const applyTheme = (newTheme: "light" | "dark") => {
  if (newTheme === "dark") {
    document.documentElement.classList.add("dark")
  } else {
    document.documentElement.classList.remove("dark")
  }
}