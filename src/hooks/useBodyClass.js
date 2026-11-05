import { useEffect } from "react";

// The original CSS styles pages through a class on <body>
// (login-page, signup-page, student-page, admin-page).
export default function useBodyClass(className) {
  useEffect(() => {
    if (!className) return undefined;
    document.body.classList.add(className);
    return () => document.body.classList.remove(className);
  }, [className]);
}
