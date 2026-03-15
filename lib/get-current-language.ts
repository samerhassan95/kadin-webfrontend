/**
 * Utility function to get the current language locale
 * This ensures consistent language detection across all services
 */
export const getCurrentLanguage = (): string => {
  if (typeof window !== "undefined") {
    try {
      // Get language from localStorage (stored by language-utils)
      const savedLang = localStorage.getItem("lang");
      if (savedLang) {
        return savedLang;
      }
    } catch (error) {
      console.warn("Failed to get language from localStorage:", error);
    }
  }
  return "en";
};

/**
 * Get language with fallback to cookies (for SSR)
 */
export const getLanguageWithFallback = (cookieLang?: string): string => {
  // Try localStorage first (client-side)
  const clientLang = getCurrentLanguage();
  if (clientLang !== "en") {
    return clientLang;
  }

  // Fallback to cookie value (SSR)
  return cookieLang || "en";
};
