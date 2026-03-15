export const initializeLanguage = () => {
  if (typeof window === "undefined") return null;

  try {
    const storedLang = localStorage.getItem("lang") || "en";
    const storedDir = localStorage.getItem("dir") || "ltr";

    // Set document attributes safely using setAttribute
    if (document && document.documentElement) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        try {
          if (document.documentElement) {
            document.documentElement.setAttribute("lang", storedLang);
            document.documentElement.setAttribute("dir", storedDir);
          }
        } catch (domError) {
          console.warn("DOM update error in initializeLanguage:", domError);
        }
      });
    }

    return { language: storedLang, direction: storedDir };
  } catch (error) {
    console.error("Error initializing language:", error);
    return { language: "en", direction: "ltr" };
  }
};

export const persistLanguage = (language: string, direction: string) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("lang", language);
    localStorage.setItem("dir", direction);

    // Update document attributes safely using setAttribute
    if (document && document.documentElement) {
      // Use requestAnimationFrame to batch DOM updates
      requestAnimationFrame(() => {
        try {
          if (document.documentElement) {
            document.documentElement.setAttribute("lang", language);
            document.documentElement.setAttribute("dir", direction);
          }
        } catch (domError) {
          console.warn("DOM update error in persistLanguage:", domError);
        }
      });
    }
  } catch (error) {
    console.error("Error persisting language:", error);
  }
};
